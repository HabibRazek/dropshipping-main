"use client"

import React, { use, useEffect, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { confirmOrderDeliveryToClient, getOrdersByStoreId } from "@/actions/orders.actions";
import { usePathname } from "next/navigation";

function DeliveryDestinationSelectDialog({
  isConfirmOrderDialogOpen,
  setIsConfirmOrderDialogOpen,
  isDeliveryDestinationToSellerSelected,
  setIsDeliveryDestinationToSellerSelected,
  order
}: {
  isConfirmOrderDialogOpen: boolean;
  isDeliveryDestinationToSellerSelected: boolean;
  setIsConfirmOrderDialogOpen: (value: boolean) => void;
  setIsDeliveryDestinationToSellerSelected: (value: boolean) => void;
  order: Awaited<ReturnType<typeof getOrdersByStoreId>>[0];
}) {
  const [selectedOption, setSelectedOption] = useState("client");
  const [isLoading, startTransition] = useTransition();
  const path = usePathname();

  function handleConfirmOrderDeliveryToClient() {
    startTransition(() => {
      confirmOrderDeliveryToClient(order.id, path).then((response) => {
        if (response.error) {
          toast({
            variant: "destructive",
            title: "Order confirmation failed",
            description: response.message,
          });
          return;
        }
        if (response.success) {
          setIsConfirmOrderDialogOpen(false);
          toast({
            variant: "success",
            title: "Order Confirmed",
            description: "The order has been confirmed successfully and sent to the admin",
          });
        }
      });
    });
  }


  return (
    <Dialog
      open={isConfirmOrderDialogOpen}
      onOpenChange={() => {
        setIsConfirmOrderDialogOpen(false);
        setSelectedOption("client");
      }}
    >
      <DialogContent className="flex flex-col min-w-[45%] h-[35%] gap-y-3">
        <DialogHeader className="mb-8">
          <DialogTitle className="flex items-center text-2xl font-semibold">
            Who would you deliver this order to ?
          </DialogTitle>
        </DialogHeader>
        <RadioGroup
          defaultValue="client"
          onValueChange={(selectedValue) => setSelectedOption(selectedValue)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="client" id="client" className="h-6 w-6"  disabled={isLoading} />
            <Label htmlFor="client" className="text-lg font-normal">
              Deliver the order directly to the client
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="seller" id="seller" className="h-6 w-6"  disabled={isLoading} />
            <Label htmlFor="seller" className="text-lg font-normal">
                Deliver the order to the seller
            </Label>
          </div>
        </RadioGroup>
        <DialogFooter className="mt-8">
          <Button
            variant={selectedOption === "client" ? "success" : "default"}
            className="w-full"
            disabled={isLoading}
            onClick={() => {

              if (selectedOption === "seller") {
                setIsDeliveryDestinationToSellerSelected(true);
                setSelectedOption("client");
                setIsConfirmOrderDialogOpen(false);
                return
              }
              if (selectedOption === "client") {
                handleConfirmOrderDeliveryToClient();
              }
            }}
          >
            {selectedOption === "client" ? "Confirm" : "Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeliveryDestinationSelectDialog;
