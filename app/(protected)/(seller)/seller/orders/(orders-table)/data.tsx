import { OrderConfirmationStatus, OrderStatus } from "@prisma/client"
import {
    ArrowDownIcon,
    ArrowRightIcon,
    ArrowUpIcon,
    CheckCircledIcon,
    CircleIcon,
    CrossCircledIcon,
    QuestionMarkCircledIcon,
    StopwatchIcon,
  } from "@radix-ui/react-icons"

export const confirmationStatuses = [
    {
      value: OrderConfirmationStatus.CONFIRMED.toString(),
      label: "Confirmed",
      icon: CheckCircledIcon,
    },
    {
      value: OrderConfirmationStatus.PENDING.toString(),
      label: "Pending",
      icon: QuestionMarkCircledIcon,
    },
    {
      value: OrderConfirmationStatus.REJECTED.toString(),
      label: "Rejected",
      icon: CrossCircledIcon,
    },
]

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
]