import AdminDash from "@/components/dashboard/admin-dashboard";
import SellerDash from "@/components/dashboard/seller-dashboard";
import SupplierDash from "@/components/dashboard/supplier-dashboard";
import { currentRole, currentUser } from "@/lib/auth";
import { OrderStatus, UserRole } from "@prisma/client";

import { getAllOrdersForAdminDash, getAllProductsForAdminDash, getAllUsersForAdminDash, getTotalSellers, getUserById } from "@/actions/user.actions";
import {
  getProductsBySupplierId,
} from "@/actions/product.actions";

import{
  getAllStores,
  getTotalStoresByUser
}
from "@/actions/store.actions";

import {
  getTotalSellerGain,
  getTotalSellerRevenue,
}
from "@/actions/transaction.actions";
import { getOrdersBySellerId, getOrdersBySupplierId } from "@/actions/orders.actions";
import { all } from "axios";
import { getAllProductRequests } from "@/actions/request.actions";
import { getAllCategories } from "@/actions/category.actions";


export default async function DashboardPage() {

  const user = await currentUser();
  const role = await currentRole();
  const dbUser = await getUserById(user?.id!);

  // Admin Dashboard
  const allUsers = await getAllUsersForAdminDash();
  const totalSellers = allUsers.filter((user) => user.role === UserRole.USER).length;
  const totalSuppliers = allUsers.filter((user) => user.role === UserRole.SUPPLIER).length;

  const allProducts = await getAllProductsForAdminDash();
  const totalProducts = allProducts.length;

  const allOrders = await getAllOrdersForAdminDash();
  const totalOrders = allOrders.length;
  const totalPendingOrders = allOrders.filter((order) => order.status === OrderStatus.PENDING).length;
  const totalProcessingOrders = allOrders.filter((order) => order.status === OrderStatus.PROCESSING).length;
  const totalDeliveredOrders = allOrders.filter((order) => order.status === OrderStatus.DELIVERED).length;
  const totalReturnOrders = allOrders.filter((order) => order.status === OrderStatus.RETURNED).length;
  const canceledOrders = allOrders.filter((order) => order.status === OrderStatus.CANCELLED).length;

  const allRequests = await getAllProductRequests();
  const totalRequests = allRequests.length;

  const allStores = await getAllStores();
  const totalStores = allStores.length;

  const allCategories = await getAllCategories();
  const totalCategories = allCategories.length;

  // Seller Dashboard
  const totalStoresBySeller = await getTotalStoresByUser(user?.id!);
  const sellerOrders = await getOrdersBySellerId(user?.id!);
  const totalSellerOrders = sellerOrders.length;
  const totalProcessingOrdersBySeller = sellerOrders.filter((order: any) => order.status === OrderStatus.PROCESSING).length;
  const totalDeliveredOrdersBySeller = sellerOrders.filter((order: any) => order.status === OrderStatus.DELIVERED).length;
  const totalReturnOrdersBySeller = sellerOrders.filter((order: any) => order.status === OrderStatus.RETURNED).length;
  const totalCancledOrdersBySeller = sellerOrders.filter((order: any) => order.status === OrderStatus.CANCELLED).length;
  const totalPendingOrdersBySeller = sellerOrders.filter((order: any) => order.status === OrderStatus.PENDING).length;

  const totalGain = await getTotalSellerGain(user?.id!);
  const totalRevenue = await getTotalSellerRevenue(user?.id!);


  // Supplier Dashboard
  const productsBySupplier = await getProductsBySupplierId(dbUser?.supplier?.id!);
  const totalProductsBySupplier = productsBySupplier.length;
  const totalProductsOutOfStockBySupplier = productsBySupplier.filter((product) => product.stock === 0).length;
  const ordersBySupplier = await getOrdersBySupplierId(dbUser?.supplier?.id!);
  const totalOrdersBySupplier = ordersBySupplier.length;
  const totalProcessingOrdersBySupplier = ordersBySupplier.filter((order) => order.status === OrderStatus.PROCESSING).length;
  const totalDeliveredOrdersBySupplier = ordersBySupplier.filter((order) => order.status === OrderStatus.DELIVERED).length;
  const totalReturnOrdersBySupplier = ordersBySupplier.filter((order) => order.status === OrderStatus.RETURNED).length;
  const totalCancledOrdersBySupplier = ordersBySupplier.filter((order) => order.status === OrderStatus.CANCELLED).length;
  const totalPendingOrdersBySupplier = ordersBySupplier.filter((order) => order.status === OrderStatus.PENDING).length;

  return (
    <>
      {role === UserRole.ADMIN && (
        <AdminDash
          totalSellers={totalSellers}
          totalSuppliers={totalSuppliers}
          totalProducts={totalProducts}
          totalOrders={totalOrders}
          totalPendingOrders={totalPendingOrders}
          totalProcessingOrders={totalProcessingOrders}
          totalDeliveredOrders={totalDeliveredOrders}
          totalReturnOrders={totalReturnOrders}
          canceledOrders={canceledOrders}
          totalRequests={totalRequests}
          totalStores={totalStores}
          totalCategories={totalCategories}
        />
      )}

      {role === UserRole.USER && (
        <SellerDash
        totalStoresBySeller={totalStoresBySeller}
        totalOrdersBySeller={totalSellerOrders}
        totalProcessingOrdersBySeller={totalProcessingOrdersBySeller}
        totalDeliveredOrdersBySeller={totalDeliveredOrdersBySeller}
        totalReturnOrdersBySeller={totalReturnOrdersBySeller}
        totalCancledOrdersBySeller={totalCancledOrdersBySeller}
        totalPendingOrdersBySeller={totalPendingOrdersBySeller}
        totalGain={totalGain}
        totalRevenue={totalRevenue}

        />)}


      {role === UserRole.SUPPLIER && (
        <SupplierDash
          totalProductsBySupplier={totalProductsBySupplier}
          totalProductsOutOfStockBySupplier={totalProductsOutOfStockBySupplier}
          totalOrdersBySupplier={totalOrdersBySupplier}
          totalProcessingOrdersBySupplier={totalProcessingOrdersBySupplier}
          totalDeliveredOrdersBySupplier={totalDeliveredOrdersBySupplier}
          totalReturnOrdersBySupplier={totalReturnOrdersBySupplier}
          totalCancledOrdersBySupplier={totalCancledOrdersBySupplier}
          totalPendingOrdersBySupplier={totalPendingOrdersBySupplier}
        />
      )}
    </>
  );
}
