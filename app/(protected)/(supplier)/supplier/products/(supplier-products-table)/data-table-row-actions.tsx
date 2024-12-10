"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import { DeleteIcon, Edit, MoreHorizontal } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteProductRequest } from "@/actions/request.actions";
import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Row } from "@tanstack/react-table";
import { getProductsBySupplierId } from "@/actions/product.actions";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

interface ProductsProps {
  product: Awaited<ReturnType<typeof getProductsBySupplierId>>[0];
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const product = row.original as ProductsProps["product"];

  const router = useRouter();
  const path = usePathname();

  const [date, setDate] = useState<Date>();

  const handleEditClick = () => {
    router.push(`/supplier/products/${product.id}`);
  };

  const [isLoading, startTransition] = useTransition();

  const handleDeleteRequest = async (
    productId: string,
    supplierId: string,
    approvisionment: Date | undefined
  ) => {
    try {
      startTransition(async () => {
        await deleteProductRequest(
          productId,
          supplierId,
          approvisionment
            ? approvisionment
            : new Date(new Date().getDate() + 7),
          path
        );
        toast({
          variant: "success",
          title: "Request sent successfully.",
          description:
            "Your request has been sent to the admin. You will be notified once it's approved.",
        });
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "Something went wrong. Please try again later.",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuItem onClick={handleEditClick}>
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>

        <AlertDialog>
          <AlertDialogTrigger className="flex flex-row justify-start items-center hover:bg-gray-50 w-full rounded-md p-0.5">
            <DeleteIcon className="mr-1.5 h-5 w-4 ml-1.5" />
            Delete
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="flex flex-col gap-y-2">
                This action cannot be undone. This will sent a request to the
                admin to delete the product.
                <div className="font-semibold text-slate-900 mt-2">
                  Select an approvisionment date
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"default"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      required
                    />
                  </PopoverContent>
                </Popover>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setDate(undefined);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setDate(undefined),
                    handleDeleteRequest(
                      product?.id || "",
                      product?.supplierId || "",
                      date
                    );
                }}
                disabled={isLoading || !date}
              >
                Send
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
