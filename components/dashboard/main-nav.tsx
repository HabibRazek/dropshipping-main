"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { UserButton } from "../auth/user-button";
import { HiMenuAlt1 } from "react-icons/hi";
import Notifications from "../notifications";
import { Button } from "../ui/button";
import { ShoppingBag, Wallet } from "lucide-react";
import { GrMoney } from "react-icons/gr";
import { useSideBarStore } from "@/hooks/use-side-bar-store-";
import { getAllNotificationsByUserId } from "@/actions/notification.actions";
import useCart from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";

interface NotificationsAndWalletProps {
  notifications: Awaited<ReturnType<typeof getAllNotificationsByUserId>>;
  wallet: number;
}

interface MainNavProps
  extends React.HTMLAttributes<HTMLElement>,
    NotificationsAndWalletProps {}

export function MainNav({
  className,
  notifications,
  wallet,
  ...props
}: MainNavProps) {
  const cart = useCart();
  const router = useRouter();
  const role = useCurrentRole();
  const isSidebarOpen = useSideBarStore((state) => state.isOpen);
  const toggleSideBar = useSideBarStore((state) => state.onToggle);

  return (
    <div className=" flex mt-2 h-16 items-center px-4">
      {/* Hide the button when sidebar is open */}
      {!isSidebarOpen && (
        <button
          aria-controls="sidebar"
          onClick={(e) => {
            e.stopPropagation();
            toggleSideBar();
          }}
          className="z-50 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
        >
          <HiMenuAlt1 />
        </button>
      )}
      <nav
        className={cn(
          "flex flex-wrap items-center space-x-4 lg:space-x-6",
          className
        )}
        {...props}
      >
        <Image
          src="/assets/logo.png"
          alt="Logo"
          className="hidden "
          width={200}
          height={100}
        />
        <Button className="flex items-center rounded-full bg-black ml-0 py-2">
          <GrMoney size={20} color="white" />
          <span className="ml-2 text-sm font-medium text-white">
            {wallet.toFixed(3)} TND
          </span>
        </Button>
        {role === UserRole.USER && (
          <Button
            className="flex items-center rounded-full bg-black px-4 py-2"
            onClick={() => router.push("/seller/cart")}
          >
            <ShoppingBag size={20} color="white" />
            <span className="ml-2 text-sm font-medium text-white">
              {cart.items.length}
            </span>
          </Button>
        )}
      </nav>
      <div className="ml-auto flex items-center space-x-4">
        <Notifications notifications={notifications} />
        <UserButton />
      </div>
    </div>
  );
}
