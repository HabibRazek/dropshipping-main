"use client";

import { ColumnDef } from "@tanstack/react-table";

import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "./data-table-row-actions";
import Image from "next/image";
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button";

import { Prisma } from "@prisma/client";
import { getProductsBySupplierId } from "@/actions/product.actions";


interface ProductsProps {
  product: Awaited<ReturnType<typeof getProductsBySupplierId>>[0];
}



export const columns: ColumnDef<ProductsProps["product"]>[] = [
  {
    accessorKey: "name",
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
      const product = row.original;
      return (
        <div className="flex items-center gap-x-4">
          <Image
            className="flex-shrink-0 size-[38px] rounded-lg"
            src={product.images[0].url}
            alt={product.name}
            width={38}
            height={38}
          />
          <div>
            <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
              {product.name}
            </span>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "category.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },

  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}

        aria-label={`Sort by ${column.id}`}
      >
        Created At
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const value: Date = row.getValue("createdAt");
      return (
        <div>
          <span className="truncate font-medium">
            {format(value, "dd/MM/yyyy", { locale: fr })}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "stock",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },

  {
    accessorKey: "availability",
    header: "DISPONIBILITÉ",
    cell: ({ row }) => {
      const stock: number = row.getValue("stock");
      return (
        <div>
          <a className="block p-3" href="#">
            <Badge
              variant={stock > 0 ? "success" : "destructive"}
              className="rounded-lg"
            >
              {stock > 0 ? "En Stock" : "Hors Stock"}
            </Badge>
          </a>
        </div>
      );
    },
  },
  {
    id: "actions",

    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
