// components/category-data-table/row-actions.tsx
import React from 'react';
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import { DeleteIcon, Edit } from "lucide-react";
import { useTransition } from "react";
import { deleteCategory, getAllCategories } from "@/actions/category.actions";
import { toast } from "@/components/ui/use-toast";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}
interface CategoriesProps {
  categorie: Awaited<ReturnType<typeof getAllCategories>>[0];
}

export function CategoryDataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const category = row.original as CategoriesProps["categorie"];
  const router = useRouter();

  const handleEditClick = () => {
    router.push(`/admin/manage-categories/${category.id}`);
  };

  const [isLoading, startTransition] = useTransition();

  const handleDeleteRequest = async (categoryId: string) => {
    startTransition(async () => {
      try {
        await deleteCategory(categoryId);
        toast({
          variant: "success",
          title: "Category deleted successfully.",
          description: "The category has been deleted.",
        });
        router.refresh();
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error deleting category.",
          description: "An error occurred while deleting the category.",
        });
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={handleEditClick}>
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleDeleteRequest(category.id || "")}
          disabled={isLoading}
        >
          <DeleteIcon className="mr-1.5 h-4 w-4 " />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
