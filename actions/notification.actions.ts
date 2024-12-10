"use server"

import { db } from "@/lib/db";
import { NotificationAction } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Get all notifications
export async function getAllNotifications() {
  const notifications = await db.notification.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });
  return notifications;
}

// Get all notifications by user id
export async function getAllNotificationsByUserId(userId: string) {
  const notifications = await db.notification.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  return notifications;
}

// Get notification by id
export async function getNotificationById(id: string) {
  const notification = await db.notification.findUnique({
    where: {
      id,
    },
  });
  return notification;
}

// Create notification
export async function sendNotification(userId: string, title: string, message: string, link: string, action: NotificationAction) {
  const notification = await db.notification.create({
    data: {
      userId,
      title,
      message,
      link,
      action
    }
  });
  return notification;
}

// read notification
export async function readNotificationsByUserId(userId: string, path: string) {
  const notification = await db.notification.updateMany({
    where: {
      userId,
    },
    data: {
      read: true
    }
  });

  revalidatePath(path);

  return notification;
}