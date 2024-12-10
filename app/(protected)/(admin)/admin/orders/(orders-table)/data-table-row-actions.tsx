"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { MoreHorizontal } from "lucide-react";
import { useState, useTransition } from "react";

import { Row } from "@tanstack/react-table";
import { changeOrderStatus, getAllOrdersForAdmin } from "@/actions/orders.actions";
import { OrderStatus } from "@prisma/client";
import { usePathname } from "next/navigation";
import { FaExchangeAlt } from "react-icons/fa";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

interface OrdersProps {
  order: Awaited<ReturnType<typeof getAllOrdersForAdmin>>[0];
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const order = row.original as OrdersProps["order"];

  const [isLoading, startTransition] = useTransition();
  const [isChangeStatusDialogOpen, setIsChangeStatusDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(order.status);


  const path = usePathname();
 
  function handleChangeStatus() {
    startTransition(() => {
      changeOrderStatus(order.id, selectedOption, path);
    });
    setIsChangeStatusDialogOpen(false);
  }

  return (
    <>
      {/* Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => {
              setIsChangeStatusDialogOpen(true);
            }}
            disabled={order.status === OrderStatus.DELIVERED}
          >
            <FaExchangeAlt className="mr-2 h-4 w-4" />
            <span>Change Status</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Change Status Dialog */}
      <Dialog
        open={isChangeStatusDialogOpen}
        onOpenChange={() => {
          setIsChangeStatusDialogOpen(false);
        }}
      >
        <DialogContent className="sm:max-w-[425px] lg:min-w-[30%]">
          <DialogHeader>
            <DialogTitle>Change Status</DialogTitle>
          </DialogHeader>
          <Select 
           defaultValue={order.status}
           onValueChange={(value) => {
            setSelectedOption(value as OrderStatus);            
          }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
              <SelectItem value={OrderStatus.PROCESSING}>Processing</SelectItem>
              <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
              <SelectItem value={OrderStatus.RETURNED}>Returned</SelectItem>
              <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <DialogFooter>
            <Button type="submit" className="w-full" disabled={isLoading || selectedOption === order.status} onClick={handleChangeStatus}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
