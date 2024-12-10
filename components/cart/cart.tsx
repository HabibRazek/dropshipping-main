import useCart from "@/hooks/use-cart";
import { Heading } from "../ui/heading";
import { useEffect, useState } from "react";
import CartItems from "./cart.items";
import { getStoresBySellerId } from "@/actions/store.actions";
import { currentUser } from "@/lib/auth";

export default async function CartPage() {
  const sessionUser = await currentUser();

  if (!sessionUser) {
    return null;
  }

  const stores = await getStoresBySellerId(sessionUser.id);

  return (
    <div className="h-screen">
      <CartItems stores={stores} />
      </div>
  );
}

