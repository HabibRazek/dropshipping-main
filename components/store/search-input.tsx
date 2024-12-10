"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPlusCircle } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";

export function InputWithButton({ search }: { search?: string }) {
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
      router.push(`/seller/stores`);
    } else {
      router.push(`/seller/stores?search=${query}`);
    }
  }, [query, router]);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="flex w-full items-center mt-5 mb-5">
      <Input
        type="text"
        placeholder="Search for a store"
        className="mr-4 bg-white/50 h-12"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button type="submit" className="h-12">
        <Link
          href="/seller/stores/new"
          className="flex flex-row justify-center items-center gap-x-[4px]"
        >
          <FaPlusCircle />
          Add New
        </Link>
      </Button>
    </div>
  );
}
