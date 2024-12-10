"use client";

import { Row } from "@tanstack/react-table";

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
import { useTransition } from "react";
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

import { deleteProductById, getAllProducts } from "@/actions/product.actions";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

interface ProductsProps {
  product: Awaited<ReturnType<typeof getAllProducts>>[0];
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const product = row.original as ProductsProps["product"];

  const router = useRouter();
  const path = usePathname();

  const handleEditClick = () => {
    router.push(`/admin/manage-products/${product.id}`);
  };

  const [isLoading, startTransition] = useTransition();

  const handleDeleteClick = async (productId: string) => {
    try {
      startTransition(async () => {
        await deleteProductById(productId, path);
        toast({
          variant: "success",
          title: "Product deleted successfully.",
          description:
            "The product has been successfully deleted. It has been removed from the system.",
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
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  handleDeleteClick(product?.id || "");
                }}
                disabled={isLoading}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
