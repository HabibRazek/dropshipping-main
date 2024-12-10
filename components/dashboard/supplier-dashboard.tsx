"use client";

import React from "react";
import { Heading } from "../ui/heading";

import { Separator } from "@radix-ui/react-dropdown-menu";
import dynamic from "next/dynamic";
import { CiBoxes, CiDeliveryTruck, CiNoWaitingSign } from "react-icons/ci";
import { FaTruckRampBox } from "react-icons/fa6";
import {
  TbShoppingCartCancel,
  TbTruckLoading,
  TbTruckReturn,
} from "react-icons/tb";

const ApexChart = dynamic(() => import("../charts/supplier/ApexChart"), {
  ssr: false,
});
const DonutChart = dynamic(() => import("../charts/supplier/DonutChart"), {
  ssr: false,
});
const BarChart = dynamic(() => import("../charts/supplier/BarChart"), {
  ssr: false,
});

const SupplierDash = ({
  totalProductsBySupplier,
  totalProductsOutOfStockBySupplier,
  totalOrdersBySupplier,
  totalProcessingOrdersBySupplier,
  totalDeliveredOrdersBySupplier,
  totalReturnOrdersBySupplier,
  totalCancledOrdersBySupplier,
  totalPendingOrdersBySupplier,
}: {
  totalProductsBySupplier: number;
  totalProductsOutOfStockBySupplier: number;
  totalOrdersBySupplier: number;
  totalProcessingOrdersBySupplier: number;
  totalDeliveredOrdersBySupplier: number;
  totalReturnOrdersBySupplier: number;
  totalCancledOrdersBySupplier: number;
  totalPendingOrdersBySupplier: number;
}) => {
  return (
    <div>
      <div className="mx-10">
        <Heading title="Dashboard" description="" />
      </div>
      <div></div>
      <div className="max-w-9/12 px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-6 ">
          <div className="flex flex-col border-l-[#0E185F] border-l-4 rounded-md bg-white border shadow-lg ">
            <div className="p-4 md:p-5 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Total products
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  {totalProductsBySupplier}
                </h3>
              </div>
              <CiBoxes className="text-[0E185F] text-3xl" />
            </div>
          </div>

          <div className="flex flex-col border-l-[#0E185F] border-l-4 rounded-md bg-white border shadow-lg ">
            <div className="p-4 md:p-5 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Total products out of stock
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  {totalProductsOutOfStockBySupplier}
                </h3>
              </div>
              <CiNoWaitingSign className="text-[#0E185F] text-3xl" />
            </div>
          </div>

          <div className="flex flex-col border-l-[#0E185F] border-l-4 rounded-md bg-white border shadow-lg ">
            <div className="p-4 md:p-5 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Total orders
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  {totalOrdersBySupplier}
                </h3>
              </div>
              <FaTruckRampBox className="text-[#0E185F] text-3xl" />
            </div>
          </div>
          <div className="flex flex-col border-l-[#0E185F] border-l-4 rounded-md bg-white border shadow-lg ">
            <div className="p-4 md:p-5 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Pending Orders
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  {totalPendingOrdersBySupplier}
                </h3>
              </div>
              <TbShoppingCartCancel className="text-[#0E185F] text-3xl" />
            </div>
          </div>
          <div className="flex flex-col border-l-[#0E185F] border-l-4 rounded-md bg-white border shadow-lg ">
            <div className="p-4 md:p-5 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Processing Orders
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  {totalProcessingOrdersBySupplier}
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
                  {totalDeliveredOrdersBySupplier}
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
                  {totalReturnOrdersBySupplier}
                </h3>
              </div>
              <TbTruckReturn className="text-[#0E185F] text-3xl" />
            </div>
          </div>
          <div className="flex flex-col border-l-[#0E185F] border-l-4 rounded-md bg-white border shadow-lg ">
            <div className="p-4 md:p-5 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Cancled Orders
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  {totalCancledOrdersBySupplier}
                </h3>
              </div>
              <TbShoppingCartCancel className="text-[#0E185F] text-3xl" />
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
          <BarChart />
        </div>
      </div>
    </div>
  );
};

export default SupplierDash;
