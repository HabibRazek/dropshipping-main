import {
    CrossCircledIcon,
    QuestionMarkCircledIcon,
  } from "@radix-ui/react-icons"



export const storeStatuses = [
    {
      value: false.toString(),
      label: "Available",
      icon: QuestionMarkCircledIcon,
    },
    {
      value: true.toString(),
      label: "Deleted",
      icon: CrossCircledIcon,
    },
]