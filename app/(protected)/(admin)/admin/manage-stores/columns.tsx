"use client";

import { ColumnDef } from "@tanstack/react-table";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "./data-table-row-actions";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllStores } from "@/actions/store.actions";
import { StoreType } from "@prisma/client";

interface StoresProps {
  store: Awaited<ReturnType<typeof getAllStores>>[0];
}

export const columns: ColumnDef<StoresProps["store"]>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0"
        >
          Stores
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "link",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full px-3"
        >
          Link
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "user.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0"
        >
          Owner
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full pl-2"
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const type: string = row.getValue("type");
      return (
        <div className="block p-3">
          <Badge
            variant={type === StoreType.WOOCOMMERCE ? "default" : "blue"}
            className="rounded-lg"
          >
            {type}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "Status",
    accessorFn: (row) => {
      return row.isDeleted.toString();
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full pl-1"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const store = row.original;
      return (
        <div>
          <div className="block p-3">
            <Badge
              variant={store.isDeleted ? "destructive" : "success"}
              className="rounded-lg"
            >
              {store.isDeleted ? "Deleted" : "Available"}
            </Badge>
          </div>
        </div>
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
