"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ProductRequest, ProductRequestStatus } from "@prisma/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "./data-table-row-actions";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import RequestDetailsDialog from "./RequestDetailsDialog";

// because of the type of the data, we need to use the Prisma type to get the correct type relation problem
import { getAllProductRequests } from "@/actions/request.actions";


interface ProductsProps {
  request: Awaited<ReturnType<typeof getAllProductRequests>>[0];
}

export const columns: ColumnDef<ProductsProps["request"]>[] = [
  {
    accessorKey: "supplier.user.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Supplier
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Product Name",
  },

  {
    accessorKey: "supplier.user.phoneNumber",
    header: "Phone Number",
  },

  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "approvisionment.quantity",
    header: "Quantity",
  },
  {
    accessorKey: "approvisionment.approvisionment",
    id: "approvisionment",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        aria-label={`Sort by ${column.id}`}
      >
        Approvisionment
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const value: Date = row.getValue("approvisionment");
      return (
        <div className="mx-auto w-10/12">
          <span className="truncate  font-medium">
            {value ? format(value, "dd/MM/yyyy", { locale: fr }) : "Not yet approvisioned"}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        aria-label={`Sort by ${column.id}`}
      >
        Created At
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const value: Date = row.getValue("createdAt");
      return (
        <div>
          <span className="truncate font-medium">
            {format(value, "dd/MM/yyyy", { locale: fr })}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const request: ProductRequest = row.original;
      return (
        <div className="block p-3">
          <Badge
            variant={
              request?.status === ProductRequestStatus.PENDING
                ? "default"
                : request?.status === ProductRequestStatus.REJECTED
                ? "destructive"
                : "success"
            }
            className="rounded-lg"
          >
            {request.status}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "requestDetails",
    header: "Details",
    cell: ({ row }) => <RequestDetailsDialog request={row.original} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
