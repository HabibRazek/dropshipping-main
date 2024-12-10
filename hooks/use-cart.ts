import { create } from 'zustand';
import { persist, createJSONStorage } from "zustand/middleware";

import { Category, Image, Product, Supplier, User } from '@prisma/client';
import { toast } from '@/components/ui/use-toast';

interface ProductDetails extends Product {
    category: Category;
    images: Image[];
    user: User | null;
    supplier: Supplier | null;
}

interface CartStore {
    items: ProductDetails[];
    storeId: string;
    addItem: (data: ProductDetails) => void;
    removeItem: (id: string) => void;
    removeAll: () => void;
    changeProductPrice: (id: string, price: number) => void;
    setStoreId: (id: string) => void;
    resetStoreId: () => void;
}

const useCart = create(
  //persisit exisit even when the page is refreshed
    persist<CartStore>((set, get) => ({
        items: [],
        storeId: "",
        addItem: (data: ProductDetails) => {
            const currentItems = get().items;
            const existingItem = currentItems.find((item) => item.id === data.id);

            if (existingItem) {
                toast({
                    variant: "destructive",
                    title: "Product already in cart.",
                    description: "You have already added this product to your cart.",
                });
            }
            else {
                set({ items: [...get().items, data] });
                toast({
                    variant: "success",
                    title: "Product added to cart.",
                    description: "You have successfully added this product to your cart.",
                });
            }
        },
        removeItem: (id: string) => {
            set({ items: [...get().items.filter((item) => item.id !== id)] });
            toast({
                variant: "success",
                title: "Product removed from cart.",
                description: "You have successfully removed this product from your cart.",
            });
        },
        removeAll: () => {
            set({ items: [] });
        },
        changeProductPrice: (id: string, price: number) => {
            const currentItems = get().items;
            const itemIndex = currentItems.findIndex((item) => item.id === id);

            const updatedItems = [...currentItems];
            updatedItems[itemIndex].price = price;

            set({ items: updatedItems });
        },
        setStoreId: (id: string) => set({ storeId: id }),
        resetStoreId: () => set({ storeId: "" }),
    }), {
        name: 'cart-storage',
        storage: createJSONStorage(() => localStorage)
    }));

export default useCart;
