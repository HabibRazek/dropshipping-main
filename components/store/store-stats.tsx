"use client"

import { BsActivity } from "react-icons/bs"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { getStoreById, getStoreTotalGain, getStoreTotalRevenue } from "@/actions/store.actions"
import { TbBrandProducthunt } from "react-icons/tb";
import { FaProductHunt } from "react-icons/fa6"
import { IoReorderFourSharp } from "react-icons/io5"
import { BiSolidDollarCircle } from "react-icons/bi"
import { formatCurrency, formatDate } from "@/lib/utils";


interface StoreProps {
    store: Awaited<ReturnType<typeof getStoreById>>
    totalRevenue: Awaited<ReturnType<typeof getStoreTotalRevenue>>
    totalGain: Awaited<ReturnType<typeof getStoreTotalGain>>
}

function StoreStatistcs({ store, totalRevenue, totalGain } : StoreProps ) {
  if (!store) {
    return null
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-5">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Total Products
        </CardTitle>
        <FaProductHunt  className="w-5 h-5" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{store?.products.length}</div>
        <p className="text-xs text-muted-foreground">
            This store has {store?.products.length} products
        </p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
            Total Orders
        </CardTitle>
        <IoReorderFourSharp className="w-5 h-5" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{store?.orders.length}</div>
        <p className="text-xs text-muted-foreground">
            This store has {store?.orders.length} orders
        </p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        <BiSolidDollarCircle  className="w-5 h-5"  />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(Number(totalRevenue))}</div>
        <p className="text-xs text-muted-foreground">
            {`Since ${formatDate(store?.createdAt)}`}
        </p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
            Total Gain
        </CardTitle>
        <BiSolidDollarCircle className="w-5 h-5"  />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(Number(totalGain))}</div>
        <p className="text-xs text-muted-foreground">
        {`Since ${formatDate(store?.createdAt)}`}
        </p>
      </CardContent>
    </Card>
  </div>
  )
}

export default StoreStatistcs