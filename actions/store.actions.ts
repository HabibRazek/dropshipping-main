"use server"

import { db } from "@/lib/db"
import { formatPrice } from './../lib/utils'
import { getProductById } from '@/actions/product.actions'
import axios from "axios";
import addOAuthInterceptor from 'axios-oauth-1.0a'
import { NewStoreSchema } from "@/schemas"
import { z } from "zod"
import { revalidatePath } from 'next/cache'
import { OrderStatus } from "@prisma/client";
import { createLog } from "./log.actions";


interface addProductsToStoreProps {
    storeId: string;
    items: Awaited<ReturnType<typeof getProductById>>[];
}

// This function is used to get a store by id
export async function getStoreById(storeId: string) {
    try {
        await createLog("Getting store by id INSIDE FUNCTION  BEGIN...");
        const store = await db.store.findUnique({
            where: {
                id: storeId
            },
            include: {
                user: true,
                products: {
                    where: {
                        isDeleted: false
                    },
                    include: {
                        images: true,
                        category: true,
                    }
                },
                orders: true,
                productStoreItem: true
            }
        });
        await createLog("Getting store by id INSIDE FUNCTION  END...");
        return store;
    } catch (error: any) {
        await createLog(error.message);
    }
}

// This function is used to get all store products with parallel items in woocommerce
export async function getStoreProductsWithParallelItems(storeId: string) {
    const store = await db.store.findUnique({
        where: {
            id: storeId
        },
        include: {
            user: true,
            products: {
                where: {
                    isDeleted: false
                },
                include: {
                    images: true,
                    category: true,
                }
            },
            productStoreItem: true
        }
    });

    if (!store || !store.products || !store.productStoreItem) return [];

    const client = axios.create();

    const options = {
        algorithm: "HMAC-SHA1" as "HMAC-SHA1",
        key: store.CONSUMER_KEY,
        secret: store.CONSUMER_SECRET,
    };

    addOAuthInterceptor(client, options);


    // Create an array of product and productStoreItem pairs
    const productPairsPromises = store.products.map(async (product) => {
        const productStoreItem = store.productStoreItem.find(item => item.productId === product.id);

        if (productStoreItem) {
            try {
                const response = await client.get(`${store.link}/wp-json/wc/v3/products/${productStoreItem.productWoocommerceId.toString()}`);
                const updatedProductStoreItem = {
                    ...productStoreItem,
                    standardPrice: parseFloat(response.data.price),
                };
                return { product, productStoreItem: updatedProductStoreItem };
            } catch (error) {
                console.error("Error fetching product price:", error);
                return undefined;
            }
        }

        return undefined;
    });

    const productPairs = await Promise.all(productPairsPromises);

    let filteredProductPairs = productPairs.filter(pair => pair !== undefined);

    return filteredProductPairs;
}

// This function is used to link an external store to the app
export async function linkStore(sellerId: string, data: z.infer<typeof NewStoreSchema>, path: string) {
    const validatedFields = NewStoreSchema.safeParse(data);

    if (!validatedFields.success) {
        return { error: true, message: "Invalid fields" }
    }

    const { name, link, consumerKey, consumerSecret } = validatedFields.data;


    const storeExists = await db.store.findFirst({
        where: {
            OR: [
                { link: link },
                { name: name }
            ],
            isDeleted: false,
        }
    });

    if (storeExists) {
        if (storeExists.link === link) {
            return { error: true, message: "Store already linked !" }
        }
        return { error: true, message: "Already have a store with this name !" }
    }

    // Create an Axios instance
    const client = axios.create();

    // Specify your OAuth options
    const options = {
        algorithm: "HMAC-SHA1" as "HMAC-SHA1",
        key: consumerKey,
        secret: consumerSecret,
    };

    addOAuthInterceptor(client, options);

    const domain = /* process.env.NEXT_PUBLIC_APP_URL || */ "https://dropshipping-sigma.vercel.app";

    const requestData = {
        url: `${link}/wp-json/wc/v3/webhooks`,
        data: {
            "name": "New Order",
            "topic": "order.created",
            "delivery_url": `${domain}/api/webhook`
        }
    };


    try {
        const response = await client.post(requestData.url, requestData.data);

        if (response.status === 201) {
            const store = await db.store.create({
                data: {
                    name,
                    link,
                    CONSUMER_KEY: consumerKey,
                    CONSUMER_SECRET: consumerSecret,
                    webhookId: response.data.id.toString(),
                    userId: sellerId,
                }
            });
            //refresh page
            revalidatePath(path);

            return { success: true, message: "Store linked successfully" };
        }
    } catch (error) {
        return { error: true, message: `Error linking store. Please check your credentials !` };
    }
}

// This function is used to delete a store
export async function deleteStore(storeId: string, path: string) {
    try {
        const store = await db.store.findUnique({
            where: {
                id: storeId
            }
        });

        if (!store) {
            return { error: true, message: "Store not found !" };
        }

        const client = axios.create();

        const options = {
            algorithm: "HMAC-SHA1" as "HMAC-SHA1",
            key: store.CONSUMER_KEY,
            secret: store.CONSUMER_SECRET,
        };

        addOAuthInterceptor(client, options);

        const response = await client.put(`${store.link}/wp-json/wc/v3/webhooks/${store.webhookId}`, {
            "status": "paused"
        });

        if (response.status !== 200) {
            return { error: true, message: "Error deleting store" };
        }

        await db.store.update({
            where: {
                id: storeId
            },
            data: {
                isDeleted: true
            }
        });

        revalidatePath(path);

        return { success: true, message: "Store deleted successfully" };
    } catch (error) {
        return { error: true, message: "Error deleting store" };
    }
}

// This function is used to update a store
export async function updateStore(storeId: string, data: z.infer<typeof NewStoreSchema>, path: string) {
    const validatedFields = NewStoreSchema.safeParse(data);

    if (!validatedFields.success) {
        return { error: true, message: "Invalid fields" }
    }

    const { name, consumerKey, consumerSecret } = validatedFields.data;

    const store = await db.store.findUnique({
        where: {
            id: storeId
        }
    });

    if (!store) {
        return { error: true, message: "Store not found !" };
    }

    const client = axios.create();

    const options = {
        algorithm: "HMAC-SHA1" as "HMAC-SHA1",
        key: consumerKey,
        secret: consumerSecret,
    };

    addOAuthInterceptor(client, options);

    const requestData = {
        url: `${store?.link}/wp-json/wc/v3/webhooks/${store.webhookId.toString()}`,
    };

    try {
        const response = await client.get(requestData.url);

        if (response.status === 200) {
            await db.store.update({
                where: {
                    id: storeId
                },
                data: {
                    name,
                    CONSUMER_KEY: consumerKey,
                    CONSUMER_SECRET: consumerSecret
                }
            });

            revalidatePath(path);

            return { success: true, message: "Store details updated successfully" };
        }
        else
            return { error: true, message: `Error updating store. Please check your credentials !` };
    } catch (error) {
        return { error: true, message: `Error updating store. Please check your credentials !` };
    }
}

// This function is used to get all stores by a seller id
export async function getStoresBySellerId(sellerId: string) {
    const stores = await db.store.findMany({
        where: {
            userId: sellerId,
            isDeleted: false
        },
        include: {
            user: true,
            products: {
                where: {
                    isDeleted: false
                },
                include: {
                    images: true,
                    category: true,
                }
            }
        }
    });

    return stores;
}

// This function is used to get all stores by a seller id
export async function getPaginatedStoresBySellerId({ sellerId, query, page = 1, limit = 1 }: { sellerId: string, query?: string, page: number, limit: number }) {
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

    try {
        const skip = (page - 1) * limit;
        let stores;

        // Construct the base query
        const baseQuery = {
            include: {
                user: true,
                products: {
                    where: {
                        isDeleted: false
                    },
                    include: {
                        images: true,
                        category: true,
                    }
                },
                orders: true,
            },
            skip,
            take: limit
        };

        // If a query is provided, add it to the filter
        let whereCondition: any = { userId: sellerId, isDeleted: false };

        if (query) {
            whereCondition = {
                ...whereCondition,
                name: {
                    contains: query,
                    mode: "insensitive"
                }
            };
        }

        // Fetch products based on the constructed query
        stores = await db.store.findMany({
            ...baseQuery,
            where: whereCondition
        });

        // Count total number of products in the database
        const totalStores = await db.store.count({
            where: whereCondition ? whereCondition : undefined,
        });


        // Calculate total number of pages based on the total products and limit
        const totalPages = Math.ceil(totalStores / limit);

        // Simulate a delay of 500 milliseconds (you may remove this in production)
        await sleep(100);

        // Return the fetched stores and total number of pages
        return { stores, totalPages };
    } catch (error) {
        // If an error occurs during fetching, return the error
        return { error };
    }

}

// This function is used to add all selected product in cart to the store
export async function addProductsToStore({ storeId, items }: addProductsToStoreProps) {
    let productIdsAddedSuccessfully: string[] = [];

    const store = await db.store.findUnique({
        where: {
            id: storeId
        },
        include: {
            products: {
                where: {
                    isDeleted: false
                },
                include: {
                    images: true,
                    category: true,
                }
            }
        }
    });

    if (!store) {
        return { error: true, title: "Store Not Found !", message: "Store does not exist !" }
    }

    const productsInStore = store.products;

    for (const product of items) {
        const productExistsInStore = productsInStore.some((prod) => prod.id === product?.id);

        if (productExistsInStore) {
            return { error: true, message: `Product: ${product?.name} already exists in store` };
        }

        const productExistsInDatabase = await db.product.findUnique({
            where: { id: product?.id }
        });

        if (!productExistsInDatabase) {
            return { error: true, title: "Product Not Found !", message: `Product: ${product?.name} has been deleted` };
        }

        const isPriceValid = product?.price! > productExistsInDatabase?.price!;

        if (!isPriceValid) {
            return { error: true, title: "Invalid Standard Price !", message: `Product: ${product?.name} standard price must be greater than ${formatPrice(productExistsInDatabase?.price)}` };
        }

    }

    const client = axios.create();

    const options = {
        algorithm: "HMAC-SHA1" as "HMAC-SHA1",
        key: store.CONSUMER_KEY,
        secret: store.CONSUMER_SECRET,
    };

    addOAuthInterceptor(client, options);

    for (const product of items) {
        const requestData = {
            url: `${store.link}/wp-json/wc/v3/products`,
            data: {
                "name": product?.name,
                "type": "simple",
                "regular_price": product?.price.toString(),
                "description": product?.description,
                "short_description": product?.description,
                "categories": [{ "id": 1 }],
                "images": product?.images.map((image) => ({ "src": image.url })),
                "sku": `ENTP-${product?.id}-${store.id}`
            },
        };

        try {
            const response = await client.post(requestData.url, requestData.data);

            if (response.status === 201) {
                console.log(`Adding Product : ${product?.id}`);
                await db.store.update({
                    where: {
                        id: store.id
                    },
                    data: {
                        products: {
                            connect: {
                                id: product?.id
                            }
                        },
                        productStoreItem: {
                            create: {
                                productId: product?.id!,
                                productWoocommerceId: response.data.id
                            }
                        }
                    }
                });
                productIdsAddedSuccessfully.push(response.data.id);
            } else {
                for (const id of productIdsAddedSuccessfully) {
                    client.delete(`${store.link}/wp-json/wc/v3/products/${id}`);
                    await db.store.update({
                        where: {
                            id: store.id
                        },
                        data: {
                            products: {
                                disconnect: {
                                    id
                                }
                            }
                        }
                    });
                }
                return { error: true, title: "Something went wrong !", message: `Error adding product: ${product?.name} to store` };
            }
        } catch (error) {
            for (const id of productIdsAddedSuccessfully) {
                client.delete(`${store.link}/wp-json/wc/v3/products/${id}`);
                await db.store.update({
                    where: {
                        id: store.id
                    },
                    data: {
                        products: {
                            disconnect: {
                                id
                            }
                        }
                    }
                });
            }
            return { error: true, title: "Something went wrong !", message: `Error adding product: ${product?.name} to store` };
        }
    }

    return { success: true, title: "Products added to store successfully !", message: "Products have been added to store successfully !" };

}

// This function is used to get store webhook status
export async function getStoreWebhookStatus(storeId: string) {
    try {
        const store = await db.store.findUnique({
            where: {
                id: storeId
            }
        });

        if (!store) {
            return { error: true, message: "Store not found !" };
        }

        const client = axios.create();

        const options = {
            algorithm: "HMAC-SHA1" as "HMAC-SHA1",
            key: store.CONSUMER_KEY,
            secret: store.CONSUMER_SECRET,
        };

        addOAuthInterceptor(client, options);

        const response = await client.get(`${store.link}/wp-json/wc/v3/webhooks/${store.webhookId.toString()}`);

        if (response.status === 200) {
            return { success: true, status: response.data.status };
        }

        return { error: true, message: "Error fetching webhook status" };
    } catch (error) {
        return { error: true, message: "Error fetching webhook status" };
    }
}

// This function is used to enable and disable store webhook
export async function enableStoreWebhook(storeId: string, path: string) {
    try {
        const store = await db.store.findUnique({
            where: {
                id: storeId
            }
        });

        if (!store) {
            return { error: true, message: "Store not found !" };
        }

        const client = axios.create();

        const options = {
            algorithm: "HMAC-SHA1" as "HMAC-SHA1",
            key: store.CONSUMER_KEY,
            secret: store.CONSUMER_SECRET,
        };

        addOAuthInterceptor(client, options);

        const response = await client.put(`${store.link}/wp-json/wc/v3/webhooks/${store.webhookId.toString()}`, {
            "status": "active"
        });

        if (response.status === 200) {
            revalidatePath(path);
            return { success: true, message: "Store orders automatisation enabled successfully" };
        }

        return { error: true, message: "Error enabling orders automatisation" };
    } catch (error) {
        return { error: true, message: "Error enabling orders automatisation" };
    }
}

// This function is used to disable store webhook
export async function disableStoreWebhook(storeId: string, path: string) {
    try {
        const store = await db.store.findUnique({
            where: {
                id: storeId
            }
        });

        if (!store) {
            return { error: true, message: "Store not found !" };
        }

        const client = axios.create();

        const options = {
            algorithm: "HMAC-SHA1" as "HMAC-SHA1",
            key: store.CONSUMER_KEY,
            secret: store.CONSUMER_SECRET,
        };

        addOAuthInterceptor(client, options);

        const response = await client.put(`${store.link}/wp-json/wc/v3/webhooks/${store.webhookId.toString()}`, {
            "status": "paused"
        });

        if (response.status === 200) {
            revalidatePath(path);
            return { success: true, message: "Store orders automatisation disabled successfully" };
        }

        return { error: true, message: "Error disabling orders automatisation" };
    } catch (error) {
        return { error: true, message: "Error disabling orders automatisation" };
    }
}

// This function is used to get store total revenue
export async function getStoreTotalRevenue(storeId: string) {
    const store = await getStoreById(storeId);

    if (!store) {
        return { error: true, message: "Store not found !" };
    }

    const orders = store.orders;

    let totalRevenue = 0;

    for (const order of store.orders) {
        if (order.status === OrderStatus.DELIVERED) {
            totalRevenue += order.totalStandard;
        }
    }

    return totalRevenue;
}

// This function is used to get store total gain
export async function getStoreTotalGain(storeId: string) {
    const store = await getStoreById(storeId);

    if (!store) {
        return { error: true, message: "Store not found !" };
    }

    const orders = store.orders;

    let totalGain = 0;

    for (const order of store.orders) {
        if (order.status === OrderStatus.DELIVERED) {
            totalGain += order.gain;
        }

    }

    return totalGain;
}

// This function is used to change standard price of a product in store
export async function changeStandardPrice(storeId: string, productId: string, productWoocommerceId: number, newStandardPrice: number, path: string) {
    const store = await db.store.findUnique({
        where: {
            id: storeId
        }
    });

    if (!store) {
        return { error: true, message: "Store not found !" };
    }

    const productStoreItem = await db.productStoreItem.findFirst({
        where: {
            productId: productId,
            storeId: storeId
        }
    });

    if (!productStoreItem) {
        return { error: true, message: "Product not found in store !" };
    }

    const client = axios.create();

    const options = {
        algorithm: "HMAC-SHA1" as "HMAC-SHA1",
        key: store.CONSUMER_KEY,
        secret: store.CONSUMER_SECRET,
    };

    addOAuthInterceptor(client, options);

    try {
        const response = await client.put(`${store.link}/wp-json/wc/v3/products/${productWoocommerceId}`, {
            "regular_price": newStandardPrice.toString()
        });

        if (response.status === 200) {
            revalidatePath(path);
            return { success: true, message: "Standard price changed successfully" };
        }

        return { error: true, message: "Error changing standard price" };
    } catch (error) {
        return { error: true, message: "Error changing standard price" };
    }
}

// This function is used to remove a product from store
export async function removeProductFromStore(storeId: string, productId: string, productWoocommerceId: number, path: string) {
    const store = await db.store.findUnique({
        where: {
            id: storeId
        }
    });

    if (!store) {
        return { error: true, message: "Store not found !" };
    }

    const client = axios.create();

    const options = {
        algorithm: "HMAC-SHA1" as "HMAC-SHA1",
        key: store.CONSUMER_KEY,
        secret: store.CONSUMER_SECRET,
    };

    addOAuthInterceptor(client, options);

    try {
        const response = await client.delete(`${store.link}/wp-json/wc/v3/products/${productWoocommerceId}`);

        if (response.status === 200) {
            await db.store.update({
                where: {
                    id: storeId
                },
                data: {
                    products: {
                        disconnect: {
                            id: productId
                        }
                    },
                    productStoreItem: {
                        delete: {
                            productId_storeId: {
                                productId: productId,
                                storeId: storeId
                            }
                        }
                    }
                }
            });
            revalidatePath(path);
            return { success: true, message: "Product removed successfully" };
        }

        return { error: true, message: "Error removing product" };
    } catch (error) {
        return { error: true, message: "Error removing product" };
    }
}

// This function is used to get total stores by a user
export async function getTotalStoresByUser(userId: string) {
    const totalStores = await db.store.count({
        where: {
            userId: userId,
            isDeleted: false
        }
    });

    return totalStores;
}

// This function is used to get all stores
export async function getAllStores() {
    const stores = await db.store.findMany({
        where: {
            isDeleted: false
        },
        include: {
            user: true,
            products: {
                where: {
                    isDeleted: false
                },
                include: {
                    images: true,
                    category: true,
                }
            }
        }
    });

    return stores;
}

// This function is used to delete store
export async function deleteStoreById(storeId: string, path: string) {
    try {
        await db.store.update({
            where: {
                id: storeId
            },
            data: {
                isDeleted: true
            }
        });
        revalidatePath(path);
        return { success: true, message: "Store deleted successfully" };
    } catch (error: any) {
        console.error(error);
        return { error: true, message: "Error deleting store" };
    }
    revalidatePath(path);
}

// This function is used to restore store
export async function restoreStoreById(storeId: string, path: string) {
    try {
        await db.store.update({
            where: {
                id: storeId
            },
            data: {
                isDeleted: false
            }
        });
        revalidatePath(path);
        return { success: true, message: "Store restored successfully" };
    } catch (error: any) {
        console.error(error);
        return { error: true, message: "Error restoring store" };
    }
}


