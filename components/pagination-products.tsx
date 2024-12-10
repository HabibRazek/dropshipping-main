"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link"; // Import Link from Next.js

function PaginationSection({ totalPages }: { totalPages: number }) {
  const [paginationArray, setPaginationArray] = useState<number[]>([]);

  const searchParams = useSearchParams();

  const currentPage =
    typeof searchParams.get("page") === "string"
      ? Number(searchParams.get("page"))
      : 1;

  const search =
    typeof searchParams.get("search") === "string"
      ? searchParams.get("search")
      : undefined;

  const categoryId =
    typeof searchParams.get("categoryId") === "string"
      ? searchParams.get("categoryId")
      : undefined;

  useEffect(() => {
    const generatePaginationArray = () => {
      const paginationArray = [];
      const maxPagesToShow = 3;

      let startPage = currentPage - Math.floor(maxPagesToShow / 2);
      startPage = Math.max(startPage, 1);

      let endPage = startPage + maxPagesToShow - 1;
      endPage = Math.min(endPage, totalPages);

      for (let i = startPage; i <= endPage; i++) {
        paginationArray.push(i);
      }

      setPaginationArray(paginationArray);
    };

    generatePaginationArray();
  }, [currentPage, totalPages]);

  const isPreviousDisabled = currentPage <= 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <nav className="flex justify-center items-center gap-x-1">
      <Link
        href={{
          pathname: "/seller/products",
          query: {
            ...(search ? { search } : {}),
            ...(categoryId ? { categoryId } : {}),
            page: currentPage > 1 ? currentPage - 1 : 1,
          },
        }}
        className={isPreviousDisabled ? "pointer-events-none opacity-50" : undefined}
      >
        <button
          type="button"
          className={`min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10`}
          disabled={isPreviousDisabled}
        >
          <svg className="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span>Previous</span>
        </button>
      </Link>
      <div className="flex items-center gap-x-1">
        {paginationArray.map((page) => (
          <Link
            key={page}
            href={{
              pathname: "/seller/products",
              query: {
                ...(search ? { search } : {}),
                ...(categoryId ? { categoryId } : {}),
                page,
              },
            }}
            className={`rounded-lg ${currentPage === page ? "bg-slate-950 text-white font-bold" : ""}`}
          >
            <button
              type="button"
              className={`min-h-[38px] min-w-[38px] flex justify-center items-center bg-gray-200 text-gray-800 py-2 px-3 text-sm rounded-lg focus:outline-none disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-600 dark:text-white dark:focus:bg-gray-500 ${currentPage === page ? "bg-slate-950 text-white font-bold" : ""
                }`}
            >
              {page}
            </button>
          </Link>
        ))}
      </div>
      <Link
        href={{
          pathname: "/seller/products",
          query: {
            ...(search ? { search } : {}),
            ...(categoryId ? { categoryId } : {}),
            page: currentPage < totalPages ? currentPage + 1 : totalPages,
          },
        }}
        className={isNextDisabled ? "pointer-events-none opacity-50" : undefined}

      >
        <button
          type="button"
          className={`min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10 ${isNextDisabled ? "opacity-50 pointer-events-none" : ""
            }`}
          disabled={isNextDisabled}
        >
          <span>Next</span>
          <svg className="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </Link>
    </nav>
  );
}

export default PaginationSection;
