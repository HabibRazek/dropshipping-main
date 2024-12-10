"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { FaCheck  } from "react-icons/fa6"
import { IoMdCloseCircle, IoMdReorder } from "react-icons/io"
import { MdCancelPresentation, MdOutlinePendingActions, MdPending } from "react-icons/md"
import { TbTruckDelivery, TbTruckReturn } from "react-icons/tb"
import { GiTakeMyMoney } from "react-icons/gi"


interface OrdersProps {
  totalOrders: number;
  confirmedOrders: number;
  awaitingconfirmationOrders: number;
  rejectedOrders: number;
  pendingOrders: number;
  proccessingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  returnedOrders: number;
}

function OrdersStatistcs({ totalOrders, confirmedOrders, awaitingconfirmationOrders, rejectedOrders, pendingOrders, proccessingOrders, deliveredOrders, cancelledOrders, returnedOrders }: OrdersProps) {
  return (
    <>
  <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1 mt-5">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-medium">
          Total Orders
        </CardTitle>
        <IoMdReorder   className="w-8 h-8" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{totalOrders}</div>
        <p className="text-sm text-muted-foreground mt-1">
            {totalOrders} orders have been made
        </p>
      </CardContent>
    </Card>
  </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-5">
    <Card className="border-emerald-500 border-[1px]">
      <CardHeader className="flex  flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Confirmed Orders
        </CardTitle>
        <FaCheck  className="w-5 h-5" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{confirmedOrders}</div>
        <p className="text-xs text-muted-foreground">
            {confirmedOrders} orders have been confirmed
        </p>
      </CardContent>
    </Card>
    <Card className="border-amber-400 border-[1px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Awaiting Orders</CardTitle>
        <MdOutlinePendingActions   className="w-5 h-5"  />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{awaitingconfirmationOrders}</div>
        <p className="text-xs text-muted-foreground">
            {awaitingconfirmationOrders} orders are awaiting confirmation
        </p>
      </CardContent>
    </Card>
    <Card className="border-red-500 border-[1px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Rejected Orders
        </CardTitle>
        <IoMdCloseCircle  className="w-5 h-5"  />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{rejectedOrders}</div>
        <p className="text-xs text-muted-foreground">
            {rejectedOrders} orders have been rejected
        </p>
      </CardContent>
    </Card>
    <Card className="border-blue-500 border-[1px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Pending Orders
        </CardTitle>
        <MdPending  className="w-5 h-5"  />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{pendingOrders}</div>
        <p className="text-xs text-muted-foreground">
            {pendingOrders} orders are pending
        </p>
      </CardContent>
    </Card>
    <Card className="border-amber-700 border-[1px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Proccessing Orders
        </CardTitle>
        <TbTruckDelivery  className="w-5 h-5"  />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{proccessingOrders}</div>
        <p className="text-xs text-muted-foreground">
            {proccessingOrders} orders are being processed
        </p>
      </CardContent>
    </Card>
    <Card className="border-lime-500 border-[1px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Delivered Orders
        </CardTitle>
        <GiTakeMyMoney  className="w-5 h-5"  />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{deliveredOrders}</div>
        <p className="text-xs text-muted-foreground">
            {deliveredOrders} orders have been delivered
        </p>
      </CardContent>
    </Card>
    <Card className="border-gray-700 border-[1px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Returned Orders
        </CardTitle>
        <TbTruckReturn  className="w-5 h-5"  />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{returnedOrders}</div>
        <p className="text-xs text-muted-foreground">
            {returnedOrders} orders have been returned
        </p>
      </CardContent>
    </Card>
    <Card className="border-red-400 border-[1px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Cancelled Orders
        </CardTitle>
        <MdCancelPresentation  className="w-5 h-5"  />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{cancelledOrders}</div>
        <p className="text-xs text-muted-foreground">
            {cancelledOrders} orders have been cancelled
        </p>
      </CardContent>
    </Card>
  </div>
  </>
  )
}

export default OrdersStatistcs
