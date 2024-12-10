import Image from "next/image";
import React from "react";
import { getProductById, getRelatedProducts } from "@/actions/product.actions";
import { formatPrice } from "@/lib/utils";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { BiCartAdd } from "react-icons/bi";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { RelatedProducts } from "@/components/related-products";
import AddToStoreButton from "@/components/add-to-store-button";
import Link from "next/link";
import RessourceNotFound from "@/components/ressource-not-found";

const page = async ({ params }: { params: { productId: string } }) => {
  const product = await getProductById(params.productId);
  if(product?.isDeleted === true){
    return <RessourceNotFound type="product" />
  }
  const relatedProducts = await getRelatedProducts(params.productId);

  return (
    <>
      <div className="mb-10">
        <Heading title="Product Details" description="" />
        <Separator className="w-full my-4" />
        <Link href="/seller/products" legacyBehavior>
          <a className="flex items-center gap-2 text-gray-700">
            <BiCartAdd />
            <span>Back to Products</span>
          </a>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-16 items-start lg:items-center">
        <div className="lg:w-1/2 flex justify-center">
          <Carousel className="w-full h-auto">
            <CarouselContent>
              {product?.images.map((image) => (
                <CarouselItem
                  key={image.id}
                  className="flex justify-center items-center"
                >
                  <div className="w-full h-96 relative">
                    <Image
                      src={image.url || ""}
                      alt={product?.name || ""}
                      layout="fill"
                      objectFit="contain"
                      className="transition-transform transform group-hover:scale-105"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 z-10" />
            <CarouselNext className="absolute right-0 z-10" />
          </Carousel>
        </div>
        <div className="lg:w-1/2 flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product?.name}</h1>
          <span className="mt-1 text-emerald-500 font-semibold">
            {product?.category?.name}
          </span>
          <p className="text-gray-700">{product?.description}</p>
          <h6 className="text-2xl font-semibold">
            {formatPrice(Number(product?.price))}
          </h6>
          <AddToStoreButton product={product} />
        </div>
      </div>
      <RelatedProducts relatedProducts={relatedProducts} />
    </>
  );
};

export default page;
