"use client";

import { useState, useEffect } from "react";
import { Product, Category, Image, Supplier, User } from "@prisma/client";
import ProductCard from "./product-card";
import ImageNext from "next/image";


interface ProductWithDetails extends Product {
  images: Image[];
  category: Category;
  supplier: Supplier | null;
  user: User | null;
}

interface ProductsProps {
  products: ProductWithDetails[] | undefined;
}

function ProductsCatalogue({ products }: ProductsProps) {
  
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
        <div className="container px-6 py-10 mx-auto">
        {products?.length === 0 && (
            <div className="flex flex-col items-center justify-center h-96">
                <ImageNext
                  src="/assets/not-found-product.png"
                  alt="Empty"
                  width={200}
                  height={200}
                  className="mr-2"
                />
                <h1 className="text-3xl font-semibold italic text-gray-700 dark:text-gray-200 mt-5 pr-2">
                  No products found
                </h1>
              </div>
          )}

          <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-12 xl:gap-12 sm:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3">
            {products?.map((product) => (
              <div className="w-full " key={product.id}>
                <ProductCard key={product.id} product={product} />
              </div>
            ))}
          </div>
        </div>
    </>
  );
}

export default ProductsCatalogue;
