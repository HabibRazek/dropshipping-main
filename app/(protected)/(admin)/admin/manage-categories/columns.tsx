"use client"
import { ColumnDef } from "@tanstack/react-table";
import { CategorySchema } from "@/schemas/index";
import * as z from "zod";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CategoryDataTableRowActions } from "./data-table-row-actions";

export const categoryColumns: ColumnDef<z.infer<typeof CategorySchema>>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        aria-label={`Sort by ${column.id}`}
      >
        Categories
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="flex items-center gap-x-4">
          {/* Add your category-specific content here */}
          <div>
            <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
              {category.name}
            </span>
          </div>
        </div>
      );
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
    id: "actions",
    cell: ({ row }) => <CategoryDataTableRowActions row={row} />,
  },
];
