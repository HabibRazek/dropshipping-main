import { TransactionType } from "@prisma/client"
import {
    CrossCircledIcon,
    QuestionMarkCircledIcon,
  } from "@radix-ui/react-icons"



export const transactionsTypeStatuses = [
    {
      value: TransactionType.CHARGE.toString(),
      label: "Charge",
      icon: QuestionMarkCircledIcon,
    },
    {
      value: TransactionType.RETRIEVE.toString(),
      label: "Retrieve",
      icon: CrossCircledIcon,
    },
]