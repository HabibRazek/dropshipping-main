"use client";

import { getAllNotificationsByUserId } from "@/actions/notification.actions";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from 'date-fns';


interface SingleNotificationItemProps {
  notification: Awaited<ReturnType<typeof getAllNotificationsByUserId>>[0];
}

function SingleNotificationItem({ notification }: SingleNotificationItemProps) {
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });

  return (
          <Link
            href={notification.link}
            className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="flex-shrink-0">
              <Image
                className="rounded-full w-11 h-11"
                src="/assets/E.png"
                alt="Entrepot logo"
                width={44}
                height={44}
                />
            </div>
            <div className="w-full ps-3">
              <div className="font-semibold text-gray-900 dark:text-white">
                  {notification.title + " :"}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {notification.message}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-500">
                {timeAgo}
              </div>
            </div>
          </Link> 
    );
}

export default SingleNotificationItem;
