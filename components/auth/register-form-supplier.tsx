"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SupplierRegisterSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { registerSupplier } from "@/actions/auth/register";

export default function RegisterFormSeller() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const supplierform = useForm<z.infer<typeof SupplierRegisterSchema>>({
    resolver: zodResolver(SupplierRegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      phoneNumber: "",
      socialReason: "",
      taxRegistrationNumber: "",
      address: "",
      city: "",
      postalCode: "",
    }
  });

  const onSubmitSupplier = (values: z.infer<typeof SupplierRegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      registerSupplier(values)
        .then((data) => {
          if (data.error) setError(data.error);
          if (data.success) setSuccess(data.success);
        });
    });
  };


  return (


    <Form {...supplierform}>
      <form onSubmit={supplierform.handleSubmit(onSubmitSupplier)} className="space-y-6">
        <div className="space-y-0 sm:space-y-4">
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full md:w-1/2 px-3 mb-2 md:mb-0">
              <FormField
                control={supplierform.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} placeholder="john.doe@example.com" type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <FormField
                control={supplierform.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} placeholder="John Doe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full md:w-1/2 px-3 mb-2 md:mb-0">
              <FormField
                control={supplierform.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} placeholder="+216 12345678" type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <FormField
                control={supplierform.control}
                name="socialReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Social Reason</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} placeholder="Social Reason" type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full px-3 mt-2">
              <FormField
                control={supplierform.control}
                name="taxRegistrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Registration Number</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} placeholder="Tax Registration Number" type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>



          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full md:w-1/2 px-3 mb-2 md:mb-0">
              <FormField
                control={supplierform.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} placeholder="Address" type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <div className="flex -mx-3">
                <div className="w-full md:w-1/2 px-3 mb-2 md:mb-0">
                  <FormField
                    control={supplierform.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} placeholder="City" type="text" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full md:w-1/2 px-3">
                  <FormField
                    control={supplierform.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} placeholder="Postal Code" type="text" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full md:w-1/2 px-3 mb-2 md:mb-0">
              <FormField
                control={supplierform.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} placeholder="******" type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <FormField
                control={supplierform.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} placeholder="******" type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button disabled={isPending} type="submit" className="w-full">
          Create an account
        </Button>
      </form>
    </Form>

  )
}
