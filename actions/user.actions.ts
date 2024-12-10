"use server";

import { db } from "@/lib/db";
import { OrderConfirmationStatus, UserRole } from "@prisma/client";


// This function is used to get a user by its id
export async function getUserById(userId: string) {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      supplier: true,
    },
  });

  return user;
}


// This function is used to get all users
export async function getAllUsers() {
  const users = await db.user.findMany({
    where: {
      role: UserRole.USER,
    },
  });
  return users;
}

// This function is used to delete a user
export async function deleteUser(userId: string) {
  const user = await db.user.update({
    where: {
      id: userId,
    },
    data: {
      isDeleted: true,
    },
    include: {
      supplier: true,
    },
  });

  if (!user) {
    return { error: true, message: "Failed to ban user"};
  }

  if (user.role === UserRole.USER) {
    await db.store.updateMany({
      where: {
        userId: userId,
      },
      data: {
        isDeleted: true,
      },
    });
  }

  if (user.role === UserRole.SUPPLIER) {
    await db.supplier.update({
      where: {
        userId: userId,
      },
      data: {
        isDeleted: true,
      },
    });

    await db.product.updateMany({
      where: {
        supplierId: user?.supplier?.id,
      },
      data: {
        isDeleted: true,
      },
    });
  }

  return { success: true, message: "User banned successfully"};
}

export async function unDeleteUser(userId: string) {
  const user = await db.user.update({
    where: {
      id: userId,
    },
    data: {
      isDeleted: false,
    },
    include: {
      supplier: true,
    },
  });

  if (!user) {
    return { error: true, message: "Failed to unban user"};
  }

  if (user.role === UserRole.USER) {
    await db.store.updateMany({
      where: {
        userId: userId,
      },
      data: {
        isDeleted: false,
      },
    });
  }

  if (user.role === UserRole.SUPPLIER) {
    await db.supplier.update({
      where: {
        userId: userId,
      },
      data: {
        isDeleted: false,
      },
    });

    await db.product.updateMany({
      where: {
        supplierId: user?.supplier?.id,
      },
      data: {
        isDeleted: false,
      },
    });
  }

  return { success: true, message: "User unbanned successfully"};
}

// This function is used to get all suppliers
export async function getAllSuppliers() {
  const suppliers = await db.user.findMany({
    where: {
      role: UserRole.SUPPLIER,
    },
    include: {
      supplier: true,
    },
  });
  return suppliers;
}

// This function is used to get supplier by id
export async function getSupplierById(supplierId: string) {
  const supplier = await db.supplier.findUnique({
    where: {
      id: supplierId,
    },
    include: {
      user: true,
      products: true,
      orders: true,
    },
  });

  return supplier;
}

export async function getTotalSellers() {
  const totalSellers = await db.user.count({
    where: {
      role: UserRole.USER,
    },
  });

  return totalSellers;
}

// get toal suppliers
export async function getTotalSuppliers() {
  const totalSuppliers = await db.user.count({
    where: {
      role: UserRole.SUPPLIER,
    },
  });

  return totalSuppliers;
}


// Dashboards Taha 
//getAllUsersForAdminDash
export async function getAllUsersForAdminDash() {
  const allUsers = await db.user.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      supplier: true,
    },
  });
  return allUsers;
}


//getAllProductsForAdminDash
export async function getAllProductsForAdminDash() {
  const allProducts = await db.product.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      supplier: true,
    },
  });
  return allProducts;
}

//getAllOrdersForAdminDash
export async function getAllOrdersForAdminDash() {
  const allOrders = await db.order.findMany({
    where: {
      confirmationStatus: OrderConfirmationStatus.CONFIRMED
    },
  });
  
  return allOrders;
}

//getSellerOrders
