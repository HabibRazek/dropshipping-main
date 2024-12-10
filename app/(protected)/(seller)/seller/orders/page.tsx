import { Heading } from "@/components/ui/heading";
import { currentUser } from "@/lib/auth";
import { getOrdersBySellerId } from "@/actions/orders.actions";
import OrdersStatistcs from "@/components/orders/orders-stats";
import { OrderConfirmationStatus, OrderStatus } from "@prisma/client";
import { OrdersDataTable } from "./(orders-table)/data-table";
import { ordersColumns } from "./(orders-table)/columns";

export default async function page() {
  const sessionUser = await currentUser();

  if (!sessionUser) {
    return null;
  }
  
  const orders = await getOrdersBySellerId(sessionUser.id);
  const confirmedOrders = orders.filter((order: any) => order.confirmationStatus === OrderConfirmationStatus.CONFIRMED);
  const awaitingconfirmationOrders = orders.filter((order: any) => order.confirmationStatus === OrderConfirmationStatus.PENDING);
  const rejectedOrders = orders.filter((order: any) => order.confirmationStatus === OrderConfirmationStatus.REJECTED);
  const pendingOrders = orders.filter((order: any) => order.status === OrderStatus.PENDING);
  const proccessingOrders = orders.filter((order: any) => order.status === OrderStatus.PROCESSING);
  const deliveredOrders = orders.filter((order: any) => order.status === OrderStatus.DELIVERED);
  const returnedOrders = orders.filter((order: any) => order.status === OrderStatus.RETURNED);
  const cancelledOrders = orders.filter((order: any) => order.status === OrderStatus.CANCELLED);


  return (
    <>
      <div className=" w-full h-full mx-auto flex-col md:flex">
        <Heading title={"Orders"} description="" />
        <OrdersStatistcs
          totalOrders={orders.length}
          confirmedOrders={confirmedOrders.length}
          awaitingconfirmationOrders={awaitingconfirmationOrders.length}
          rejectedOrders={rejectedOrders.length}
          pendingOrders={pendingOrders.length}
          proccessingOrders={proccessingOrders.length}
          deliveredOrders={deliveredOrders.length}
          cancelledOrders={cancelledOrders.length}
          returnedOrders={returnedOrders.length}
        />
        <div className="mt-8">
        <OrdersDataTable columns={ordersColumns} data={orders} />
        </div>
      </div>
    </>
  );
}

