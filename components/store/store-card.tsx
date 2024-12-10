"use client";

import { use, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  deleteStore,
  disableStoreWebhook,
  enableStoreWebhook,
  getStoresBySellerId,
} from "@/actions/store.actions";
import { StoreType } from "@prisma/client";
import { formatDate } from "@/lib/utils";
import {
  ActivitySquare,
  DeleteIcon,
  Minus,
  MoreHorizontal,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaRegEdit } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "../ui/use-toast";
import { GrTransaction } from "react-icons/gr";

interface StoresProps {
  store: Awaited<ReturnType<typeof getStoresBySellerId>>[0];
  webhookStatus: string;
}

const StoreCard = ({ store, webhookStatus }: StoresProps) => {
  const router = useRouter();
  const path = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, startTransition] = useTransition();
  const [isDeleteStoreDialogOpen, setIsDeleteStoreDialogOpen] = useState(false);
  const [isStoreWebhookStatusDialogOpen, setIsStoreWebhookStatusDialogOpen] =
    useState(false);

  function handleDeleteStore(storeId: string) {
    startTransition(() => {
      deleteStore(storeId, path).then((response) => {
        if (response?.error) {
          toast({
            variant: "destructive",
            title: "Delete failed",
            description: "An error occurred while deleting the store",
          });
        }
        if (response?.success) {
          toast({
            variant: "success",
            title: "Store deleted",
            description: "The store has been successfully deleted",
          });
        }
      });
    });
  }

  function handleEnableAndDisableStore(storeId: string) {
    startTransition(() => {
      if (webhookStatus === "active") {
        disableStoreWebhook(storeId, path).then((response) => {
          if (response?.error) {
            toast({
              variant: "destructive",
              title: "Store disable failed",
              description: "An error occurred while disabling the store",
            });
          }
          if (response?.success) {
            toast({
              variant: "success",
              title: "Store disabled successfully",
              description: "The store has been successfully disabled",
            });
          }
        });
      } else {
        enableStoreWebhook(storeId, path).then((response) => {
          if (response?.error) {
            toast({
              variant: "destructive",
              title: "Store enable failed",
              description: "An error occurred while enabling the store",
            });
          }
          if (response?.success) {
            toast({
              variant: "success",
              title: "Store enabled successfully",
              description: "The store has been successfully enabled",
            });
          }
        });
      }
    });
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <div className="relative min-w-[410px] max-w-[425px] cursor-pointer  bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-xl dark:bg-gray-800 dark:border-gray-700" >
        <div className="absolute z-10 top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger disabled={isLoading}>
              <MoreHorizontal className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setIsStoreWebhookStatusDialogOpen(true);
                }}
                disabled={isLoading}
              >
                {webhookStatus === "active" ? (
                  <Minus className="mr-2 h-4 w-4" />
                ) : (
                  <GrTransaction className="mr-2 h-4 w-4" />
                )}
                <span>
                  {webhookStatus === "active"
                    ? "Disable orders"
                    : "Enable orders"}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/seller/stores/${store?.id}`)}
              >
                <FaRegEdit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setIsDeleteStoreDialogOpen(true);
                }}
                disabled={isLoading}
              >
                <DeleteIcon className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="p-5" onClick={() => {router.push(`/seller/stores/store/${store.id}`)}}>
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {store?.name}
          </h5>
          <Link href={store?.link}>
            <span className="text-indigo-600 hover:text-indigo-400 mb-3 text-sm">
              {store?.link}
            </span>
          </Link>
          <div className="flex items-center justify-between">
            <Button size="sm" className="py-1 mt-2 cursor-default">
              {store?.type === StoreType.WOOCOMMERCE ? "Woocommerce" : "Other"}
            </Button>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs font-light text-gray-500 dark:text-gray-400">
              {formatDate(store?.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Delete Account Dialog */}
      <AlertDialog
        open={isDeleteStoreDialogOpen}
        onOpenChange={() => {
          setIsDeleteStoreDialogOpen(false);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              store and all related data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDeleteStore(store?.id);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Enable and Disable Store Dialog */}
      <AlertDialog
        open={isStoreWebhookStatusDialogOpen}
        onOpenChange={() => {
          setIsStoreWebhookStatusDialogOpen(false);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {webhookStatus === "active" ? (
                <>
                  Disabling store orders will deactivate the order
                  automatisation for this store. Are you sure you want to
                  disable store orders?
                </>
              ) : (
                <>
                  Enabling store orders will activate the order automatisation
                  for this store. Are you sure you want to enable store orders?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleEnableAndDisableStore(store?.id);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default StoreCard;
