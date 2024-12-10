"use server"

import { db } from "@/lib/db";

// Get all categories
export async function getAllCategories() {
  const categories = await db.category.findMany({
    where: {
      isDeleted: false,
    },
  });
  return categories;
}

// Get category by id
export async function getCategoryById(id: string) {
  const category = await db.category.findUnique({
    where: {
      id,
    },
  });
  return category;
}


// Create category
export async function createCategory(data: any) {
  const category = await db.category.create({
    data,
  });
  return category;
}

// Update category
export async function updateCategory(id: string, data: any) {
  const category = await db.category.update({
    where: {
      id,
    },
    data,
  });
  return category;
}

export async function deleteCategory(id: string) {
  const category = await db.category.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
      products: {
        updateMany: {
          where: {
            isDeleted: false,
          },
          data: {
            isDeleted: true,
          },
        },
      },
    },
  });
  return true;
}
