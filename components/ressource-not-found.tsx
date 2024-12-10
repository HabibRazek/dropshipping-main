"use client";

import Link from "next/link";
import { Button } from "./ui/button";

const RessourceNotFound = ({ type } : { type: string}) => {
  return ( 
    <div className="flex flex-col justify-between h-screen">
      <div className="flex flex-col items-center justify-center flex-grow">
        {/* Background blobs adjusted to ensure they don't cause overflow */}
        <div className="absolute top-0 -z-10 w-full h-full overflow-hidden">
          <div className="bg-[#bdffad] absolute top-[-6rem] right-[5rem] h-[15rem] w-[31.25rem] rounded-full blur-[8rem] sm:w-[68.75rem] dark:bg-[#bdfcae]"></div>
          <div className="bg-[#b9cfff] absolute top-[-1rem] left-[-35rem] h-[15.25rem] w-[50rem] rounded-full blur-[7rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#c2c8ff]"></div>
        </div>

        <div className="z-10 text-center">
          <h1 className="text-7xl font-bold text-gray-800 sm:text-9xl dark:text-white">
            Resource Not Found
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            The page you are looking for could not be found.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            It may have been removed or does not exist.
          </p>

          <div className="mt-5">
            <Link href={type === "product" ? "/seller/products" : "/seller/stores"}>
              <Button>{type === "product" ? "Explore more" : "Back to Stores"}</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RessourceNotFound;
