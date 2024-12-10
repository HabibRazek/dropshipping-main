"use client";

import { getAllOrdersForAdmin } from "@/actions/orders.actions";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { formatCurrency, formatDate, formatPrice } from "@/lib/utils";
import { DeliveryType } from "@prisma/client";

interface OrderProps {
  order: Awaited<ReturnType<typeof getAllOrdersForAdmin>>[0];
}

function OrderDetailsAdmin({ order }: OrderProps) {
  const [isMounted, setIsMounted] = useState(false);

  function downloadPDF() {
    const input = document.getElementById("element-to-print");

    if (input) {
      const scale = 2; // Higher scale for better resolution

      html2canvas(input, { scale: scale, useCORS: true })
        .then((canvas) => {
          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "pt",
            format: "a4",
          });

          const margin = 20; // Margin in pts
          // Calculate the width and height, subtracting the margins
          const pdfWidth = pdf.internal.pageSize.getWidth() - margin * 2;
          const pdfHeight = pdf.internal.pageSize.getHeight() - margin * 2; // Not really needed unless you want a bottom margin
          const canvasWidth = canvas.width / scale;
          const canvasHeight = canvas.height / scale;

          // If the canvas is larger than the pdf page size, scale it down
          const ratio = Math.min(
            pdfWidth / canvasWidth,
            pdfHeight / canvasHeight
          );

          // Calculate final dimensions
          const finalWidth = canvasWidth * ratio;
          const finalHeight = canvasHeight * ratio;

          const imgData = canvas.toDataURL("image/png");

          // Add the image to the PDF
          pdf.addImage(imgData, "PNG", margin, margin, finalWidth, finalHeight);

          pdf.save("download.pdf");
        })
        .catch((err) => {
          console.error("Error: ", err);
        });
    } else {
      console.error("Element to print not found!");
    }
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <div className="inline-flex gap-x-2">
        <div
          onClick={downloadPDF}
          className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-lg border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
        >
          PDF
        </div>
      </div>
      <div className="w-full" id="element-to-print">
        <div>
          <div className="flex flex-col p-4 sm:p-10 bg-white shadow-md rounded-xl dark:bg-neutral-800">
            <div className="flex justify-between mb-10">
              <div>
                <svg
                  className="size-10"
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3"
                    y="3"
                    width="20"
                    height="4"
                    fill="currentColor"
                    className="fill-blue-600 dark:fill-white"
                  />
                  <rect
                    x="3"
                    y="11"
                    width="14"
                    height="4"
                    fill="currentColor"
                    className="fill-blue-600 dark:fill-white"
                  />
                  <rect
                    x="3"
                    y="19"
                    width="20"
                    height="4"
                    fill="currentColor"
                    className="fill-blue-600 dark:fill-white"
                  />
                  <rect
                    x="3"
                    y="3"
                    width="4"
                    height="20"
                    fill="currentColor"
                    className="fill-blue-600 dark:fill-white"
                  />
                </svg>

                <h1 className="mt-2 text-lg md:text-xl font-semibold text-blue-600 dark:text-white">
                  L’Entrepôt.
                </h1>
                <div className="mt-4 not-italic text-gray-800 dark:text-neutral-200">
                  Avenue Dargoum Palie, Jasmins
                  <br />
                  Nabeul 8000
                  <br />
                  Tunisia
                  <br />
                </div>
              </div>

              <div className="text-end">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-neutral-200">
                  Invoice
                </h2>
                <span className="mt-1 block text-blue-600 dark:text-neutral-500">
                  {`#${order.orderNumber}`}
                </span>
                <div className="sm:text-end mt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2">
                    <dl className="grid sm:grid-cols-5 gap-x-3">
                      <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">
                        Order date:
                      </dt>
                      <dd className="col-span-2 text-gray-500 dark:text-neutral-500">
                        {formatDate(order.createdAt)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid sm:grid-cols-2 gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
                  Bill to:
                </h3>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
                  {order.deliveryType === DeliveryType.DELIVERY_TO_SELLER
                    ? `${order.sellerBilling?.firstName} ${order.sellerBilling?.lastName}`
                    : `${order.billing?.firstName} ${order.billing?.lastName}`}
                </h3>
                <div className="mt-2 not-italic text-gray-500 dark:text-neutral-500">
                  {order.deliveryType === DeliveryType.DELIVERY_TO_SELLER
                    ? order.sellerBilling?.address
                    : order.billing?.address}
                  <br />
                  {order.deliveryType === DeliveryType.DELIVERY_TO_SELLER
                    ? `${order.sellerBilling?.city} ${order.sellerBilling?.postalCode}`
                    : `${order.billing?.city} ${order.billing?.postalCode}`}
                  <br />
                  {order.deliveryType === DeliveryType.DELIVERY_TO_SELLER
                    ? order.sellerBilling?.phone
                    : order.billing?.phone}
                  <br />
                  Tunisia
                </div>
              </div>
              {order.deliveryType === DeliveryType.DELIVERY_TO_CLIENT &&
                order.shipping && (
                  <div className="ml-20">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
                      Ship to:
                    </h3>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
                      {`${order.shipping?.firstName} ${order.shipping?.lastName}`}
                    </h3>
                    <div className="mt-2 not-italic text-gray-500 dark:text-neutral-500">
                      {order.shipping?.address}
                      <br />
                      {`${order.shipping?.city} ${order.shipping?.postalCode}`}
                      <br />
                      {order.shipping?.phone ? order?.shipping?.phone : "55460866"}
                      <br />
                      Tunisia
                    </div>
                  </div>
                )}
            </div>

            <div className="mt-6 w-full">
              <div className="border border-gray-200 p-4 rounded-lg space-y-4 dark:border-neutral-700">
                <div className="hidden sm:grid sm:grid-cols-5">
                  <div className="sm:col-span-2 text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                    Item
                  </div>
                  <div className="text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                    Qty
                  </div>
                  <div className="text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                    Price
                  </div>
                  <div className="text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                    Total
                  </div>
                </div>

                <div className="hidden sm:block border-b border-gray-200 dark:border-neutral-700"></div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  <div className="col-span-full sm:col-span-2">
                    <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                      Item
                    </h5>
                    {order?.orderItems.map((orderItem) => (
                      <p
                        key={orderItem.id}
                        className="font-medium text-gray-800 dark:text-gray-200"
                      >
                        {orderItem.name}
                      </p>
                    ))}
                  </div>
                  <div>
                    <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                      Qty
                    </h5>{" "}
                    {order?.orderItems.map((orderItem) => (
                      <p
                        key={orderItem.id}
                        className="text-gray-800 dark:text-gray-200"
                      >
                        {orderItem.quantity}
                      </p>
                    ))}
                  </div>
                  <div>
                    <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                      Price
                    </h5>
                    {order?.orderItems.map((orderItem) => (
                      <p
                        key={orderItem.id}
                        className="text-gray-800 dark:text-gray-200 text-nowrap"
                      >
                        {formatPrice(orderItem.price!)}
                      </p>
                    ))}
                  </div>
                  <div>
                    <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase">
                      Total
                    </h5>
                    {order?.orderItems.map((orderItem) => (
                      <p
                        key={orderItem.id}
                        className="sm:text-end text-gray-800 dark:text-gray-200 text-nowrap"
                      >
                        {formatPrice(orderItem.quantity * orderItem.price!)}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="sm:hidden border-b border-gray-200 dark:border-neutral-700"></div>
              </div>
            </div>

            <div className="sm:w-full sm:ml-auto sm:max-w-xs mt-8">
              <div className="space-y-2 border-t border-gray-200 pt-2 dark:border-neutral-700">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-neutral-500">
                    Total Base
                  </span>
                  <span className="text-gray-800 dark:text-neutral-200">
                    {formatPrice(order?.totalBase)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-neutral-500">
                    Total Standard
                  </span>
                  <span className="text-gray-800 dark:text-neutral-200">
                    {formatPrice(order?.totalStandard)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-neutral-500">
                    Gain
                  </span>
                  <span className="text-gray-800 dark:text-neutral-200">
                    {formatPrice(order?.gain)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderDetailsAdmin;
