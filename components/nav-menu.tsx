"use client"

import { useSearchParams } from 'next/navigation'
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoFilterSharp } from "react-icons/io5";
import { Category } from "@prisma/client";


interface NavItemProps {
  path: string;
  label: string;
  categoryId: string;
}
interface categoriesProps {
  categories: Category[];
}

const NavMenu = ({ categories } : categoriesProps ) => {
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
  }, []);

  return (
    <nav className="py-4">
      <div className="container flex items-center overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
        <ul className="mx-4">
          <NavItem path="/seller/products" label="All" categoryId="all"/>
        </ul>
        <ul className="flex gap-x-4">
          {categories.map((category) => (
            <NavItem key={category.id} path={`/seller/products?categoryId=${category.id}`} label={category.name} categoryId={category.id}/>
          ))}
        </ul>
        <div className="ml-auto flex  items-center">
          <IoFilterSharp className="text-gray-800 mx-4" />
          <span className="hidden sm:inline text-gray-600 text-sm">Filter by category</span>
        </div>
      </div>
    </nav>
  );
};

const NavItem: React.FC<NavItemProps> = ({ path, label, categoryId }) => {
  const searchParams = useSearchParams()
  const initialRender = useRef(true);
  const search = searchParams.get("categoryId");

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
  }, []);

  const isCategoryActive = categoryId === search;
  return (
    <li>
      <p
        className={`${
          isCategoryActive ? "border-b-2 border-[#23E7A1]" : ""
        } text-gray-700 font-semibold py-2 px-3 mx-[-3px] bg-transparent`}
      >
        <Link href={path}>{label}</Link>
      </p>
    </li>
  );
};

export default NavMenu;
