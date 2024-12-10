"use server";

import { db } from "@/lib/db";
import { ProductSchema } from "@/schemas";
import { NotificationAction, ProductRequestStatus, ProductRequestType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sendNotification } from "./notification.actions";


// Get all product requests
export async function getAllProductRequests() {
    try {
        const requests = await db.productRequest.findMany({
            include: {
                supplier: {
                    include: {
                        user: true,
                    },
                },
                images: true,
                approvisionment: true
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return requests;
    } catch (error: any) {
        throw new Error(`Error fetching product requests: ${error.message}`);
    }
}

// Create an add product request
export async function addProductRequest(supplierId: string, values: z.infer<typeof ProductSchema>) {
    try {
        const validatedFields = ProductSchema.safeParse(values);

        if (!validatedFields.success) {
            return { error: "Invalid fields!" };
        }

        const { name, categoryId, price, stock, description, images,approvisionment } = validatedFields.data;


        const addProductRequest = await db.productRequest.create({
            data: {
                type: ProductRequestType.CREATE,
                name,
                price,
                description,
                categoryId,
                supplierId,
                images: {
                    createMany: {
                        data: images.map((image: { url: string }) => ({
                            url: image.url
                        })),
                    },
                },
                approvisionment: {
                    create: {
                        approvisionment,
                        quantity: stock
                    }
                }
            },
        });

        return addProductRequest;
    } catch (error: any) {
        console.log(error.message);
        throw new Error(`An error occurred while create add product request. ${error.message}`);
    }
}

// Create update product request
export async function updateProductRequest(productId: string, supplierId: string, values: z.infer<typeof ProductSchema>) {
    try {


        const { name, categoryId, price, stock, description, images ,approvisionment } = values;

        await db.productRequest.deleteMany({
            where: {
                productId,
                status: ProductRequestStatus.PENDING,
            },
        });


        const updateProductRequest = await db.productRequest.create({
            data: {
                type: ProductRequestType.UPDATE,
                name,
                price,
                description,
                categoryId,
                supplierId,
                productId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image),
                        ],
                    },

                },
                approvisionment: {
                  create: {
                      approvisionment,
                      quantity: stock
                  }
              }
            },
        });

        return updateProductRequest;
    } catch (error: any) {
        throw new Error(`An error occurred while creating an update product request: ${error.message}`);
    }
}

// Create delete product request
export async function deleteProductRequest(productId: string, supplierId: string, approvisionment: Date, path: string) {
    try {
        const product = await db.product.findUnique({
            where: {
                id: productId,
            },
        });

        if (!product) {
            throw new Error("Product not found!");
        }

        const deleteProductRequest = await db.productRequest.create({
            data: {
                name: product.name,
                price: product.price,
                description: product.description,
                categoryId: product.categoryId,
                type: ProductRequestType.DELETE,
                supplierId,
                productId,
                approvisionment: {
                    create: {
                        approvisionment,
                        quantity: -product?.stock 
                    }
                }
            },
        });

        revalidatePath(path);
        
        return deleteProductRequest;
    } catch (error) {
        throw new Error("An error occurred while creating a delete product request.");
    }
}

// Approve add product request
export async function approveAddProductRequest(requestId: string, path: string) {
    try {
        const request = await db.productRequest.findUnique({
            where: {
                id: requestId,
            },
            include: {
                images: true,
                supplier: {
                    include: {
                        user: true,
                    },
                },
                approvisionment: true
            }
        });

        if (!request) {
            return { error: "Request not found!" };
        }

        await db.product.create({
            data: {
                name: request.name || "",
                price: request.price || 0,
                stock: request. approvisionment?.quantity || 0,
                description: request.description || "",
                categoryId: request.categoryId || "",
                supplierId: request.supplierId || "",
                userId: request.supplier?.userId || "",
                images: {
                    createMany: {
                        data: request.images.map((image: any) => ({
                            url: image.url
                        })),
                    },
                },
            },
        });


        await db.productRequest.update({
            where: {
                id: requestId,
            },
            data: {
                status: ProductRequestStatus.ACCEPTED,
            },
        });

        // send notification to the supplier
        await sendNotification(request?.supplier?.userId || "", "Add Product Request Approved", `Your product request to add ${request.name} has been approved.`, "/supplier/products", NotificationAction.APPROVE_PRODUCT_REQUEST);
        
        revalidatePath(path);
        
        return { success: true };
    } catch (error: any) {
        console.log(error.message);
        throw new Error("An error occurred while approving add product request.");
    }
}

// Approve update product request
export async function approveUpdateProductRequest(requestId: string, path: string) {
    try {
        const request = await db.productRequest.findUnique({
            where: {
                id: requestId,
            },
            include: {
                images: true,
                approvisionment: true,
                supplier: true
            },
        });

        if (!request) {
            return { error: "Request not found!" };
        }

        await db.product.update({
            where: {
                id: request.productId || "",
            },
            data: {
                images: {
                    deleteMany: {},
                },
            },
        });

        await db.product.update({
            where: {
                id: request.productId || "",
            },
            data: {
                name: request.name || "",
                price: request.price || 0,
                stock: {
                    increment: request.approvisionment?.quantity || 0
                },
                description: request.description || "",
                categoryId: request.categoryId || "",
                images: {
                    createMany: {
                        data: request.images.map((image: any) => ({
                            url: image.url
                        })),
                    },
                },
            },
        });


        await db.productRequest.update({
            where: {
                id: requestId,
            },
            data: {
                status: ProductRequestStatus.ACCEPTED,
            },
        });
        
        // send notification to the supplier
        await sendNotification(request?.supplier?.userId || "", "Update Product Request Approved", `Your product request to update ${request.name} has been approved.`, "/supplier/products", NotificationAction.APPROVE_PRODUCT_REQUEST);
        
        revalidatePath(path);
        return { success: true };
    } catch (error: any) {
        console.log(error.message);
        throw new Error(`An error occurred while approving update product request: ${error.message}`);
    }
}

// Approve delete product request
export async function approveDeleteProductRequest(requestId: string, path: string) {
    try {
        const request = await db.productRequest.findUnique({
            where: {
                id: requestId,
            },
            include: {
                supplier: true
            }
        });

        if (!request) {
            return { error: "Request not found!" };
        }

        await db.product.update({
            where: {
                id: request.productId || "",
            },
            data: {
                isDeleted: true,
            },
        });

        await db.productRequest.updateMany({
            where: {
                id: requestId,
            },
            data: {
                status: ProductRequestStatus.ACCEPTED,
            },
        });
        // send notification to the supplier
        await sendNotification(request?.supplier?.userId || "", "Delete Product Request Approved", `Your product request to delete ${request.name} has been approved.`, "/supplier/products", NotificationAction.APPROVE_PRODUCT_REQUEST);
        revalidatePath(path);
        return { success: true };
    } catch (error: any) {
        console.log(error.message);
        throw new Error(`An error occurred while approving delete product request: ${error.message}`);

    }
}

// Reject product request
export async function rejectProductRequest(requestId: string, path: string) {
    try {
        const request = await db.productRequest.findUnique({
            where: {
                id: requestId,
            },
            include: {
                supplier: true
            }
        });

        if (!request) {
            return { error: "Request not found!" };
        }

        await db.productRequest.updateMany({
            where: {
                id: requestId,
            },
            data: {
                status: ProductRequestStatus.REJECTED,
            },
        });

        // send notification to the supplier
        await sendNotification(request?.supplier?.userId || "", "Product Request Rejected", `Your product request to ${request.type} ${request.name} has been rejected.`, "/supplier/products", NotificationAction.REJECT_PRODUCT_REQUEST);

        revalidatePath(path);
        return { success: true };
    } catch (error: any) {
        console.log(error.message);
        throw new Error(`An error occurred while rejecting product request: ${error.message}`);
    }
}


