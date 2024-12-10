"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableRowActions } from "./data-table-row-actions";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getAllOrdersForAdmin,
  getOrdersBySellerId,
  getOrdersByStoreId,
} from "@/actions/orders.actions";
import OrdersDetailsDialog from "./orders-details-dialog";
import { Badge } from "@/components/ui/badge";

interface OrdersProps {
  order: Awaited<ReturnType<typeof getAllOrdersForAdmin>>[0];
}

export const ordersColumns: ColumnDef<OrdersProps["order"]>[] = [
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
    accessorKey: "totalBase",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0"
        >
          Base Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const totalBase = row.original?.totalBase;
      return (
        <div className="w-[100px] text-left pl-0 text-nowrap">
          {`${totalBase?.toFixed(3)} TND`}
        </div>
      );
    },
  },
  {
    accessorKey: "totalStandard",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-[3.5px]"
        >
          Standard Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const totalStandard = row.original?.totalStandard;
      return (
        <div className="w-[100px] text-center pl-3 text-nowrap">
          {`${totalStandard?.toFixed(3)} TND`}
        </div>
      );
    },
  },
  {
    accessorKey: "gain",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0"
        >
          Gain
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const gain = row.original?.gain;
      return (
        <div className="w-[100px] text-left pl-0 text-nowrap">
          {`${gain?.toFixed(3)} TND`}
        </div>
      );
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
          <span className="block text-left w-[100px]">
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
              className="rounded-lg"
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
    header: "Invoice",
    cell: ({ row }) => <OrdersDetailsDialog order={row.original} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
