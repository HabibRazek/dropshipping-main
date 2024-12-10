"use client";

import { Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { toast } from "@/components/ui/use-toast";
import { FaBan, FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { deleteUser, getAllUsers, unDeleteUser } from "@/actions/user.actions";
import { useForm } from "react-hook-form";
import { TransactionType } from "@prisma/client";
import { createTransaction } from "@/actions/transaction.actions";
import { AiOutlineUserDelete } from "react-icons/ai";
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
import { RiHeartAddFill } from "react-icons/ri";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

interface UsersProps {
  user: Awaited<ReturnType<typeof getAllUsers>>[0];
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const path = usePathname();
  const user = row.original as UsersProps["user"];

  const [isLoading, startTransition] = useTransition();
  const [isChargeAmountDialogOpen, setIsChargeAmountDialogOpen] =
    useState(false);
  const [isRetrieveAmountDeleteDialogOpen, setIsRetrieveAmountDialogOpen] =
    useState(false);
  const [isDeleteAlertDialogOpen, setIsDeleteAlertDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function handleWalletTransaction(
    userId: string,
    amount: number,
    type: TransactionType
  ) {
    startTransition(() => {
      createTransaction(userId, amount, type, path).then((response) => {
        if (response?.error) {
          toast({
            variant: "destructive",
            title: "Transaction failed",
            description: "Invalid amount",
          });
        }
        if (response?.success) {
          toast({
            variant: "success",
            title: "Transaction successful",
            description: `Amount ${
              type === TransactionType.CHARGE ? "charged" : "retrieved"
            } successfully`,
          });
          setIsChargeAmountDialogOpen(false);
          setIsRetrieveAmountDialogOpen(false);
        }
      });
    });
  }

  function handleDeleteAccount(userId: string) {
    startTransition(() => {
      if (!user.isDeleted) {
        deleteUser(userId).then((response) => {
          if (response?.error) {
            toast({
              variant: "destructive",
              title: "Ban failed",
              description: "Failed to ban account",
            });
          }
          if (response?.success) {
            toast({
              variant: "success",
              title: "Banned successful",
              description: "Account banned successfully",
            });
          }
        });
      }
      if (user.isDeleted) {
        unDeleteUser(userId).then((response) => {
          if (response?.error) {
            toast({
              variant: "destructive",
              title: "Unban failed",
              description: "Failed to unban account",
            });
          }
          if (response?.success) {
            toast({
              variant: "success",
              title: "Unbanned successful",
              description: "Account unbanned successfully",
            });
          }
        });
      }
    });
  }

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              setIsDeleteAlertDialogOpen(true);
            }}
          >
            {user.isDeleted ? (
              <RiHeartAddFill className="mr-2 h-4 w-4" />
            ) : (
              <FaBan className="mr-2 h-4 w-4" />
            )}
            {user.isDeleted ? "Unban" : "Ban"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setIsChargeAmountDialogOpen(true);
            }}
            disabled={isLoading}
          >
            <FaPlus className="mr-2 h-4 w-4" />
            <span>Charge Amount</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setIsRetrieveAmountDialogOpen(true);
            }}
            disabled={isLoading}
          >
            <FaMinus className="mr-2 h-4 w-4" />
            <span className="">Retrieve Amount</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Charge Amount Dialog */}
      <Dialog
        open={isChargeAmountDialogOpen}
        onOpenChange={() => {
          setIsChargeAmountDialogOpen(false);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Charge amount</DialogTitle>
            <DialogDescription className="text-green-600">
              {user.name}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit((data) => {
              handleWalletTransaction(
                user?.id,
                data.amount,
                TransactionType.CHARGE
              );
            })}
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="amount"
                  className={`text-right ${
                    errors.amount ? "text-red-500" : ""
                  }`}
                >
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="any"
                  defaultValue={0}
                  className={`col-span-3 mt-0 ${
                    errors.amount ? "border-red-500" : ""
                  }`}
                  {...register("amount", {
                    required: "Amount is required",
                    validate: (value) =>
                      (!isNaN(value) && Number(value) > 0) || "Invalid amount",
                  })}
                />
                {errors.amount && (
                  <p className="ml-24 text-red-500 col-span-4 text-sm">
                    {errors.amount.message as string}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              {/* The type="submit" attribute on this button will trigger form submission */}
              <Button type="submit" disabled={isLoading}>
                Charge
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Retrieve Amount Dialog */}
      <Dialog
        open={isRetrieveAmountDeleteDialogOpen}
        onOpenChange={() => setIsRetrieveAmountDialogOpen(false)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Retrieve amount</DialogTitle>
            <DialogDescription className="text-green-600">
              {user.name}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit((data) => {
              handleWalletTransaction(
                user?.id,
                data.amount,
                TransactionType.RETRIEVE
              );
            })}
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="amount"
                  className={`text-right ${
                    errors.amount ? "text-red-500" : ""
                  }`}
                >
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="any"
                  defaultValue={0}
                  className={`col-span-3 ${
                    errors.amount ? "border-red-500" : ""
                  }`}
                  {...register("amount", {
                    required: "Amount is required",
                    validate: {
                      positive: (value) =>
                        parseFloat(value) > 0 || "Invalid amount",
                      maximumValue: (value) =>
                        parseFloat(value) <= user?.wallet ||
                        "Insufficient funds",
                    },
                  })}
                />
                {errors.amount && (
                  <p className="ml-24 text-red-500 col-span-4 text-sm">
                    {errors.amount.message as string}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                Retrieve
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <AlertDialog
        open={isDeleteAlertDialogOpen}
        onOpenChange={() => {
          setIsDeleteAlertDialogOpen(false);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {user.isDeleted
                ? "This account will be unbanned, restoring its access."
                : "This action cannot be undone and will permanently remove access."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDeleteAccount(user?.id);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
