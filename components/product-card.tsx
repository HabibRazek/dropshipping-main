import { formatPrice } from "@/lib/utils";
import { Category, Image, Product, Supplier, User } from "@prisma/client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import ImageNext from 'next/image';
import { MdOutlineZoomOutMap } from "react-icons/md"; // Import the icon
import { IoMdCart } from "react-icons/io";
import Link from "next/link";
import useCart from "@/hooks/use-cart";


interface ProductWithDetails extends Product {
  images: Image[];
  category: Category;
  supplier: Supplier | null;
  user: User | null;
}

interface ProductsProps {
  product: ProductWithDetails | undefined;
}

export default function ProductCard({ product }: ProductsProps) {
  const cart = useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }


   function onAddToCart (product: ProductWithDetails) {
    cart.addItem(product);
  };


  return (
    <div className="max-w-xs h-[425px] overflow-hidden bg-white rounded-lg shadow-xl z-10 transition-transform transform hover:scale-105">
      <Link href={`/seller/products/product/${product?.id}`} passHref>
        <p className="absolute h-5 top-0 right-0 p-2">
          <MdOutlineZoomOutMap className="text-gray-500 w-4 h-4" />
        </p>
      </Link>
      <div className="px-4 py-4">
        <h1 className="text-xl font-bold text-gray-800 uppercase">
          {product?.name}
        </h1>
        {product?.description && product.description.length > 127
          ? product.description.slice(0, 75) + "..."
          : product?.description}
      </div>

      <div className="relative overflow-hidden group">
        <ImageNext
          src={product?.images[0].url || ""}
          alt={product?.name || ""}
          width={350}
          height={350}
          className="object-cover w-full h-48 transition-transform transform group-hover:scale-110"
        />

      </div>

      <div className="flex items-center justify-between px-4 py-2  ">
        <h1 className="text-lg font-bold text-gray-800 ">
          {formatPrice(Number(product?.price))}
        </h1>
        <Button variant="outline" size="sm" className="text-semibold" onClick={() => onAddToCart(product!)}>
          Add<IoMdCart className="ml-1" />
        </Button>
      </div>
    </div>
  );
}
