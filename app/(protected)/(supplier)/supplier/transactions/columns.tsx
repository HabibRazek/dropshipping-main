"use client";

import { ColumnDef } from "@tanstack/react-table";

import { format, formatDate } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionType } from "@prisma/client";
import { getTransactionsByUserId } from "@/actions/transaction.actions";
import { formatPrice } from "@/lib/utils";

interface TransactionsProps {
  transaction: Awaited<ReturnType<typeof getTransactionsByUserId>>[0];
}

export const columns: ColumnDef<TransactionsProps["transaction"]>[] = [
  {
    id : "from",
    accessorKey: "from",
    header: "From",
    cell: ({ row }) => {
      return <div className="block p-3">{"Entrepot Administration"}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = row.original.amount;
      return <div className="block p-3">{formatPrice(amount)}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    accessorFn: (row) => {
      return format(new Date(row.createdAt), "dd/MM/yyyy", { locale: fr });
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const transaction = row.original;
      return <div className="block p-3">{
        // format date with time 
        formatDate(transaction.createdAt as Date, "dd/MM/yyyy HH:mm:ss", { locale: fr })
      }</div>;
    },
  },

  {
    accessorKey: "Type",
    accessorFn: (row) => {
      return row.type.toString();
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className=""
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const transaction = row.original;
      return (
        <div>
          <div className="block p-3">
            <Badge
              variant={transaction.type === TransactionType.RETRIEVE ? "destructive" : "success"}
              className="rounded-lg"
            >
              {transaction.type}
            </Badge>
          </div>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
