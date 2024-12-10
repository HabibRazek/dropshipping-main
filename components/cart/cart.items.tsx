"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { CiWarning } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import useCart from "@/hooks/use-cart";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SellPriceInputSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Heading } from "../ui/heading";
import { StoreSwitcher } from "./store-switcher";
import {
  addProductsToStore,
  getStoresBySellerId,
} from "@/actions/store.actions";
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { MdOutlinePlaylistAddCheck } from "react-icons/md";
import { ScrollArea } from "../ui/scroll-area";
import { toast } from "../ui/use-toast";
import { useTransition } from "react";
import Image from "next/image";

interface StoreSwitcherProps {
  stores: Awaited<ReturnType<typeof getStoresBySellerId>>;
}

function CartItems({ stores = [] }: StoreSwitcherProps) {
  const router = useRouter();
  const cart = useCart();
  const [isLoading, startTransition] = useTransition();
  const { items } = cart;

  const getBasePrice = (product: any) => {
    const storedBasePrice = localStorage.getItem(`basePrice-${product?.id}`);
    if (storedBasePrice) {
      return Number(storedBasePrice);
    } else {
      localStorage.setItem(
        `basePrice-${product?.id}`,
        product?.price.toString()!
      );
      return product?.price;
    }
  };
  async function handleAddToStore() {
    startTransition(() => {
      try {
        addProductsToStore({ storeId: cart.storeId, items: items }).then(
          (response) => {
            if (response?.success) {
              router.push(`/seller/stores/store/${cart.storeId}`);
              cart.removeAll();
              toast({
                variant: "success",
                title: response.title,
                description: response.message,
              });
            }
            if (response?.error) {
              toast({
                variant: "destructive",
                title: response.title,
                description: response.message,
              });
            }
          }
        );
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Something went wrong !",
          description: "An error occurred while adding products to store.",
        });
      }
    });
  }

  const form = useForm<z.infer<typeof SellPriceInputSchema>>({
    resolver: zodResolver(SellPriceInputSchema),
    mode: "onChange",
  });

  const { trigger } = form;

  return (
    <>
      <Heading title={`Cart (${cart.items.length})`} description="" />
      <div className="w-full px-2 sm:px-6 lg:px-8 lg:py-12 mx-auto">
        <div className="mb-5 mt-0 pt-0"></div>
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-visible">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700">
                <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-gray-700">
                  <div className="sm:col-span-1">
                    <StoreSwitcher stores={stores} />
                  </div>
                  <div className="flex flex-row gap-x-2">
                    <Link
                      href="/seller/products"
                      className="flex flex-row justify-between"
                    >
                      <Button
                        className="pr-5 pl-2"
                        onClick={() => router.push("/seller/products")}
                        variant="default"
                        disabled={isLoading}
                      >
                        <div className="mr-2">
                          <FaPlus size={15} />
                        </div>
                        Add More
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          className="pr-3 pl-2 bg-red-600 hover:bg-red-500"
                          disabled={items.length === 0 || isLoading}
                        >
                          <div className="mr-2">
                            <FaRegTrashAlt size={16} />
                          </div>
                          Clear Cart
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete all the items in your cart.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              cart.removeAll(),
                                toast({
                                  variant: "success",
                                  title: "Cart cleared successfully.",
                                  description: "All items have been removed.",
                                });
                            }}
                            className="hover:bg-red-600"
                          >
                            Clear
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button
                      className="pr-5 pl-2 bg-green-600 hover:bg-green-500"
                      onClick={() => {
                        handleAddToStore();
                      }}
                      disabled={
                        items.length === 0 || !cart.storeId || isLoading
                      }
                    >
                      <div className="mr-2">
                        <MdOutlinePlaylistAddCheck size={23} />
                      </div>
                      Add to store
                    </Button>
                  </div>
                </div>
                <ScrollArea className="max-h-[493px] w-full relative rounded-md">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-slate-800 w-full">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-start">
                          <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                              Product
                            </span>
                          </div>
                        </th>

                        <th scope="col" className="px-6 py-3 text-start">
                          <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                              Category
                            </span>
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-start">
                          <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                              Base Price
                            </span>
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-start">
                          <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                              Standard Price
                            </span>
                          </div>
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {items.length === 0 && (
                        <tr>
                          <td className="px-6 py-4 text-center" colSpan={8}>
                            <div className="flex items-center justify-center">
                              <CiWarning className="w-6 h-6 text-gray-400 mr-2" />
                              <span className="block text-sm font-medium text-gray-400 dark:text-gray-500">
                                Your cart is empty
                              </span>
                            </div>
                          </td>
                        </tr>
                      )}
                      {items.map((item) => (
                        <tr
                          className="bg-white hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-slate-800 cursor-default"
                          key={item?.id}
                        >
                          <td className="relative size-px whitespace-nowrap align-top">
                            <div className="block p-6">
                              <div className="flex items-center gap-x-4">
                                <div
                                  className="absolute z-10 top-[0px] left-[0px] cursor-pointer"
                                  onClick={() => cart.removeItem(item?.id!)}
                                >
                                  <IoIosClose className="bg-red-500 rounded-ee-full text-white pr-1" size={33} />
                                </div>
                                <Image
                                  className="flex-shrink-0 size-[100px] rounded-lg ml-6"
                                  src={item?.images[0].url}
                                  alt={item?.name}
                                  width={100}
                                  height={100}
                                />
                                <div>
                                  <span className="block text-lg text-wrap font-semibold text-gray-800 dark:text-gray-200">
                                    {item?.name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="size-px whitespace-nowrap align-middle">
                            <a className="block p-6">
                              <span className="text-lg text-gray-600 dark:text-gray-400">
                                {item?.category.name}
                              </span>
                            </a>
                          </td>
                          <td className="size-px whitespace-nowrap align-middle">
                            <div className="block p-6">
                              <span className="text-base text-gray-600 dark:text-gray-400">
                                {formatPrice(Number(getBasePrice(item)))}
                              </span>
                            </div>
                          </td>
                          <td className="relative size-px whitespace-nowrap align-middle">
                            <div
                              className="absolute z-10 top-1 right-1 cursor-pointer"
                              onClick={() => cart.removeItem(item?.id!)}
                            ></div>
                            <div className="block p-6">
                              <span className="text-lg text-gray-600 dark:text-gray-400">
                                <Form {...form}>
                                  <form className="mt-0">
                                    <FormField
                                      control={form.control}
                                      name={`standardPrice-${item?.id}`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormControl>
                                            <>
                                              <div className="flex flex-row">
                                                <Input
                                                  type="number"
                                                  className="min-w-[150px]"
                                                  defaultValue={item?.price}
                                                  onChange={(e) => {
                                                    field.onChange(e);
                                                    cart.changeProductPrice(
                                                      item?.id!,
                                                      Number(e.target.value)
                                                    );
                                                    trigger(
                                                      `standardPrice-${item?.id}`
                                                    );
                                                  }}
                                                />
                                                <span className="text-sm text-gray-500 pt-[5px] ml-[2px]">
                                                  TND
                                                </span>
                                              </div>
                                            </>
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </form>
                                </Form>
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartItems;
