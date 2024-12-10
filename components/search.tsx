"use client";

import { useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "./ui/input";
import { CiSearch } from "react-icons/ci"; // Importez l'icône de recherche
import { useRouter } from "next/navigation";

function SearchInput({ search }: { search?: string }) {
  const router = useRouter();
  const initialRender = useRef(true);

  const [text, setText] = useState(search);
  const [query] = useDebounce(text, 100);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    if (!query) {
      router.push(`/seller/products`);
    } else {
      router.push(`/seller/products?search=${query}`);
    }
  }, [query, router]);

  return (
    <>
      <div className="relative">
        <CiSearch className="absolute top-2 left-2 mt-[2px] text-gray-900 font-extrabold" />
        <Input
          placeholder="Search products..."
          className="pl-8 border-black"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
    </>
  );
}

export default SearchInput;
