"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FcViewDetails } from "react-icons/fc";
import { getAllOrdersForAdmin, getOrdersByStoreId } from "@/actions/orders.actions";
import { ScrollArea } from "@/components/ui/scroll-area";
import OrderDetailsAdmin from "@/components/orders/order-details-admin";

interface OrdersProps {
  order: Awaited<ReturnType<typeof getAllOrdersForAdmin>>[0];
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
        <button className="cursor-pointer ml-[10px]">
          <FcViewDetails className="h-5 w-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="min-w-[53%] min-h-[95%]">
      <ScrollArea className="h-[650px]">
        <OrderDetailsAdmin order={order}/>
      </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default OrdersDetailsDialog;
