import React from 'react';
import { Button } from '../ui/button';
import { FaArrowRight } from "react-icons/fa";
import Link from 'next/link';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden before:content-[''] sm:mt-[-20px] mt-[-30px] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-full before:h-full before:bg-no-repeat before:bg-top before:-z-10  before:bg-[url('/bg-squared.svg')]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
        <div className="flex justify-center">

        </div>
        <div className="mt-5 max-w-3xl text-center mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white md:text-5xl lg:text-6xl  dark:hover:text-emerald-400 transition duration-300 ease-in-out">
            Everything you need to sell online all in one place

          </h1>
        </div>
        <div className="mt-5 max-w-3xl text-center mx-auto">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Manage inventory, track orders, and view real-time business insights — all in one place, so you can focus on building your business.
          </p>
        </div>
        <div className="flex justify-center gap-2 mt-8">
          <Link href="/auth/login">
            <Button variant='custom' className='rounded-full  text-gray-900 px-6 py-3  transition duration-300 ease-in-out'>
              Get Started <FaArrowRight className='ml-2' />
            </Button>
          </Link>

        </div>
        <div className="sm:w-3/12 mx-auto  w-7/12 mt-10  transition-transform duration-300 hover:scale-105">
          <Image
            src="/assets/img.svg"
            alt="landing"
            width={500}
            height={500}
          />
        </div>

      </div>
    </div>
  );
};

export default HeroSection;
