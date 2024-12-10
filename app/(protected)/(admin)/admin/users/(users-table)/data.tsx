import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";

export const userStatuses = [
    {
      value: false.toString(),
      label: "Active",
      icon: CrossCircledIcon,
    },
    {
      value: true.toString(),
      label: "Banned",
      icon: CheckCircledIcon,
    },
]