"use client";

import { getOrdersBySupplierId } from "@/actions/orders.actions";
import { formatDate, formatPrice } from "@/lib/utils";
import { useEffect, useState } from "react";

interface OrderProps {
  order: Awaited<ReturnType<typeof getOrdersBySupplierId>>[0];
}

function OrderSupplierDetails({ order }: OrderProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <div className="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto my-4 sm:my-10">
        <div className="mb-5 pb-5 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Order Details
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <div className="grid space-y-3">
              <dl className="grid sm:flex gap-x-3 text-sm">
                <dt className="min-w-36 max-w-[200px] text-gray-500">
                  Order number:
                </dt>
                <dd className="font-medium text-gray-800 dark:text-gray-200">
                  {"#"+order?.orderNumber}
                </dd>
              </dl>

              <dl className="grid sm:flex gap-x-3 text-sm">
                <dt className="min-w-36 max-w-[200px] text-gray-500">
                  Order date:
                </dt>
                <dd className="font-medium text-gray-800 dark:text-gray-200">
                  {formatDate(order?.createdAt)}
                </dd>
              </dl>

              <dl className="grid sm:flex gap-x-3 text-sm">
                <dt className="min-w-36 max-w-[200px] text-gray-500">
                  Payment method:
                </dt>
                <dd className="font-medium text-gray-800 dark:text-gray-200">
                  Cash on delivery
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="mt-6 border border-gray-200 p-4 rounded-lg space-y-4 dark:border-gray-700">
          <div className="hidden sm:grid sm:grid-cols-5">
            <div className="sm:col-span-2 text-xs font-medium text-gray-500 uppercase">
              Item
            </div>
            <div className="text-start text-xs font-medium text-gray-500 uppercase">
              Qty
            </div>
            <div className="text-start text-xs font-medium text-gray-500 uppercase">
              Price
            </div>
            <div className="text-end text-xs font-medium text-gray-500 uppercase">
              Total
            </div>
          </div>

          <div className="hidden sm:block border-b border-gray-200 dark:border-gray-700"></div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            <div className="col-span-full sm:col-span-2">
              <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase">
                Item
              </h5>
              {order?.orderItems.map((orderItem) => (
                <p key={orderItem.id} className="font-medium text-gray-800 dark:text-gray-200">
                  {orderItem.name}
                </p>
              ))}
            </div>
            <div>
              <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase">
                Qty
              </h5>
              {order?.orderItems.map((orderItem) => (
                <p key={orderItem.id} className="text-gray-800 dark:text-gray-200">
                  {orderItem.quantity}
                </p>
              ))}
            </div>
            <div>
              <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase">
                Price
              </h5>
              {order?.orderItems.map((orderItem) => (
                <p key={orderItem.id} className="text-gray-800 dark:text-gray-200">
                  {formatPrice(orderItem.price!)}
                </p>
              ))}
            </div>
            <div>
              <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase">
                Total
              </h5>
              {order?.orderItems.map((orderItem) => (
                <p key={orderItem.id} className="sm:text-end text-gray-800 dark:text-gray-200">
                  {formatPrice(orderItem.price! * orderItem.quantity!)}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex sm:justify-end">
          <div className="w-full max-w-2xl sm:text-end space-y-2">
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2">
              <dl className="grid sm:grid-cols-5 gap-x-3 text-sm">
                <dt className="col-span-3 text-gray-500">Total:</dt>
                <dd className="col-span-2 font-medium text-gray-800 dark:text-gray-200">
                  {formatPrice(order?.total!)}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderSupplierDetails;
