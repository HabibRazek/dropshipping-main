"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { NewStoreSchema } from "@/schemas";
import { getStoreById, linkStore, updateStore } from "@/actions/store.actions";
import { toast } from "./ui/use-toast";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import path from "path";
import { update } from "@/auth";
import { FaLink } from "react-icons/fa";
import { BsShop } from "react-icons/bs";

interface NewStoreFormProps {
  initialData: Awaited<ReturnType<typeof getStoreById>>;
}

export const NewStoreForm = ({ initialData }: NewStoreFormProps) => {
  const path = usePathname();
  const title = initialData ? "Edit store details" : "Link a new store";
  const action = initialData ? "Update store" : "Link store";

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const sessionUser = useCurrentUser();

  const form = useForm<z.infer<typeof NewStoreSchema>>({
    resolver: zodResolver(NewStoreSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          link: initialData.link,
          consumerKey: initialData.CONSUMER_KEY,
          consumerSecret: initialData.CONSUMER_SECRET,
        }
      : {
          name: "",
          link: "",
          consumerKey: "",
          consumerSecret: "",
        },
  });

  const onSubmit = (values: z.infer<typeof NewStoreSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      if (initialData) {
        updateStore(initialData.id, values, path).then((res) => {
          if (res.error) {
            setError(res.message);
          }
          if (res.success) {
            setSuccess(res.message);
            form.reset();
            router.push("/seller/stores");
          }
        });

        return;
      }
      linkStore(sessionUser?.id!, values, path).then((res: any) => {
        if (res.error) {
          setError(res.message);
          return;
        }
        if (res.success) {
          setSuccess(res.message);
          toast({
            variant: "success",
            title: "Store linked successfully.",
            description:
              "The store has been linked. You can now start adding products.",
          });
          form.reset();
          router.push("/seller/stores");
        }
      });
    });
  };

  return (
    <div className="rounded-lg shadow-lg w-6/12 my-auto py-6 mx-auto">
      <CardWrapper
      headerTitle={title}
      headerLabel={
        initialData ? "Edit store details" : "Enter your store details"
      }
      backButtonLabel={null}
      backButtonHref="/seller/stores"
    >
      <BsShop className="mx-auto w-6 h-6" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Store Name"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={initialData ? true : isPending}
                      placeholder="https://store-link-example.com"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="consumerKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consumer Key</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Consumer Key"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="consumerSecret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consumer Secret</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Consumer Secret"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
          <FaLink className="mx-2" /> {action}
          </Button>
        </form>
      </Form>
    </CardWrapper>
    </div>
  );
};
