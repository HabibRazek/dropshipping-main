"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

const NoStore = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  
  return (
    <div className="">
      <p className="mb-4">No Store Yet</p>
      <Button className="bg-transparent shadow-none hover:cursor-pointer hover:bg-transparent p-1 hover:underline">
        <Link
          className="flex text-sky-700 items-center "
          href="/seller/stores/new"
        >
          New Store
          <FaArrowRight className="mx-2 text-sky-700" />
        </Link>
      </Button>
    </div>
  );
};

export default NoStore;
