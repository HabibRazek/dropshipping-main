"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FcViewDetails } from "react-icons/fc";
import { getOrdersByStoreId } from "@/actions/orders.actions";
import OrderDetails from "@/components/orders/order-details";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OrdersProps {
  order: Awaited<ReturnType<typeof getOrdersByStoreId>>[0];
}

const OrdersDetailsDialog: React.FC<OrdersProps> = ({ order }) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null;
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="cursor-pointer">
          <FcViewDetails className="h-5 w-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="min-w-[80%] min-h-[90%]">
      <ScrollArea className="h-[600px]">
        <OrderDetails order={order}/>
      </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default OrdersDetailsDialog;
