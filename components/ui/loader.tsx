"use client";

export const Loader = () => {
  return (
    <div
      className="animate-spin inline-block size-10 border-[3px] border-current border-t-transparent text-green-700 rounded-full dark:text-green-600"
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
