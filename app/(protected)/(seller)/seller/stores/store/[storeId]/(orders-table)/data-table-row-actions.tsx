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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal } from "lucide-react";
import { useState, useTransition } from "react";

import { Row } from "@tanstack/react-table";
import { GiConfirmed } from "react-icons/gi";
import { IoCloseCircle } from "react-icons/io5";
import { getOrdersByStoreId, rejectOrder } from "@/actions/orders.actions";
import DeliveryDestinationSelectDialog from "@/components/orders/delivery-destination-select-dialog";
import DeliveryDialogContent from "@/components/orders/delivery-dialog-content";
import { OrderConfirmationStatus } from "@prisma/client";
import { usePathname } from "next/navigation";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

interface OrdersProps {
  order: Awaited<ReturnType<typeof getOrdersByStoreId>>[0];
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const order = row.original as OrdersProps["order"];

  const [isLoading, startTransition] = useTransition();
  const [isConfirmOrderDialogOpen, setIsConfirmOrderDialogOpen] =
    useState(false);
  const [isRejectOrderDialogOpen, setIsRejectOrderDialogOpen] = useState(false);
  const [
    isDeliveryDestinationToSellerSelected,
    setIsDeliveryDestinationToSellerSelected,
  ] = useState(false);

  const path = usePathname();


  function handleRejectOrder() {
    startTransition(() => {
      rejectOrder(order.id, path);
    });
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
              setIsConfirmOrderDialogOpen(true);
            }}
            disabled={order.confirmationStatus !== OrderConfirmationStatus.PENDING}
          >
            <GiConfirmed className="mr-2 h-4 w-4" />
            <span>Confirm</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              setIsRejectOrderDialogOpen(true);
            }}
            disabled={order.confirmationStatus !== OrderConfirmationStatus.PENDING}
          >
            <IoCloseCircle className="mr-2 h-4 w-4" />
            <span>Reject</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* <DeliveryDialogContent /> */}
      <DeliveryDestinationSelectDialog
        isConfirmOrderDialogOpen={isConfirmOrderDialogOpen}
        setIsConfirmOrderDialogOpen={setIsConfirmOrderDialogOpen}
        isDeliveryDestinationToSellerSelected={isDeliveryDestinationToSellerSelected}
        setIsDeliveryDestinationToSellerSelected={setIsDeliveryDestinationToSellerSelected}
        order={order}
      />

      {/* Confirm Order Dialog Stepper */}
      <DeliveryDialogContent 
        isDeliveryDestinationToSellerSelected={isDeliveryDestinationToSellerSelected} 
        setIsDeliveryDestinationToSellerSelected={setIsDeliveryDestinationToSellerSelected} 
        order={order}
      />

            {/* Reject Order Dialog */}
            <AlertDialog
        open={isRejectOrderDialogOpen}
        onOpenChange={() => {
          setIsRejectOrderDialogOpen(false);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will reject the order.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {handleRejectOrder}}disabled={isLoading}>
              Confirm Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
