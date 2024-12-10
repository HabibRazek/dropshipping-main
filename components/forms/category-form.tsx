"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaPaperPlane } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";
import { createCategory, updateCategory } from "@/actions/category.actions";
import { useRouter, useParams } from "next/navigation";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { CategorySchema } from "@/schemas";
import { useTransition } from "react";
import { Heading } from "../ui/heading";
import { Separator } from "@radix-ui/react-dropdown-menu";

type CategoryFormValues = z.infer<typeof CategorySchema>;

interface CategoryFormProps {
  initialData: { id: string } | null;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, startTransition] = useTransition();

  const title = initialData ? "Edit Category" : "Create Category";
  const toastMessage = initialData ? "Category updated successfully." : "Category created successfully";
  const action = "Save";

  const defaultValues = initialData
    ? { ...initialData }
    : {
        name: "",
        description: "",
      };

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(CategorySchema),
    defaultValues: defaultValues,
  });

  const onSubmit = async (data: CategoryFormValues) => {
    startTransition(async () => {
      try {
        if (initialData) {
          await updateCategory(initialData.id, data);
        } else {
          await createCategory(data);
        }
        router.push(`/admin/manage-categories`);
        router.refresh();
        toast({
          variant: "success",
          title: "Category saved successfully.",
          description: toastMessage,
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Something went wrong.",
          description: "Something went wrong. Please try again later.",
        });
      }
    });
  };

  return (
    <>
    <Heading title={title} description={"Fill in the form to add a new category."} />
<Separator />
<Form {...form}>
  <form
    onSubmit={form.handleSubmit(onSubmit)}
    className="space-y-4 w-full mt-16 mx-auto p-10 rounded-2xl shadow-lg"
  >
    <div className="grid grid-cols-1 gap-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <Input
              disabled={isLoading}
              placeholder="Category name"
              {...field}
              className="w-full"
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <textarea
              disabled={isLoading}
              placeholder="Category description"
              {...field}
              className="w-full h-60 p-4 bg-transparent border  border-gray-300 rounded-sm focus:outline-none "
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>

    <Button disabled={isLoading} className="ml-auto" type="submit">
      {action} <FaPaperPlane className="ml-2" />
    </Button>
  </form>
</Form>
    </>
  );
};

export default CategoryForm;

