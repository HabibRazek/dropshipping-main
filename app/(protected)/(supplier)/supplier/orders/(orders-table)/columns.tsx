"use client";

import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrdersBySupplierId } from "@/actions/orders.actions";
import { Badge } from "@/components/ui/badge";
import OrderSupplierDetailsDialog from "./orders-supplier-details-dialog";

interface OrdersProps {
  order: Awaited<ReturnType<typeof getOrdersBySupplierId>>[0];
}

export const ordersSupplierColumns: ColumnDef<OrdersProps["order"]>[] = [
  {
    id: "orderNumber",
    accessorKey: "orderNumber",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        aria-label={`Sort by ${column.id}`}
        className="pl-0"
      >
        Order Number
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const orderNumber = row.original?.orderNumber;
      return <div className="flex flex-3 text-left ">{orderNumber}</div>;
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original!.status.toString();
      return (
        <div>
          <span className="flex flex-1 text-left">
            <Badge
              variant={
                status === "PENDING"
                  ? "default"
                  : status === "PROCESSING"
                  ? "orange"
                  : status === "DELIVERED"
                  ? "success"
                  : status === "CANCELLED"
                  ? "destructive"
                  : status === "RETURNED"
                  ? "yellow"
                  : "default"
              }
              className="rounded-lg "
            >
              {status}
            </Badge>
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "orderDetails",
    header: "Details",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="flex flex-1">
        <OrderSupplierDetailsDialog order={order} />
        </div>
      );
    }
  },
];
