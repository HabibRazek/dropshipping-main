"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "./data-table-row-actions";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllSuppliers } from "@/actions/user.actions";

interface UsersProps {
  supplier: Awaited<ReturnType<typeof getAllSuppliers>>[0];
}

export const supplierColumns: ColumnDef<UsersProps["supplier"]>[] = [
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
    header: "email",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },
  {
    accessorKey: "supplier.socialReason",
    header: "Social Reason",
  },
  {
    accessorKey: "supplier.taxRegistrationNumber",
    header: "Tax Registration Number",
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
    header: "postalCode",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Badge variant="orange" className="rounded-lg">
          {user.role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isDeleted",
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
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
