import {
  getStoreById,
  getStoreProductsWithParallelItems,
  getStoreTotalGain,
  getStoreTotalRevenue,
} from "@/actions/store.actions";
import StoreStatistcs from "@/components/store/store-stats";
import { Heading } from "@/components/ui/heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductsStoreDataTable } from "./(products-table)/data-table";
import { productsColumns } from "./(products-table)/columns";
import { OrdersStoreDataTable } from "./(orders-table)/data-table";
import { getOrdersByStoreId } from "@/actions/orders.actions";
import { ordersStoreColumns } from "./(orders-table)/columns";
import RessourceNotFound from "@/components/ressource-not-found";

export default async function page({
  params,
}: {
  params: { storeId: string };
}) {
  const store = await getStoreById(params.storeId);

  if (!store) {
    return <RessourceNotFound type="store" />;
  }

  const totalRevenue = await getStoreTotalRevenue(params.storeId);
  const totalGain = await getStoreTotalGain(params.storeId);


  const productsPair = await getStoreProductsWithParallelItems(params.storeId);
  const orders = await getOrdersByStoreId(params.storeId);


  return (
    <>
      <div className=" w-full h-full mx-auto flex-col md:flex">
        <Heading title={store?.name} description="" />
        <StoreStatistcs
          store={store}
          totalRevenue={totalRevenue}
          totalGain={totalGain}
        />
        <Tabs defaultValue="products" className="mt-5">
          <TabsList>
            <TabsTrigger value="products">PRODUCTS</TabsTrigger>
            <TabsTrigger value="orders">ORDERS</TabsTrigger>
          </TabsList>
          <TabsContent value="products">
            <ProductsStoreDataTable columns={productsColumns} data={productsPair}/>
          </TabsContent>
          <TabsContent value="orders">
            <OrdersStoreDataTable columns={ordersStoreColumns} data={orders} /> 
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
