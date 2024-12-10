import { stat } from 'fs';
"use server"

import { db } from "@/lib/db";
import { OrderStatus, TransactionType } from "@prisma/client";
import { revalidatePath } from "next/cache";

// This function is used to get all transactions by a user id
export async function getTransactionsByUserId(userId: string) {
    const transactions = await db.transaction.findMany({
        where: {
            userId: userId,
        },
    });

    return transactions;
}

// combine the two functions
export async function createTransaction(userId: string, amount: number, type: TransactionType, path: string) {
    const amountFloat = parseFloat(amount.toString());

    if (amountFloat <= 0) {
        return { error: true }
    }

    if (type === TransactionType.CHARGE) {
        await db.user.update({
            where: {
                id: userId,
            },
            data: {
                wallet: {
                    increment: amountFloat,
                },
            },
        });

        const transaction = await db.transaction.create({
            data: {
                userId: userId,
                amount: amountFloat,
                type: type,
                description: "Amount charged with " + amountFloat + "TND"
            },
        });

        revalidatePath(path);

        return { success: true, transaction };
    }

    if (type === TransactionType.RETRIEVE) {
        await db.user.update({
            where: {
                id: userId,
            },
            data: {
                wallet: {
                    decrement: amountFloat,
                },
            },
        });

        const transaction = await db.transaction.create({
            data: {
                userId: userId,
                amount: amountFloat,
                type: type,
                description: "Amount retrieved with " + amountFloat + "TND"
            },
        });

        revalidatePath(path);

        return { success: true, transaction };

    }
}

export async function getTotalSellerGain(userId: string) {
    const orders = await db.order.findMany({
        where: {
            store: {
                userId: userId,
            },

            status: OrderStatus.DELIVERED,
        },
    });

    let totalGain = 0;

    orders.forEach((order) => {
        totalGain += order.gain;
    });

    return totalGain;
}

export async function getTotalSellerRevenue(userId: string) {
    const orders = await db.order.findMany({
        where: {
            store: {
                userId: userId,
            },

            status: OrderStatus.DELIVERED,
        },
    });

    let totalRevenue = 0;

    orders.forEach((order) => {
        totalRevenue += order.totalStandard;
    });

    return totalRevenue;
}


export async function getTotalRevenue(userId: string) {
    const transactions = await db.transaction.findMany({
        where: {
            userId: userId,
            type: TransactionType.CHARGE,
        },
    });

    let totalRevenue = 0;

    transactions.forEach((transaction) => {
        totalRevenue += transaction.amount;
    });

    return totalRevenue;
}

export async function getTransactions() {
    const transactions = await db.transaction.findMany(
        {
            include: {
                user: true,
            },
        }
    );

    return transactions;
}
