"use client";

import { getProductById } from "@/actions/product.actions";
import CartItemPriceInputs from "./cart-item-price-inputs";
import { useEffect, useRef, useState } from "react";

interface CartProductProps {
  product: Awaited<ReturnType<typeof getProductById>>;
}

export function CartItem({ product }: CartProductProps) {
  const [originalPrice, setOriginalPrice] = useState<number | null>(null);

  useEffect(() => {
    // Try to load the original price from localStorage
    const storedOriginalPrice = localStorage.getItem(`originalPrice-${product?.id}`);
    
    if (storedOriginalPrice) {
      setOriginalPrice(Number(storedOriginalPrice));
    } else if (product && product.price && originalPrice === null) {
      setOriginalPrice(product.price);
      localStorage.setItem(`originalPrice-${product.id}`, product.price.toString());
    }
  }, [product, originalPrice]);

  return (
    <div className="relative flex mb-6 overflow-hidden rounded-lg bg-white shadow-md sm:flex-row justify-start">
      <div
        className="flex items-center justify-center"
        style={{ minWidth: "160px" }}
      >
        <img
          src={product?.images[0].url}
          alt="product-image"
          className="max-h-40 max-w-full object-contain align-middle"
        />
      </div>
      <div className="flex flex-col justify-between p-4 leading-normal mt-5">
        <div>
          <h2 className="mb-2 text-lg font-bold text-gray-900">
            {product?.name}
          </h2>
          <p className="text-sm text-gray-700">{product?.category?.name}</p>
        </div>
      </div>
      <div className="flex flex-col gap-y-4 ml-32 mt-[6px]">
        <CartItemPriceInputs product={product} originalPrice={originalPrice} />
      </div>
    </div>
  );
}
