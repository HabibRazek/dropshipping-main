"use client";
import React from 'react';
import { Heading } from '../ui/heading';
import dynamic from 'next/dynamic';
import { LiaTruckLoadingSolid } from "react-icons/lia";


import { Separator } from '@radix-ui/react-dropdown-menu';
import { FiShoppingCart } from 'react-icons/fi';
import { FaMoneyBillTrendUp, FaTruckRampBox } from 'react-icons/fa6';
import { TbShoppingCartCancel, TbTruckLoading, TbTruckReturn } from 'react-icons/tb';
import { IoStorefrontOutline } from 'react-icons/io5';
import { CiDeliveryTruck } from 'react-icons/ci';


import {
  getTotalSellerGain,
  getTotalSellerRevenue
}
from "@/actions/transaction.actions";


const ApexChart = dynamic(() => import('../charts/seller/ApexChart'), { ssr: false });
const DonutChart = dynamic(() => import('../charts/seller/DonutChart'), { ssr: false });
const ReactApexChart = dynamic(() => import('../charts/seller/ReactApexChart'), { ssr: false });



const SellerDash = (
  {
    totalStoresBySeller,
    totalOrdersBySeller,
    totalProcessingOrdersBySeller,
    totalDeliveredOrdersBySeller,
    totalReturnOrdersBySeller,
    totalCancledOrdersBySeller,
    totalPendingOrdersBySeller,
    totalGain,
    totalRevenue,


  }: {
    totalStoresBySeller: number,
    totalOrdersBySeller: number,
    totalProcessingOrdersBySeller: number,
    totalDeliveredOrdersBySeller: number,
    totalReturnOrdersBySeller: number,
    totalCancledOrdersBySeller: number,
    totalPendingOrdersBySeller: number,
    totalGain: Awaited<ReturnType<typeof getTotalSellerGain>>,
    totalRevenue: Awaited<ReturnType<typeof getTotalSellerRevenue>>
  }
) => {


  return (
    <div>
      <div className="mx-10">
        <Heading title="Dashboard" description="" />
      </div>
      <div>
      </div>
      <div className="max-w-9/12 px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="grid sm:grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6 mx-auto">
          {/* Card for Total Stores */}
          <div className="flex flex-col border-l-[#0E185F]  border-l-4 rounded-md bg-white border shadow-lg dark:bg-slate-900 dark:border-gray-800">
            <div className="p-4 md:p-5 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Total Stores
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  {totalStoresBySeller}
                </h3>
              </div>
              <IoStorefrontOutline className="text-[#0E185F] text-3xl" />
            </div>
          </div>

          <div className="flex flex-col border-l-[#0E185F]  border-l-4 rounded-md bg-white border shadow-lg dark:bg-slate-900 dark:border-gray-800">
            <div className="p-4 md:p-5 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Total Orders
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  {totalOrdersBySeller}
                </h3>
              </div>
              <FaTruckRampBox className="text-[#0E185F] text-3xl" />
            </div>
          </div>

          <div className="flex flex-col border-l-[#0E185F]  border-l-4 rounded-md bg-white border shadow-lg dark:bg-slate-900 dark:border-gray-800">
            <div className="p-4 md:p-5 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Pending Orders
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  {totalPendingOrdersBySeller}
                </h3>
              </div>
              <TbTruckLoading className="text-[#0E185F] text-3xl" />
            </div>
          </div>

          <div className="flex flex-col border-l-[#0E185F]  border-l-4 rounded-md bg-white border shadow-lg dark:bg-slate-900 dark:border-gray-800">
            <div className="p-4 md:p-5 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Processing Orders
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                {totalProcessingOrdersBySeller}
                </h3>
              </div>
              <LiaTruckLoadingSolid className="text-[#0E185F] text-3xl" />
            </div>
          </div>

          <div className="flex flex-col border-l-[#0E185F]  border-l-4 rounded-md bg-white border shadow-lg dark:bg-slate-900 dark:border-gray-800">
            <div className="p-4 md:p-5 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Delivred Orders
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  {totalDeliveredOrdersBySeller}
                </h3>
              </div>
              <CiDeliveryTruck className="text-[#0E185F] text-3xl" />
            </div>
          </div>
          <div className="flex flex-col border-l-[#0E185F]  border-l-4 rounded-md bg-white border shadow-lg dark:bg-slate-900 dark:border-gray-800">
            <div className="p-4 md:p-5 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Returned Orders
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  {totalReturnOrdersBySeller}
                </h3>
              </div>
              <TbTruckReturn className="text-[#0E185F] text-3xl" />
            </div>
          </div>
          <div className="flex flex-col border-l-[#0E185F]  border-l-4 rounded-md bg-white border shadow-lg dark:bg-slate-900 dark:border-gray-800">
            <div className="p-4 md:p-5 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Cancled Orders
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  {totalCancledOrdersBySeller}
                </h3>
              </div>
              <TbShoppingCartCancel className="text-[#0E185F] text-3xl" />
            </div>
          </div>
          <div className="flex flex-col border-l-[#0E185F]  border-l-4 rounded-md bg-white border shadow-lg dark:bg-slate-900 dark:border-gray-800">
            <div className="p-4 md:p-5 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Gain
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-gray-200 text-wrap">
                {totalGain} <br /> TND
                </h3>
              </div>
              <FiShoppingCart className="text-[#0E185F] text-3xl" />
            </div>
          </div>
          <div className="flex flex-col border-l-[#0E185F]  border-l-4 rounded-md bg-white border shadow-lg dark:bg-slate-900 dark:border-gray-800">
            <div className="p-4 md:p-5 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Revenu
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-gray-200 text-wrap">
                {totalRevenue} <br /> TND
                </h3>
              </div>
              <FaMoneyBillTrendUp className="text-[#0E185F] text-3xl" />
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
          <ReactApexChart />
        </div>
      </div>
    </div>
  );
};

export default SellerDash;
