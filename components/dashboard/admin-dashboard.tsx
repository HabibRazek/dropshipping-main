"use client";

import React from "react";
import { MdPendingActions } from "react-icons/md";
import dynamic from "next/dynamic";
import { HiMiniUserGroup } from "react-icons/hi2";

import { Heading } from "@/components/ui/heading";
import { TbTruckLoading, TbTruckReturn, TbUsers } from "react-icons/tb";
import { CiBoxes, CiDeliveryTruck } from "react-icons/ci";
import { FaTruckRampBox } from "react-icons/fa6";

const ApexChart = dynamic(() => import("../charts/admin/ApexChart"), {
  ssr: false,
});
const DonutChart = dynamic(() => import("../charts/admin/DonutChart"), {
  ssr: false,
});
const LineChart = dynamic(() => import("../charts/admin/LineChart"), {
  ssr: false,
});

const AdminDash = ({
  totalSellers,
  totalSuppliers,
  totalProducts,
  totalOrders,
  totalPendingOrders,
  totalProcessingOrders,
  totalDeliveredOrders,
  totalReturnOrders,
  canceledOrders,
  totalRequests,
  totalStores,
  totalCategories,
}: {
  totalSellers: number;
  totalSuppliers: number;
  totalProducts: number;
  totalOrders: number;
  totalPendingOrders: number;
  totalProcessingOrders: number;
  totalDeliveredOrders: number;
  totalReturnOrders: number;
  canceledOrders: number;
  totalRequests: number;
  totalStores: number;
  totalCategories: number;
}) => {
  return (
    <div>
      <div className="mx-10">
        <Heading title="Dashboard" description="" />
      </div>
      <div className="max-w-9/12 px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex flex-col border-l-[#0E185F] border-l-4 rounded-md bg-white border shadow-lg dark:bg-slate-900 dark:border-gray-800">
            <div className="p-4 md:p-5 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Total Sellers
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  {totalSellers}
                </h3>
              </div>
              <HiMiniUserGroup className="text-[0E185F] text-3xl" />
            </div>
          </div>

          <div className="flex flex-col border-l-[#0E185F] border-l-4 rounded-md bg-white border shadow-lg dark:bg-slate-900 dark:border-gray-800">
            <div className="p-4 md:p-5 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Total Suppliers
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  {totalSuppliers}
                </h3>
              </div>
              <TbUsers className="text-[0E185F] text-3xl" />
            </div>
          </div>

          <div className="flex flex-col border-l-[#0E185F] border-l-4 rounded-md bg-white border shadow-lg dark:bg-slate-900 dark:border-gray-800">
            <div className="p-4 md:p-5 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Total Products
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  {totalProducts}
                </h3>
              </div>
              <CiBoxes className="text-[0E185F] text-3xl" />
            </div>
          </div>

          <div className="flex flex-col border-l-[#0E185F] border-l-4 rounded-md bg-white border shadow-lg dark:bg-slate-900 dark:border-gray-800">
            <div className="p-4 md:p-5 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Total Categories
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  {totalCategories}
                </h3>
              </div>
              <CiBoxes className="text-[0E185F] text-3xl" />
            </div>
          </div>

          <div className="flex flex-col border-l-[#0E185F] border-l-4 rounded-md bg-white border shadow-lg dark:bg-slate-900 dark:border-gray-800">
            <div className="p-4 md:p-5 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Total Requests
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  {totalRequests}
                </h3>
              </div>
              <CiBoxes className="text-[0E185F] text-3xl" />
            </div>
          </div>

          <div className="flex flex-col border-l-[#0E185F] border-l-4 rounded-md bg-white border shadow-lg dark:bg-slate-900 dark:border-gray-800">
            <div className="p-4 md:p-5 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Total Stores
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  {totalStores}
                </h3>
              </div>
              <CiBoxes className="text-[0E185F] text-3xl" />
            </div>
          </div>

          <div className="flex flex-col border-l-[#0E185F] border-l-4 rounded-md bg-white border shadow-lg">
            <div className="p-4 md:p-5 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Total Orders
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  {totalOrders}
                </h3>
              </div>
              <FaTruckRampBox className="text-[#0E185F] text-3xl" />
            </div>
          </div>

          <div className="flex flex-col border-l-[#0E185F] border-l-4 rounded-md bg-white border shadow-lg dark:bg-slate-900 dark:border-gray-800">
            <div className="p-4 md:p-5 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Pending Orders
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  {totalPendingOrders}
                </h3>
              </div>
              <MdPendingActions className="text-[0E185F] text-3xl" />
            </div>
          </div>

          <div className="flex flex-col border-l-[#0E185F] border-l-4 rounded-md bg-white border shadow-lg ">
            <div className="p-4 md:p-5 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Processing Orders
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  {totalProcessingOrders}
                </h3>
              </div>
              <TbTruckLoading className="text-[#0E185F] text-3xl" />
            </div>
          </div>

          <div className="flex flex-col border-l-[#0E185F] border-l-4 rounded-md bg-white border shadow-lg ">
            <div className="p-4 md:p-5 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Delivred Orders
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  {totalDeliveredOrders}
                </h3>
              </div>
              <CiDeliveryTruck className="text-[#0E185F] text-3xl" />
            </div>
          </div>

          <div className="flex flex-col border-l-[#0E185F] border-l-4 rounded-md bg-white border shadow-lg ">
            <div className="p-4 md:p-5 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Returned Orders
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  {totalReturnOrders}
                </h3>
              </div>
              <TbTruckReturn className="text-[#0E185F] text-3xl" />
            </div>
          </div>

          <div className="flex flex-col border-l-[#0E185F] border-l-4 rounded-md bg-white border shadow-lg ">
            <div className="p-4 md:p-5 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Canceled Orders
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  {canceledOrders}
                </h3>
              </div>
              <TbTruckReturn className="text-[#0E185F] text-3xl" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between  bg-slate-50 p-6 shadow-lg rounded-xl mt-10 items-center">
          <div className="w-full md:w-8/12 ">
            <ApexChart />
          </div>
          <div className="w-full    rounded-xl md:w-4/12  mt-4 md:mt-0">
            <DonutChart />
          </div>
        </div>

        <div className="mt-10 bg-slate-50 p-6 shadow-lg rounded-xl   ">
          <LineChart />
        </div>
      </div>
    </div>
  );
};

export default AdminDash;
