"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FcViewDetails } from "react-icons/fc";
import { getOrdersByStoreId, getOrdersBySupplierId } from "@/actions/orders.actions";
import OrderDetails from "@/components/orders/order-details";
import { ScrollArea } from "@/components/ui/scroll-area";
import OrderSupplierDetails from "@/components/orders/order-supplier-details";

interface OrdersProps {
  order: Awaited<ReturnType<typeof getOrdersBySupplierId>>[0];
}

const OrderSupplierDetailsDialog: React.FC<OrdersProps> = ({ order }) => {
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
        <OrderSupplierDetails order={order}/>
      </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default OrderSupplierDetailsDialog;
