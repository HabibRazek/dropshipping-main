import { OrderConfirmationStatus, OrderStatus } from "@prisma/client"
import {
    CheckCircledIcon,
    CrossCircledIcon,
    QuestionMarkCircledIcon,
    StopwatchIcon,
  } from "@radix-ui/react-icons"



export const deliveryStatuses = [
    {
      value: OrderStatus.PENDING.toString(),
      label: "Pending",
      icon: QuestionMarkCircledIcon,
    },
    {
        value: OrderStatus.PROCESSING.toString(),
        label: "Processing",
        icon: StopwatchIcon,
    },
    {
        value: OrderStatus.DELIVERED.toString(),
        label: "Delivered",
        icon: CheckCircledIcon,
    },
    {
        value: OrderStatus.CANCELLED.toString(),
        label: "Cancelled",
        icon: CrossCircledIcon,
    },
    {
        value: OrderStatus.RETURNED.toString(),
        label: "Returned",
        icon: CrossCircledIcon,
    },
]