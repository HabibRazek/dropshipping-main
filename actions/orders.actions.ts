import { stat } from 'fs';
"use server"

import { db } from '@/lib/db';
import { sendNotification } from './notification.actions';
import { getStoreById } from './store.actions';
import { NotificationAction, OrderConfirmationStatus, OrderStatus, TransactionType } from '@prisma/client';
import { createLog } from './log.actions';
import { revalidatePath } from 'next/cache';
import { createTransaction } from './transaction.actions';

interface shipping {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    phone: string;

}

interface Order {
  status: OrderStatus;
}

interface billing {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
}
export interface product {
    id: string;
    name: string;
    storeId: string;
    supplierId: string | null;
    userId: string | null;
    standardPrice: number;
    basePrice: number;
    quantityRequested: number;
    quantityAvailable: number;

}
interface createOrderProps {
    entrepotProducts: product[];
    storeId: string;
    shipping: shipping;
    billing: billing;
}

interface GroupedProducts {
    [key: string]: product[];
}

// Create order function
export async function createOrder({ entrepotProducts, storeId, shipping, billing }: createOrderProps) {
    try {
        await createLog(`Creating order function BEGIN}`);

        // Générer le numéro de commande
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const randomNum = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
        const orderNumber = `ORD-${year}${month}${day}-${randomNum}`;

        const orderData: any = {
            storeId: storeId,
            orderNumber: orderNumber,  // Ajouter le numéro de commande ici
            orderItems: {
                createMany: {
                    data: entrepotProducts.map((product) => ({
                        productId: product.id,
                        quantity: product.quantityRequested,
                        price: product.standardPrice,
                        name: product.name,
                        basePrice: product.basePrice,

                    })),
                },
            },
            totalStandard: entrepotProducts.reduce((acc, product) => acc + product.standardPrice * product.quantityRequested, 0),
            totalBase: entrepotProducts.reduce((acc, product) => acc + product.basePrice * product.quantityRequested, 0),
            gain: entrepotProducts.reduce((acc, product) => acc + (product.standardPrice - product.basePrice) * product.quantityRequested, 0),
            billing: {
                create: {
                    firstName: billing.first_name,
                    lastName: billing.last_name,
                    address: billing.address_1,
                    phone: billing.phone,
                    email: billing.email,
                    city: billing.city,
                    postalCode: billing.postcode,
                },
            },
        };

        if (shipping.address_1.trim() || shipping.first_name.trim()) {
            orderData.shipping = {
                create: {
                    firstName: shipping.first_name,
                    lastName: shipping.last_name,
                    address: shipping.address_1,
                    phone: shipping.phone,
                    city: shipping.city,
                    postalCode: shipping.postcode,
                },
            };
        }

        await createLog(`Creating order inside the function BEGIN}`);
        const order = await db.order.create({
            data: orderData,
        });

        const updateQuantityOperations = entrepotProducts.map((product) => {
            return db.product.update({
                where: { id: product.id },
                data: { stock: { decrement: product.quantityRequested } },
            });
        });

        await db.$transaction(updateQuantityOperations);

        await createLog(`Creating order inside the function FINISHED}`);

        await createLog(`Grouping products by supplierId BEGIN}`);
        const orderProductsGroupedBySupplierId: GroupedProducts = entrepotProducts.reduce((acc, product) => {
            if (!product.supplierId) return acc;

            const key = product.supplierId;
            /* @ts-ignore */
            if (!acc[key]) {
                /* @ts-ignore */
                acc[key] = [];
            }
            /* @ts-ignore */
            acc[key].push(product);
            return acc;
        }, {});
        await createLog(`Grouping products by supplierId FINISHED}`);

        let totalSuppliersOrders = 0;

        await createLog(`Creating order for each supplier BEGIN}`);
        for (const supplierId in orderProductsGroupedBySupplierId) {
            const randomNumForSupplierOrder = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
            const orderNumberForSupplierOrder = `ORD-${year}${month}${day}-${randomNumForSupplierOrder}`;

            const supplierProducts = orderProductsGroupedBySupplierId[supplierId];
            const supplierOrder = await db.orderSupplier.create({
                data: {
                    orderId: order.id,
                    supplierId: supplierId,
                    orderNumber: orderNumberForSupplierOrder,
                    orderItems: {
                        createMany: {
                            data: supplierProducts.map((product) => ({
                                productId: product.id,
                                quantity: product.quantityRequested,
                                price: product.basePrice,
                                name: product.name,
                                basePrice: product.basePrice,
                            })),
                        },
                    },
                    total: supplierProducts.reduce((acc, product) => acc + product.basePrice * product.quantityRequested, 0),
                },
            });
            totalSuppliersOrders += 1;
        }
        await createLog(`Creating order for each supplier FINISHED}`);

        await createLog(`Getting store by id BEGIN}`);
        const store = await getStoreById(storeId);
        await createLog(`Getting store by id FINISHED}`);

        await createLog(`Sending notification to store owner BEGIN}`);
        await sendNotification(store?.userId!, "New order", `You have a new order from ${billing.first_name} ${billing.last_name}`, "/seller/orders", NotificationAction.ORDER_RECEIVED);
        await createLog(`Sending notification to store owner FINISHED}`);

        await createLog(`Creating order function FINISHED}`);
        return { order, totalSuppliersOrders };
    } catch (error: any) {
        await createLog(`Error creating order: ${error.message}`);
    }
}


// This function is used to get all orders from a store
export async function getOrdersByStoreId(storeId: string) {
    const store = await getStoreById(storeId);

    if (!store) {
        throw new Error("Store not found");
    }

    const orders = await db.order.findMany({
        where: {
            storeId: storeId,
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
            shipping: true,
            billing: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return orders;
}

// This function is used to get all orders from a seller
export async function getOrdersBySellerId(sellerId: string) {
    const stores = await db.store.findMany({
        where: {
            userId: sellerId,
        },
        include: {
            orders: {
                include: {
                    orderItems: {
                        include: {
                            product: true,
                        },
                    },
                    shipping: true,
                    billing: true,
                    sellerBilling: true,
                    suppliersOrders: {
                        include: {
                            supplier: true,
                            orderItems: {
                                include: {
                                    product: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });

    if (!stores) {
        return [];
    }

    const orders = stores.reduce((acc: any, store) => {
        return [...acc, ...store.orders];
    }, []);

    return orders;
}



// get order status by seller id
export async function getOrderStatuses(sellerId: string): Promise<number[]> {
  // Fetch orders using getOrdersBySellerId
  const orders: Order[] = await getOrdersBySellerId(sellerId);

  // Initialize an object to hold the count for each status
  const statusesCount: { [key in OrderStatus]: number } = {
    [OrderStatus.PENDING]: 0,
    [OrderStatus.PROCESSING]: 0,
    [OrderStatus.DELIVERED]: 0,
    [OrderStatus.CANCELLED]: 0,
    [OrderStatus.RETURNED]: 0,
  };

  // Count orders by their status
  orders.forEach((order: Order) => {
    if (order.status in statusesCount) {
      statusesCount[order.status]++;
    }
  });

  // Convert the object to an array of counts
  return [
    statusesCount[OrderStatus.PENDING],
    statusesCount[OrderStatus.PROCESSING],
    statusesCount[OrderStatus.DELIVERED],
    statusesCount[OrderStatus.CANCELLED],
    statusesCount[OrderStatus.RETURNED],
  ];
}

// get order status by supplier id
export async function getOrderStatusesBySupplierId(supplierId: string): Promise<number[]> {
    const orders = await getOrdersBySupplierId(supplierId);
    const statusesCount: { [key in OrderStatus]: number } = {
        [OrderStatus.PENDING]: 0,
        [OrderStatus.PROCESSING]: 0,
        [OrderStatus.DELIVERED]: 0,
        [OrderStatus.CANCELLED]: 0,
        [OrderStatus.RETURNED]: 0,
    };

    orders.forEach(order => {
        if (order.order.status in statusesCount) {
            statusesCount[order.order.status]++;
        }
    });

    return [
        statusesCount[OrderStatus.PENDING],
        statusesCount[OrderStatus.PROCESSING],
        statusesCount[OrderStatus.DELIVERED],
        statusesCount[OrderStatus.CANCELLED],
        statusesCount[OrderStatus.RETURNED],
    ];
}


// Revenu Per Month for seller gain
export async function getRevenuPerMonth(sellerId: string) {
    const orders = await db.order.findMany({
        where: {
            store: {
                userId: sellerId,
            },
            status : OrderStatus.DELIVERED,
        },
    });

    const revenuPerMonth = new Array(12).fill(0);

    orders.forEach((order) => {
        const month = new Date(order.createdAt).getMonth();
        revenuPerMonth[month] += order.gain;
    });

    return revenuPerMonth;
}



// This function is used to get all orders from a supplier
export async function getOrdersBySupplierId(supplierId: string) {
    const orders = await db.orderSupplier.findMany({
        where: {
            supplierId: supplierId,
            confirmationStatus: OrderConfirmationStatus.CONFIRMED,
        },
        include: {
            order: {
                include: {
                    orderItems: {
                        include: {
                            product: true
                        }
                    },
                    shipping: true,
                    billing: true,
                    sellerBilling: true
                }
            },
            orderItems: {
                include: {
                    product: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // filter order with confirmation status confirmed and order status not pending
    const filteredOrders = orders.filter(order => order.confirmationStatus === OrderConfirmationStatus.CONFIRMED && order.status !== OrderStatus.PENDING);

    return filteredOrders;
}

// get all orders for admin
export async function getAllOrdersForAdmin() {
    const orders = await db.order.findMany({
        where: {
            confirmationStatus: OrderConfirmationStatus.CONFIRMED,
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
            shipping: true,
            billing: true,
            sellerBilling: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return orders;
}

// This function is used to confirm order delivery to client type
export async function confirmOrderDeliveryToClient(orderId: string, path: string) {
    try {
        const order = await db.order.update({
            where: {
                id: orderId,
            },
            data: {
                confirmationStatus: OrderConfirmationStatus.CONFIRMED,
                suppliersOrders: {
                    updateMany: {
                        where: {
                            orderId: orderId,
                        },
                        data: {
                            confirmationStatus: OrderConfirmationStatus.CONFIRMED,
                        },
                    },
                },
            },
            include: {
                suppliersOrders: {
                    include: {
                        supplier: true,
                    },
                },
            },
        });

        if (!order) {
            return { error: true, message: "Order not found" };
        }

        const suppliersOrders = order.suppliersOrders;

        for (const supplierOrder of suppliersOrders) {
            await sendNotification(supplierOrder.supplier.userId, "New Order", `You have a new order received`, "/supplier/orders", NotificationAction.ORDER_RECEIVED);
        }

        revalidatePath(path);

        return { success: true, message: "Order confirmed" };
    } catch (error: any) {
        return { error: true, message: "Something went wrong" };
    }
}

// This function is used to confirm order delivery to seller type
export async function confirmOrderDeliveryToSeller(orderId: string, path: string, sellerBilling: any) {
    try {
        const order = await db.order.update({
            where: {
                id: orderId,
            },
            data: {
                confirmationStatus: OrderConfirmationStatus.CONFIRMED,
                suppliersOrders: {
                    updateMany: {
                        where: {
                            orderId: orderId,
                        },
                        data: {
                            confirmationStatus: OrderConfirmationStatus.CONFIRMED,
                        },
                    },
                },
                sellerBilling: {
                    create: {
                        firstName: sellerBilling.firstName,
                        lastName: sellerBilling.lastName,
                        address: sellerBilling.address,
                        phone: sellerBilling.phoneNumber,
                        email: sellerBilling.email,
                        city: sellerBilling.city,
                        postalCode: sellerBilling.postalCode,
                    },
                },
            },
            include: {
                suppliersOrders: {
                    include: {
                        supplier: true,
                    },
                },
            },
        });

        if (!order) {
            return { error: true, message: "Order not found" };
        }

        const suppliersOrders = order.suppliersOrders;

        for (const supplierOrder of suppliersOrders) {
            await sendNotification(supplierOrder.supplier.userId, "New Order", `You have a new order received`, "/supplier/orders", NotificationAction.ORDER_RECEIVED);
        }

        revalidatePath(path);

        return { success: true, message: "Order confirmed" };
    } catch (error: any) {
        console.log(error.message);
        return { error: true, message: error.message };
    }
}


// This function is used to reject an order
export async function rejectOrder(orderId: string, path: string) {
    try {
        const order = await db.order.update({
            where: {
                id: orderId,
            },
            data: {
                confirmationStatus: OrderConfirmationStatus.REJECTED,
                suppliersOrders: {
                    updateMany: {
                        where: {
                            orderId: orderId,
                        },
                        data: {
                            confirmationStatus: OrderConfirmationStatus.REJECTED,
                        },
                    },
                },
            },
            include: {
                suppliersOrders: {
                    include: {
                        supplier: true,
                    },
                },
                orderItems: true,
            },
        });

        if (!order) {
            return { error: true, message: "Order not found" };
        }

        for (const orderItem of order.orderItems) {
            const product = await db.product.findUnique({
                where: { id: orderItem.productId },
            });

            if (product) {
                await db.product.update({
                    where: { id: orderItem.productId },
                    data: { stock: { increment: orderItem.quantity } },
                });
            }
        }

        revalidatePath(path);

        return { success: true, message: "Order rejected" };
    } catch (error: any) {
        return { error: true, message: "Something went wrong" };
    }
}

// toal orders
export async function getTotalOrders() {
    const totalOrders = await db.order.count();
    return totalOrders;
}


//pending orders
export async function getTotalPendingOrders() {
    const totalPendingOrders = await db.order.count({
        where: {
            status: OrderStatus.PENDING,
        },
    });
    return totalPendingOrders;
}

// PROCESSING ORDERS
export async function getTotalProcessingOrders() {
    const totalProcessingOrders = await db.order.count({
        where: {
            status: OrderStatus.PROCESSING,
        },
    });
    return totalProcessingOrders;
}


// DELIVERED ORDERS
export async function getTotalDeliveredOrders() {
    const totalDeliveredOrders = await db.order.count({
        where: {
            status: OrderStatus.DELIVERED,
        },
    });
    return totalDeliveredOrders;
}

// return orders
export async function getTotalReturnOrders() {
    const totalReturnOrders = await db.order.count({
        where: {
            status: OrderStatus.RETURNED,
        },
    });
    return totalReturnOrders;
}



// total orders for connected user
export async function getTotalOrdersByUser(userId: string) {
    const totalOrders = await db.order.count({
        where: {
            store: {
                userId,
            },
        },
    });
    return totalOrders;
}


// processing orders for connected user
export async function getTotalProcessingOrdersByUser(userId: string) {
    const totalProcessingOrders = await db.order.count({
        where: {
            store: {
                userId,
            },
            status: OrderStatus.PROCESSING,
        },
    });
    return totalProcessingOrders;
}

// delivered orders for connected user

export async function getTotalDeliveredOrdersByUser(userId: string) {
    const totalDeliveredOrders = await db.order.count({
        where: {
            store: {
                userId,
            },
            status: OrderStatus.DELIVERED,
        },
    });
    return totalDeliveredOrders;
}


// return orders for connected user
export async function getTotalReturnOrdersByUser(userId: string) {
    const totalReturnOrders = await db.order.count({
        where: {
            store: {
                userId,
            },
            status: OrderStatus.RETURNED,
        },
    });
    return totalReturnOrders;
}



// total orders cancled for connected user
export async function getTotalCancledOrdersByUser(userId: string) {
    const totalCancledOrders = await db.order.count({
        where: {
            store: {
                userId,
            },
            status: OrderStatus.CANCELLED,
        },
    });
    return totalCancledOrders;
}


//get total pending orders by user
export async function getPendingOrdersByUser(userId: string) {
    const totalPendingOrders = await db.order.count({
        where: {
            store: {
                userId,
            },
            status: OrderStatus.PENDING,
        },
    });
    return totalPendingOrders;
}


// 
export async function getOrdersNumbersGroupedByMonth(userId: string) {
  const orders = await db.order.findMany({
      where: {
          store: {
              userId,
          },
      },
      orderBy: {
          createdAt: "desc",
      },
  });

  
  const ordersPerMonth = new Array(12).fill(0);

  orders.forEach(order => {
      const month = new Date(order.createdAt).getMonth(); 
      ordersPerMonth[month]++;
  });

  return ordersPerMonth;
}

//getOrdersNumbersGroupedByMonthBySupplierId
export async function getOrdersNumbersGroupedByMonthBySupplierId(supplierId: string) {
    const orders = await db.orderSupplier.findMany({
        where: {
            supplierId: supplierId,
            confirmationStatus: OrderConfirmationStatus.CONFIRMED,
            status: {
                not: OrderStatus.PENDING
            }
        },        
        orderBy: {
            createdAt: "desc",
        },
    });

    const ordersPerMonth = new Array(12).fill(0);

    orders.forEach(order => {
        const month = new Date(order.createdAt).getMonth();
        ordersPerMonth[month]++;
    });

    return ordersPerMonth;
}



  // get all orders statuses cour for supplier in one function
export async function getOrderStatusesForSupplier(supplierId: string): Promise<number[]> {
    const orders = await getOrdersBySupplierId(supplierId);
    const statusesCount: { [key in OrderStatus]: number } = {
        [OrderStatus.PENDING]: 0,
        [OrderStatus.PROCESSING]: 0,
        [OrderStatus.DELIVERED]: 0,
        [OrderStatus.CANCELLED]: 0,
        [OrderStatus.RETURNED]: 0,
    };

    orders.forEach(order => {
        if (order.order.status in statusesCount) {
            statusesCount[order.order.status]++;
        }
    });

    return [
        statusesCount[OrderStatus.PENDING],
        statusesCount[OrderStatus.PROCESSING],
        statusesCount[OrderStatus.DELIVERED],
        statusesCount[OrderStatus.CANCELLED],
        statusesCount[OrderStatus.RETURNED],
    ];
}



// Orders Per Month for admin all orders in database for admin
export async function getOrdersNumbersGroupedByMonthForAdmin() {
    const orders = await db.order.findMany({
        where: {
            confirmationStatus: OrderConfirmationStatus.CONFIRMED,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const ordersPerMonth = new Array(12).fill(0);

    orders.forEach(order => {
        const month = new Date(order.createdAt).getMonth();
        ordersPerMonth[month]++;
    });

    return ordersPerMonth;
}


//All Orders Statuses for admin
export async function getOrderStatusesForAdmin(): Promise<number[]> {
    const orders = await db.order.findMany(
        {
            where: {
                confirmationStatus: OrderConfirmationStatus.CONFIRMED,
            },
        }
    );

    const statusesCount: { [key in OrderStatus]: number } = {
        [OrderStatus.PENDING]: 0,
        [OrderStatus.PROCESSING]: 0,
        [OrderStatus.DELIVERED]: 0,
        [OrderStatus.CANCELLED]: 0,
        [OrderStatus.RETURNED]: 0,
    };

    orders.forEach(order => {
        if (order.status in statusesCount) {
            statusesCount[order.status]++;
        }
    });

    return [
        statusesCount[OrderStatus.PENDING],
        statusesCount[OrderStatus.PROCESSING],
        statusesCount[OrderStatus.DELIVERED],
        statusesCount[OrderStatus.CANCELLED],
        statusesCount[OrderStatus.RETURNED],
    ];
}

// the most ordered product by month in all database + product name
export async function getMostOrderedProductByMonth() {
    const orders = await db.order.findMany({
        where: {
            status: OrderStatus.DELIVERED,
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
        },
    });

    const mostOrderedProducts = new Array(12).fill(null);

    orders.forEach(order => {
        const month = new Date(order.createdAt).getMonth();
        order.orderItems.forEach(orderItem => {
            if (!mostOrderedProducts[month] || mostOrderedProducts[month].quantity < orderItem.quantity) {
                mostOrderedProducts[month] = {
                    product: orderItem.product,
                    quantity: orderItem.quantity,
                };
            }
        });
    });

    return mostOrderedProducts;
}

// Change order status
export async function changeOrderStatus(orderId: string, status: OrderStatus, path: string) {
    const order = await db.order.update({
        where: {
            id: orderId,
        },
        data: {
            status: status,
        },
        include: {
            orderItems: {
                select: {
                    productId: true,
                    quantity: true,
                },
            },
            store: true
        },
    });

    await db.orderSupplier.updateMany({
        where: {
            orderId: orderId,
        },
        data: {
            status: status,
        },
    });

    if (status in [OrderStatus.CANCELLED, OrderStatus.RETURNED]) {
        for (const orderItem of order.orderItems) {
            await db.product.update({
                where: {
                    id: orderItem.productId,
                },
                data: {
                    stock: {
                        increment: orderItem.quantity,
                    },
                },
            });
        }
    }

    if (status === OrderStatus.DELIVERED) {
        // Send gai to seller
        await createTransaction(order.store.userId, order.gain, TransactionType.CHARGE, path);

        // Send money to suppliers of base prices of products
        const suppliersOrders = await db.orderSupplier.findMany({
            where: {
                orderId: orderId,
            },
            include: {
                supplier: true,
            },
        });

        for (const supplierOrder of suppliersOrders) {
            await createTransaction(supplierOrder.supplier.userId, supplierOrder.total, TransactionType.CHARGE, path);
        }
    }

    revalidatePath(path);
}

getPendingOrdersOlderThan72Hours
export async function getPendingOrdersOlderThan72Hours() {
    const currentDate = new Date();
    const date = new Date(currentDate.setDate(currentDate.getDate() - 3));

    const orders = await db.order.findMany({
        where: {
            status: OrderStatus.PENDING,
            createdAt: {
                lt: date,
            },
        },
    });

    return orders;
}

// total revenue per month for supplier based on this format retured data: [44, 55, 41, 64, 22, 43, 21, 33, 44, 55, 41, 64]
export async function getRevenuPerMonthForSupplier(supplierId: string) {
    const orders = await db.orderSupplier.findMany({
        where: {
            supplierId: supplierId,
            status: OrderStatus.DELIVERED,
        },
    });

    const revenuPerMonth = new Array(12).fill(0);

    orders.forEach((order) => {
        const month = new Date(order.createdAt).getMonth();
        revenuPerMonth[month] += order.total;
    });

    return revenuPerMonth;
}




