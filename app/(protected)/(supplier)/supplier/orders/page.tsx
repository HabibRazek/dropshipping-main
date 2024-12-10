import { Heading } from "@/components/ui/heading";
import { currentUser } from "@/lib/auth";
import { getOrdersBySupplierId } from "@/actions/orders.actions";
import { OrderStatus } from "@prisma/client";
import { getUserById } from "@/actions/user.actions";
import OrdersSupplierStatistcs from "@/components/orders/orders-supplier-stats";
import { ordersSupplierColumns } from "./(orders-table)/columns";
import { OrderSupplierDataTable } from "./(orders-table)/data-table";

export default async function page() {
  const sessionUser = await currentUser();

  if (!sessionUser) {
    return null;
  }

  const user = await getUserById(sessionUser.id);

  if (!user?.supplier) {
    return null;
  }

  const orders = await getOrdersBySupplierId(user?.supplier?.id);
  const proccessingOrders = orders.filter(
    (order: any) => order.status === OrderStatus.PROCESSING
  );
  const deliveredOrders = orders.filter(
    (order: any) => order.status === OrderStatus.DELIVERED
  );
  const returnedOrders = orders.filter(
    (order: any) => order.status === OrderStatus.RETURNED
  );
  const cancelledOrders = orders.filter(
    (order: any) => order.status === OrderStatus.CANCELLED
  );

  return (
    <>
      <div className=" w-full h-full mx-auto flex-col md:flex">
        <Heading title={"Orders"} description="" />
        <OrdersSupplierStatistcs
          totalOrders={orders.length}
          proccessingOrders={proccessingOrders.length}
          deliveredOrders={deliveredOrders.length}
          cancelledOrders={cancelledOrders.length}
          returnedOrders={returnedOrders.length}
        />
        <div className="mt-8">
          <OrderSupplierDataTable columns={ordersSupplierColumns} data={orders} />
        </div>
      </div>
    </>
  );
}
