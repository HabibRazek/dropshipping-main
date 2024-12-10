"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { IoIosArrowBack } from "react-icons/io";
import { useCurrentRole } from "@/hooks/use-current-role";
import { adminLinks, supplierLinks, sellerLinks, communLinks } from "@/utils/constants";
import { UserRole } from "@prisma/client";
import { useSideBarStore } from "@/hooks/use-side-bar-store-";


const Sidebar = () => {
  const pathname = usePathname();
  const role = useCurrentRole();

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  let storedSidebarExpanded = "true";

  const isSidebarOpen = useSideBarStore((state) => state.isOpen);
  const setSideBarClosed = useSideBarStore((state) => state.onClose);
  const toggleSideBar = useSideBarStore((state) => state.onToggle)

  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !isSidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSideBarClosed();
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!isSidebarOpen || key !== "Escape") return;
      setSideBarClosed()
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  // Determine the links based on the user's role
  let links: any[] = [];

  switch (role) {
    case UserRole.ADMIN:
      links = adminLinks;
      break;
    case UserRole.SUPPLIER:
      links = supplierLinks;
      break;
    case UserRole.USER:
      links = sellerLinks;
      break;
    default:
      break;
  }

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-50 flex h-screen w-[280px] flex-col overflow-y-hidden bg-white duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <Link href="/">
          <Image
            width={176}
            height={32}
            src={"/assets/logo.png"}
            alt="Logo"
            priority
          />
        </Link>

        <button
          ref={trigger}
          onClick={() => toggleSideBar()}
          aria-controls="sidebar"
          aria-expanded={isSidebarOpen}
          className="block lg:hidden"
        >
          <IoIosArrowBack className="w-6 h-6" />
        </button>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mx-2">
              {/* Render links dynamically */}
              {communLinks.map((link, index) => (
                <li key={index} className="mb-2">
                  <Link href={link.path}>
                    <p
                      className={`flex items-center p-2 rounded-md transition-colors ${
                        pathname.includes(link.path)
                          ? "bg-black text-white"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      {React.createElement(link.icon, { className: "mx-2 h-5 w-5" })}
                      <span className="mx-2">{link.title}</span>
                    </p>
                  </Link>
                </li>
              ))}
              {/* Render links dynamically */}
              {links.map((link, index) => (
                <li key={index} className="mb-2">
                  <Link href={link.path}>
                    <p
                      className={`flex items-center p-2 rounded-md transition-colors ${
                        pathname.includes(link.path)
                          ? "bg-black text-white"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      {React.createElement(link.icon, { className: "mx-2 h-5 w-5" })}
                      <span className="mx-2">{link.title}</span>
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            {/* <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              OTHERS
            </h3> */}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
