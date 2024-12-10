import { product } from './orders.actions';
"use server"

import { db } from "@/lib/db";
import { ProductTableSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { sendNotification } from './notification.actions';
import { NotificationAction } from '@prisma/client';


//!Todo: Send notification to sellers who have the product in their store when the product is deleted or updated

// This function is used to get a product by its id
export async function getProductById(productId: string) {
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      images: true,
      category: true,
      supplier: true,
      user: true
    }
  });

  return product;
}

// This function is used to get all products by a supplier id
export async function getProductsBySupplierId(supplierId: string) {
  const products = await db.product.findMany({
    where: {
      supplierId: supplierId,
      isDeleted: false
    },
    include: {
      images: true,
      category: true,
    }
  });

  return products;
}

// This function is used to get paginated products with a query
export async function getProducts({ query, page = 1, limit = 1, categoryId }: { query?: string, page: number, limit: number, categoryId?: string }) {
  // Helper function to simulate asynchronous behavior
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  try {
    // Calculate the number of items to skip based on the page number and limit
    const skip = (page - 1) * limit;
    let products;

    // Construct the base query
    const baseQuery = {
      include: {
        images: true,
        category: true,
        supplier: true,
        user: true
      },
      skip,
      take: limit
    };

    // Define the initial where condition
    let whereCondition: any = {
      isDeleted: false
    };

    // If a query is provided, add it to the filter
    if (query) {
      whereCondition = {
        AND: [
          {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } }
            ]
          },
          { isDeleted: false }
        ]
      };
    }

    // If categoryId is provided, add it to the filter
    if (categoryId) {
      whereCondition = {
        ...whereCondition,
        categoryId
      };
    }

    // Fetch products based on the constructed query
    products = await db.product.findMany({
      ...baseQuery,
      where: whereCondition
    });

    // Count total number of products in the database
    const totalProducts = await db.product.count({
      where: whereCondition
    });

    // Calculate total number of pages based on the total products and limit
    const totalPages = Math.ceil(totalProducts / limit);

    // Simulate a delay of 100 milliseconds (you may remove this in production)
    await sleep(100);

    // Return the fetched products and total number of pages
    return { products, totalPages };
  } catch (error) {
    // If an error occurs during fetching, return the error
    return { error };
  }
}

// This function is used to get all products
export async function getAllProducts() {
  const products = await db.product.findMany({
    where: {
      isDeleted: false
    },
    include: {
      images: true,
      category: true,
    }
  });

  return products;
}

// This function is used to add a new product
export async function addProduct(userId: string, values: z.infer<typeof ProductTableSchema>) {

  const validatedFields = ProductTableSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error("Invalid fields");
  }

  const { name, categoryId, price, stock, description, images } = validatedFields.data;

  const product = await db.product.create({
    data: {
      name,
      price,
      stock,
      description,
      categoryId,
      userId,
      images: {
        createMany: {
          data: images.map((image: { url: string }) => ({
            url: image.url
          })),
        },
      },
    }
  });

  return product;
}

// This function is used to update a product
export async function updateProduct(productId: string, values: z.infer<typeof ProductTableSchema>) {
  const validatedFields = ProductTableSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error("Invalid fields");
  }

  const { name, categoryId, price, stock, description, images } = validatedFields.data;

  await db.product.update({
    where: {
      id: productId,
    },
    data: {
      images: {
        deleteMany: {},
      },
    },
  });

  const product = await db.product.update({
    where: {
      id: productId,
    },
    data: {
      name,
      price,
      stock,
      description,
      categoryId,
      images: {
        createMany: {
          data: images.map((image: { url: string }) => ({
            url: image.url
          })),
        },
      },
    },
    include: {
      stores: true,
    }
  });

  //Send notification to sellers who have the product in their store when the product is deleted or updated

  const stores = product.stores;
  for (const store of stores) {
    // Send notification to sellers
    await sendNotification(store.userId, "Product Updated", `The product ${product.name} has been updated. Please check changes to keep your store up to date.`, `/seller/products/product/${product.id}`, NotificationAction.PRODUCT_UPDATED);
  }
  return product;
}

// This function is used to delete a product by its id
export async function deleteProductById(productId: string, path: string) {
  const product = await db.product.update({
    where: {
      id: productId,
    },
    data: {
      isDeleted: true,
    },
    include: {
      stores: true,
    }
  });

  const stores = product.stores;
  for (const store of stores) {
    // Send notification to sellers
    await sendNotification(store.userId, "Product Deleted", `The product ${product.name} has been deleted. Please check changes to keep your store up to date.`, `/seller/stores/store/${store.id}`, NotificationAction.PRODUCT_DELETED);
  }

  revalidatePath(path);
  return product;
}

// This function is used to get related products
export async function getRelatedProducts(productId: string) {
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      category: true
    }
  });

  const relatedProducts = await db.product.findMany({
    where: {
      categoryId: product?.categoryId,
      isDeleted: false,
      NOT: {
        id: product?.id, // Exclude the current product
      },
    },
    include: {
      images: true,
      category: true
    },

    take: 3
  });

  return relatedProducts;
}


//number of products
export async function getTotalProducts() {
  const products = await db.product.count();
  return products;
}

//total product for connected user
export async function getTotalProductsByUser(userId: string) {
  const products = await db.product.count({
    where: {
      userId
    }
  });
  return products;
}

//total product out of stock for connected user
export async function getTotalProductsOutOfStock(userId: string) {
  const products = await db.product.count({
    where: {
      userId,
      stock: 0
    }
  });
  return products;
}






