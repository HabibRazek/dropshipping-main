"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "./data-table-row-actions";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllUsers } from "@/actions/user.actions";

interface UsersProps {
  users: Awaited<ReturnType<typeof getAllUsers>>[0];
}
export const userColumns: ColumnDef<UsersProps["users"]>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },

  {
    accessorKey: "phoneNumber",
    header: "Phone number",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "postalCode",
    header: "Postal code",
  },
  {
    accessorKey: "wallet",
    header: "Wallet",
    cell: ({ row }) => {
      const user = row.original;
      return <>{user?.wallet.toFixed(3)} TND</>;
    },
  },
  {
    id: "isDeleted",
    accessorKey: "isDeleted",
    accessorFn: (row) => {
      return row.isDeleted.toString();
    },
    header: "Status",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Badge
          variant={user.isDeleted ? "destructive" : "success"}
          className="rounded-lg"
        >
          {user.isDeleted ? "Banned" : "Active"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
