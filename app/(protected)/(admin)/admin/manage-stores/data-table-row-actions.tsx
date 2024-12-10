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
import { Delete, DeleteIcon, Edit, MoreHorizontal } from "lucide-react";
import { useState, useTransition } from "react";
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

import { deleteProductById } from "@/actions/product.actions";
import {
  deleteStoreById,
  getAllStores,
  restoreStoreById,
} from "@/actions/store.actions";
import { MdRestore } from "react-icons/md";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

interface StoresProps {
  store: Awaited<ReturnType<typeof getAllStores>>[0];
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const store = row.original as StoresProps["store"];

  const router = useRouter();
  const path = usePathname();

  const [isLoading, startTransition] = useTransition();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);

  const handleDeleteClick = async (storeId: string, path: string) => {
    startTransition(() => {
      deleteStoreById(storeId, path)
        .then((response) => {
          if (response?.success) {
            toast({
              variant: "success",
              title: "Success",
              description: "The store has been deleted successfully.",
            });
          } else if (response?.error) {
            toast({
              variant: "destructive",
              title: response.message,
              description: "The store could not be deleted.",
            });
          }
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "An unexpected error occurred.",
          });
          console.error("Delete store error:", error);
        });
    });
  };

  const handleRestoreClick = async (storeId: string, path: string) => {
    startTransition(() => {
      restoreStoreById(storeId, path)
        .then((response) => {
          if (response?.success) {
            toast({
              variant: "success",
              title: response.message,
              description: "The store has been restored successfully.",
            });
          } else if (response?.error) {
            toast({
              variant: "destructive",
              title: response.message,
              description: "The store could not be restored.",
            });
          }
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "An unexpected error occurred.",
          });
          console.error("Restore store error:", error);
        });
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} disabled={store.isDeleted}>
            <Delete className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsRestoreDialogOpen(true)} disabled={!store.isDeleted}>
            <MdRestore className="mr-2 h-4 w-4" />
            <span>Restore</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={() => setIsDeleteDialogOpen(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will delete the store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDeleteClick(store.id, path);
                setIsDeleteDialogOpen(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Restore Dialog */}
      <AlertDialog
        open={isRestoreDialogOpen}
        onOpenChange={() => setIsRestoreDialogOpen(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will restore the store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleRestoreClick(store.id, path);
                setIsRestoreDialogOpen(false);
              }}
            >
              Restore
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
