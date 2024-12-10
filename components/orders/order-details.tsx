"use client";

import { getOrdersByStoreId } from "@/actions/orders.actions";
import { formatDate, formatPrice } from "@/lib/utils";
import { useEffect, useState } from "react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface OrderProps {
  order: Awaited<ReturnType<typeof getOrdersByStoreId>>[0];
}

function OrderDetails({ order }: OrderProps) {
  const [isMounted, setIsMounted] = useState(false);




  function downloadPDF() {
    const input = document.getElementById('element-to-print');

    if (input) {
      const scale = 2; // Higher scale for better resolution

      html2canvas(input, { scale: scale, useCORS: true })
        .then((canvas) => {
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'a4'
          });

          const margin = 20; // Margin in pts
          // Calculate the width and height, subtracting the margins
          const pdfWidth = pdf.internal.pageSize.getWidth() - (margin * 2);
          const pdfHeight = pdf.internal.pageSize.getHeight() - (margin * 2); // Not really needed unless you want a bottom margin
          const canvasWidth = canvas.width / scale;
          const canvasHeight = canvas.height / scale;

          // If the canvas is larger than the pdf page size, scale it down
          const ratio = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);

          // Calculate final dimensions
          const finalWidth = canvasWidth * ratio;
          const finalHeight = canvasHeight * ratio;

          const imgData = canvas.toDataURL('image/png');

          // Add the image to the PDF
          pdf.addImage(imgData, 'PNG', margin, margin, finalWidth, finalHeight);

          pdf.save('download.pdf');
        })
        .catch(err => {
          console.error('Error: ', err);
        });
    } else {
      console.error('Element to print not found!');
    }
  }





  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;




  return (
    <>
      <div id="element-to-print" className="w-[100%]">
        <div className=" px-4 sm:px-6 lg:px-8 mx-auto my-4 sm:my-10">
          <div className="mb-5 pb-5 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Order Details
              </h2>
            </div>


          </div>

          <div className="grid md:grid-cols-2  w-[100%] gap-3">
            <div>
              <div className="grid space-y-3">
                <dl className="grid sm:flex gap-x-3 text-sm">
                  <dt className="min-w-36 max-w-[200px] text-gray-500">
                    Billed to:
                  </dt>
                  <dd className="text-gray-800 dark:text-gray-200">
                    <div className="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline font-medium">
                      {order?.billing?.firstName} {order?.billing?.lastName}
                    </div>
                  </dd>
                </dl>

                <dl className="grid sm:flex gap-x-3 text-sm">
                  <dt className="min-w-36 max-w-[200px] text-gray-500">
                    Billing details:
                  </dt>
                  <dd className="font-medium text-gray-800 dark:text-gray-200">
                    <address className="not-italic font-normal">
                      {order?.billing?.phone}
                      <br />
                      {order?.billing?.address}
                      <br />
                      {order?.billing?.city}, {order?.billing?.postalCode}
                      <br />
                      {"Tunisia"}
                      <br />
                    </address>
                  </dd>
                </dl>

                {order?.shipping && (
                  <>
                    <dl className="grid sm:flex gap-x-3 text-sm">
                      <dt className="min-w-36 max-w-[200px] text-gray-500">
                        Shipped to:
                      </dt>
                      <dd className="text-gray-800 dark:text-gray-200">
                        <div className="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline font-medium">
                          {order?.shipping?.firstName} {order?.shipping?.lastName}
                        </div>
                      </dd>
                    </dl>
                    <dl className="grid sm:flex gap-x-3 text-sm">
                      <dt className="min-w-36 max-w-[200px] text-gray-500">
                        Shipping details:
                      </dt>
                      <dd className="font-medium text-gray-800 dark:text-gray-200">
                        <address className="not-italic font-normal">
                          {order?.shipping?.phone}
                          <br />
                          {order?.shipping?.address}
                          <br />
                          {order?.shipping?.city}, {order?.shipping?.postalCode}
                          <br />
                          {"Tunisia"}
                          <br />
                        </address>
                      </dd>
                    </dl>
                  </>
                )}
              </div>
            </div>

            <div>
              <div className="grid space-y-3">
                <dl className="grid sm:flex gap-x-3 text-sm">
                  <dt className="min-w-36 max-w-[200px] text-gray-500">
                    Order number:
                  </dt>
                  <dd className="font-medium text-gray-800 dark:text-gray-200">
                    {"#" + order?.orderNumber}
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
                  <dt className="col-span-3 text-gray-500">Total Base:</dt>
                  <dd className="col-span-2 font-medium text-gray-800 dark:text-gray-200">
                    {order?.totalBase} 
                  </dd>
                </dl>

                <dl className="grid sm:grid-cols-5 gap-x-3 text-sm">
                  <dt className="col-span-3 text-gray-500">Total Standard:</dt>
                  <dd className="col-span-2 font-medium text-gray-800 dark:text-gray-200">
                    {formatPrice(order?.totalStandard!)}
                  </dd>
                </dl>

                <dl className="grid sm:grid-cols-5 gap-x-3 text-sm">
                  <dt className="col-span-3 text-gray-500">Gain:</dt>
                  <dd className="col-span-2 font-medium text-gray-800 dark:text-gray-200">
                    {formatPrice(order.gain!)}
                  </dd>
                </dl>
                <div className="h-8">

                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderDetails;
