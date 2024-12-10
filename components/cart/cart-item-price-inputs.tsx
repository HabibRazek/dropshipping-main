"use client";

import { getProductById } from "@/actions/product.actions";
import { SellPriceInputSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import useCart from "@/hooks/use-cart";
import { Button } from "../ui/button";

interface CartItemPriceInputsProps {
  product: Awaited<ReturnType<typeof getProductById>>;
  originalPrice: number | null;
}

function CartItemPriceInputs({
  product,
  originalPrice,
}: CartItemPriceInputsProps) {

  const cart = useCart();
  const form = useForm<z.infer<typeof SellPriceInputSchema>>({
    resolver: zodResolver(SellPriceInputSchema),
    defaultValues: {
      originalPrice: Number(originalPrice),
      sellPrice: Number(product?.price),
    },
  });

  const { trigger } = form;



  return (
    <Form {...form}>
      <form  className="mt-0">
        <div>
          <FormField
            control={form.control}
            name="originalPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Original Price</FormLabel>
                <FormControl>
                  <Input type="number" disabled value={originalPrice ?? 0} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sellPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sell Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    defaultValue={product?.price}
                    onChange={(e) => {
                      field.onChange(e);
                      cart.changeProductPrice(product?.id!, Number(e.target.value));
                      trigger("sellPrice")
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}

export default CartItemPriceInputs;
