"use client";

import { ColumnDef } from "@tanstack/react-table";


import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "./data-table-row-actions";
import Image from "next/image";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStoreProductsWithParallelItems } from "@/actions/store.actions";



interface ProductsProps {
  productPair: Awaited<ReturnType<typeof getStoreProductsWithParallelItems>>[0];
}

export const productsColumns: ColumnDef<ProductsProps["productPair"]>[] = [
  {
    id: "product.name",
    accessorKey: "product.name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        aria-label={`Sort by ${column.id}`}
      >
        Product
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const product = row.original?.product;
      return (
        <div className="flex items-center gap-x-4">
          <Image
            className="flex-shrink-0 size-[38px] rounded-lg"
            src={product!.images[0].url}
            alt={product!.name}
            width={38}
            height={38}
          />
          <div>
            <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200 w-[100px] text-wrap">
              {product!.name}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "product.category.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const category = row.original?.product.category.name;
      return (
        <div className="w-[100px] text-left pl-4">
          {category}
        </div>
      );
    },
  },
  {
    accessorKey: "product.description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.original?.product.description;
      return (
        <div
          className="min-w-[200px] max-w-[300px] truncate"
          title={description}
        >
          {description}
        </div>
      );
    },
  },
  {
    accessorKey: "product.price",
    header: "Base Price",
    cell: ({ row }) => {
      const price = row.original?.product.price;
      return (
        <div className="w-[100px] text-left pl-0 text-nowrap">
          {`${price?.toFixed(2)} TND`}
        </div>
      );
    },
  },
  {
    accessorKey: "productStoreItem.standardPrice",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Standard Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const standardPrice = row.original?.productStoreItem.standardPrice;
      return (
        <div className="w-[100px] text-center pl-3 text-nowrap">
          {`${standardPrice?.toFixed(2)} TND`}
        </div>
      );
    },
  },
  {
    accessorKey: "product.stock",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stock
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const stock = row.original?.product.stock;
      return (
        <div className="w-[100px] text-left pl-4">
          {stock}
        </div>
      );
    },
  },
  {
    accessorKey: "availability",
    header: "Availability",
    cell: ({ row }) => {
      const stock: number = row.original!.product.stock;
      return (
        <div>
          <span className="block text-left w-[100px]">
            <Badge
              variant={stock > 0 ? "success" : "destructive"}
              className="rounded-lg "
            >
              {stock > 0 ? "En Stock" : "Hors Stock"}
            </Badge>
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
