"use client";

import { getRelatedProducts } from "@/actions/product.actions";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface RelatedProductsProps {
  relatedProducts: Awaited<ReturnType<typeof getRelatedProducts>>;
}

export const RelatedProducts = ({ relatedProducts }: RelatedProductsProps) => {
    const router = useRouter();

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      {relatedProducts.length === 0 && (
        <h1 className="text-3xl font-semibold italic text-gray-700 dark:text-gray-200 mt-5 pr-2">
          No related products found
        </h1>
      )}
      {relatedProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedProducts.map((product: any) => (
            <Card
              key={product.id}
              className="flex flex-col items-center bg-white opacity-90 hover:bg-slate-50 rounded-lg shadow-md h-[296px] cursor-pointer"
              onClick={() => router.push(`/seller/products/product/${product.id}`)}
            >
              <div className="w-full h-44 relative">
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  fill
                  className="rounded-t-lg object-contain"
                />
              </div>
              <CardContent className="p-3">
                <h3 className="text-md font-semibold">{product.name}</h3>
                <p className="text-gray-700">
                  {product?.description.slice(0, 100)}...
                </p>
              </CardContent>
            </Card>
          ))} 
        </div>
      )}
    </div>
  );
};
