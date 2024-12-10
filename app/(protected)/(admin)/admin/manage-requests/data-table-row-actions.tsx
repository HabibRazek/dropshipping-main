"use client";

import { Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import {
  ProductRequest,
  ProductRequestStatus,
  ProductRequestType,
  Supplier,
  User,
} from "@prisma/client";
import { useTransition } from "react";
import {
  approveAddProductRequest,
  approveDeleteProductRequest,
  approveUpdateProductRequest,
  deleteProductRequest,
  rejectProductRequest,
} from "@/actions/request.actions";
import { toast } from "@/components/ui/use-toast";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { RiEjectFill } from "react-icons/ri";
import { FcAcceptDatabase } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

interface RequestsWithDetails extends ProductRequest {
  supplier: (Supplier & { user: User }) | null;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const path = usePathname();
  const request = row.original as RequestsWithDetails;

  const [isLoading, startTransition] = useTransition();

  const handleApproveRequest = async (requestId: string, type: string) => {
    startTransition(async () => {
      if (type === ProductRequestType.CREATE) {
        await approveAddProductRequest(requestId, path)
          .then((data) => {
            if (data.success) {
              toast({
                variant: "success",
                title: "Request Approved Successfully",
                description: "The request has been approved successfully.",
              });
            }
          })
          .catch((error) => {
            toast({
              variant: "destructive",
              title: "Something went wrong!",
              description:
                "The request could not be approved. Please try again.",
            });
          });
      }
      if (type === ProductRequestType.UPDATE) {
        await approveUpdateProductRequest(requestId, path)
          .then((data) => {
            if (data.success) {
              toast({
                variant: "success",
                title: "Request Approved Successfully",
                description: "The request has been approved successfully.",
              });
            }
          })
          .catch((error) => {
            toast({
              variant: "destructive",
              title: "Something went wrong!",
              description:
                "The request could not be approved. Please try again.",
            });
          });
      }
      if (type === ProductRequestType.DELETE) {
        await approveDeleteProductRequest(requestId, path)
          .then((data) => {
            if (data.success) {
              toast({
                variant: "success",
                title: "Request Approved Successfully",
                description: "The request has been approved successfully.",
              });
            }
          })
          .catch((error) => {
            toast({
              variant: "destructive",
              title: "Something went wrong!",
              description:
                "The request could not be approved. Please try again.",
            });
          });
      }
    });
  };

  const handleRejectRequest = async (requestId: string) => {
    startTransition(async () => {
      await rejectProductRequest(requestId, path)
        .then((data) => {
          if (data.success) {
            toast({
              variant: "success",
              title: "Request Rejected Successfully",
              description: "The request has been rejected successfully.",
            });
          }
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            title: "Something went wrong!",
            description: "The request could not be rejected. Please try again.",
          });
        });
    });
  };

  return (
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
          onClick={() => handleApproveRequest(request.id, request.type)}
          disabled={
            request.status === ProductRequestStatus.ACCEPTED ||
            request.status === ProductRequestStatus.REJECTED ||
            isLoading
          }
        >
          <FcAcceptDatabase className="mr-2 h-4 w-4" />
          <span>Approve</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleRejectRequest(request.id)}
          disabled={
            request.status === ProductRequestStatus.ACCEPTED ||
            request.status === ProductRequestStatus.REJECTED ||
            isLoading
          }
        >
          <RiEjectFill className="mr-2 h-4 w-4" />
          <span className="">Reject</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
