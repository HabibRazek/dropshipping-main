"use client";

import Link from "next/link";
import { Button } from "./ui/button";

const Unauthorized = () => {
  return (
    <div className="flex flex-col justify-between h-screen">
      <div className="flex flex-col items-center justify-center flex-grow">
        {/* Background blobs adjusted to ensure they don't cause overflow */}
        <div className="absolute top-0 -z-10 w-full h-full overflow-hidden">
          <div className="bg-[#bdffad] absolute top-[-6rem] right-[5rem] h-[15rem] w-[31.25rem] rounded-full blur-[8rem] sm:w-[68.75rem] dark:bg-[#bdfcae]"></div>
          <div className="bg-[#b9cfff] absolute top-[-1rem] left-[-35rem] h-[15.25rem] w-[50rem] rounded-full blur-[7rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#c2c8ff]"></div>
        </div>

        <div className="z-10 text-center">
          <h1 className="text-7xl font-bold text-gray-800 sm:text-9xl dark:text-white">Unauthorized</h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">Sorry, access denied.</p>
          <p className="text-gray-600 dark:text-gray-400">Apologies, this area is off-limits.</p>
          <div className="mt-5">
            <Link href="/dashboard">
              <Button>Go back home</Button>
            </Link>
          </div>
        </div>
      </div>

      <footer className="w-full text-center py-5 bg-white dark:bg-black">
        <p className="text-sm text-gray-500">© All Rights Reserved. {new Date().getFullYear()}.</p>
      </footer>
    </div>
  );
};

export default Unauthorized;
