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
import { ProductSchema } from "@/schemas";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  addProductRequest,
  updateProductRequest,
} from "@/actions/request.actions";

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type ProductFormValues = z.infer<typeof ProductSchema>;

interface ProductFormProps {
  initialData:
    | (Product & {
        images: Image[];
      })
    | null;
  categories: Category[];
  supplierId: string | undefined;
}

export function ProductForm({
  initialData,
  categories,
  supplierId,
}: ProductFormProps) {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [isLoading, startTransition] = useTransition();

  const title = initialData ? "Edit product request" : "Create product request";
  const toastMessage = initialData
    ? "Edit product request sent to the admin."
    : "Product request sent to the admin.";
  const action = "Send request";

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
    resolver: zodResolver(ProductSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = async (data: ProductFormValues) => {
    startTransition(async () => {
      try {
        if (initialData) {
          const oldStock = initialData.stock;
          const stockChangedPositiveValue = data.stock > oldStock ? data.stock - oldStock: undefined;
          const stockChangedNegativeValue = data.stock < oldStock ? data.stock - oldStock: undefined;
          if (stockChangedPositiveValue) {
            data.stock = stockChangedPositiveValue;
          }
          if (stockChangedNegativeValue) {
            data.stock = stockChangedNegativeValue;
          }
          await updateProductRequest(
            params.productId.toString(),
            supplierId || "",
            data
          );
        } else {
          await addProductRequest(supplierId || "", data);
        }
        router.refresh();
        router.push(`/supplier/products`);
        toast({
          variant: "success",
          title: "Request sent successfully.",
          description:
            "Your request has been sent to the admin. You will be notified once it's approved.",
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
      <Heading title={title} description={" Fill in the form to send a request to the admin."} />
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid p-10 rounded-lg grid-cols-1 shadow-lg md:grid-cols-2 gap-8 mx-auto">
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

            <FormField
              control={form.control}
              name="approvisionment"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="mt-4">Approvisionment date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
