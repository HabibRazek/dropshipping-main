"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Category, Image, Product } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import { FaPaperPlane } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUpload from "@/components/ui/image-upload";
import { ProductSchema, ProductTableSchema } from "@/schemas";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/components/ui/use-toast";

import { useCurrentUser } from "@/hooks/use-current-user";
import { addProduct, updateProduct } from "@/actions/product.actions";

type ProductFormValues = z.infer<typeof ProductSchema>;

interface ProductFormProps {
  initialData:
    | (Product & {
        images: Image[];
      })
    | null;
  categories: Category[];
}

export function ProductFormAdmin({
  initialData,
  categories,
}: ProductFormProps) {
  const params = useParams();
  const router = useRouter();
  const sessionUser = useCurrentUser();

  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [isLoading, startTransition] = useTransition();

  const title = initialData ? "Edit Product" : "Create Product";

  const toastMessage = initialData
    ? "Product edited successfully."
    : "Product added successfully";

  const toastDescription = initialData
    ? "The product has been successfully edited. All changes have been saved and updated in the system."
    : "A new product has been successfully added. You can now view and manage the details of the newly added product.";

  const action = initialData ? "Edit" : "Add";

  const defaultValues = initialData
    ? {
        ...initialData,
        price: parseFloat(String(initialData?.price)),
        stock: parseInt(String(initialData?.stock)),
      }
    : {
        name: "",
        images: [],
        price: 0,
        stock: 0,
        categoryId: "",
        description: "",
      };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductTableSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = async (data: ProductFormValues) => {
    startTransition(async () => {
      try {
        if (initialData) {
          await updateProduct(
            params.productId.toString(),
            data
          );
        } else {
          await addProduct(sessionUser?.id || "", data);
        }
        router.push(`/admin/manage-products`);
        toast({
          variant: "success",
          title: toastMessage,
          description: toastDescription,
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
      <Heading
        title={title}
        description={
          initialData
            ? "Update the product details by filling out the form below."
            : "Add a new product to the system by completing the form below."
        }
      />
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid p-10 rounded-lg grid-cols-1 shadow-lg md:grid-cols-2 gap-8 mx-auto"
        >
          <div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Product name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isLoading}
                      placeholder="9.99"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isLoading}
                      placeholder="10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="border-gray-900 border-dashed ">
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value.map((image) => image.url)}
                      disabled={isLoading}
                      onChange={(url: any) =>
                        field.onChange([...field.value, { url }])
                      }
                      onRemove={(url: any) =>
                        field.onChange([
                          ...field.value.filter(
                            (current) => current.url !== url
                          ),
                        ])
                      }
                    />
                  </FormControl>
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
                  <FormControl>
                    <Textarea
                      className="h-56"
                      disabled={isLoading}
                      placeholder="Product description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} className="col-span-2" type="submit">
            {action} <FaPaperPlane className="mx-2" />
          </Button>
        </form>
      </Form>
    </>
  );
}
