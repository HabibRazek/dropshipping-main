"use server"

import { db } from "@/lib/db"

// This function is used to create a log 
export async function createLog(log: string) {
    await db.log.create({
        data: {
            message: log
        }
    })
    return log;
}