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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

import { Row } from "@tanstack/react-table";
import {
  changeStandardPrice,
  getStoreProductsWithParallelItems,
  removeProductFromStore,
} from "@/actions/store.actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

interface ProductsProps {
  productPair: Awaited<ReturnType<typeof getStoreProductsWithParallelItems>>[0];
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const productPair = row.original as ProductsProps["productPair"];

  const path = usePathname();
  const [isLoading, startTransition] = useTransition();
  const [isChangeStandardPriceDialogOpen, setIsChangeStandardPriceDialogOpen] =
    useState(false);
  const [
    isRemoveFromProductListDialogOpen,
    setIsRemoveFromProductListDialogOpen,
  ] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function handleChangeStandardPrice(
    storeId: string,
    productId: string,
    productWoocommerceId: number,
    standardPrice: number
  ) {
    changeStandardPrice(
      storeId,
      productId,
      productWoocommerceId,
      standardPrice,
      path
    ).then((response) => {
      startTransition(() => {
        if (response.success) {
          toast({
            variant: "success",
            title: `${response.message}`,
            description: "The standard price has been changed successfully.",
          });
        }
        if (response.error) {
          toast({
            variant: "destructive",
            title: `${response.message}`,
            description: "An error occurred while changing the standard price.",
          });
        }
      });
    });
  }

  function handleRemoveFromProductList(storeId: string, productId: string, productWoocommerceId: number, path: string) {
      startTransition(() => {
        removeProductFromStore(storeId, productId, productWoocommerceId, path).then((response) => {
        if (response.success) {
          toast({
            variant: "success",
            title: `${response.message}`,
            description: "The product has been removed successfully.",
          });
        }
        if (response.error) {
          toast({
            variant: "destructive",
            title: `${response.message}`,
            description: "An error occurred while removing the product.",
          });
        }
      });
    });
}



  return (
    <>
     {/* Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => {
              setIsChangeStandardPriceDialogOpen(true);
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            <span>Change standard price</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              setIsRemoveFromProductListDialogOpen(true);
            }}
          >
            <DeleteIcon className="mr-2 h-4 w-4" />
            <span>Remove from Product List</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/*Change Standard Price Dialog */}
      <Dialog
        open={isChangeStandardPriceDialogOpen}
        onOpenChange={() => setIsChangeStandardPriceDialogOpen(false)}
      >
        <DialogContent className="sm:max-w-[425px] p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Change standard price
            </DialogTitle>
            <DialogDescription className="text-blue-600">
              {productPair?.product.name}
            </DialogDescription>
          </DialogHeader>
          <form
          onSubmit={handleSubmit((data) => {
            handleChangeStandardPrice(
              productPair?.productStoreItem?.storeId!,
              productPair?.product?.id!,
              productPair?.productStoreItem?.productWoocommerceId!,
              data.standardPrice!
            );
            setIsChangeStandardPriceDialogOpen(false); 
          })}          
          >
            <div className="mt-4">
              <div className="flex items-center gap-4 mb-4">
                <Label
                  htmlFor="standardPrice"
                  className={`w-1/4 ${
                    errors.standardPrice ? "text-red-500" : ""
                  }`}
                >
                  Price
                </Label>
                <div className="flex flex-1 items-center">
                  <Input
                    id="standardPrice"
                    type="number"
                    step="any"
                    defaultValue={productPair?.productStoreItem.standardPrice!}
                    className={`w-full ${
                      errors.standardPrice ? "border-red-500" : ""
                    }`}
                    {...register("standardPrice", {
                      required: "Standard Price is required",
                      validate: {
                        positive: (value) =>
                          parseFloat(value) > 0 || "Price must be positive",
                        greaterThanSpecificValue: (value) =>
                          parseFloat(value) > productPair?.product.price! ||
                          `Price must be greater than ${productPair?.product
                            .price!} TND`,
                      },
                    })}
                  />
                  <span className="ml-2 text-sm">TND</span>
                </div>
              </div>
              {errors.standardPrice && (
                <p className="text-red-500 text-sm">
                  {errors.standardPrice.message as string}
                </p>
              )}
            </div>
            <DialogFooter className="mt-6">
              <Button type="submit" disabled={isLoading} className="w-full">
                Change Price
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Remove from Product List Dialog */}
      <AlertDialog
        open={isRemoveFromProductListDialogOpen}
        onOpenChange={() => {
          setIsRemoveFromProductListDialogOpen(false);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove{" "}
              {productPair?.product.name} from your store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {handleRemoveFromProductList(productPair?.productStoreItem.storeId!, productPair?.product.id!, productPair?.productStoreItem.productWoocommerceId!, path)}} disabled={isLoading}>
              Confirm Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
