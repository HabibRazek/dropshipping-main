import React from 'react';
import { Button } from '../ui/button';
import { FaArrowRight } from "react-icons/fa";
import Link from 'next/link';

const SubscriptionForm = () => (
  <div>
    <div className="w-full max-w-sm mx-auto mt-6 border border-gray-900 rounded-full dark:border-gray-100">
      <form className="flex flex-col md:flex-row">
        <input
          type="email"
          placeholder="Enter your email address"
          className="flex-1 h-10 px-4 py-2 m-1 text-gray-700 placeholder-gray-400 bg-transparent border-none appearance-none dark:text-gray-200 focus:outline-none focus:placeholder-transparent focus:ring-0"
        />
        <Link href="/auth/register" className='hidden sm:flex'>
          <Button variant='custom' className='rounded-full text-white bg-black h-10 px-4 py-2 m-1 transition duration-300 ease-in-out'>
            Join Us <FaArrowRight className='ml-2' />
          </Button>
        </Link>
      </form>
    </div>
    <div className='mt-2'>
      <Link href="/auth/register" className='sm:hidden'>
        <Button variant='custom' className='rounded-full text-white bg-black h-10 px-4 py-2 m-1 transition duration-300 ease-in-out'>
          Join Us <FaArrowRight className='ml-2' />
        </Button>
      </Link>
    </div>
  </div>
);

export const Subscribe = () => (
  <div className="bg-gradient-to-r from-emerald-50 via-transparent to-transparent w-full shadow-md px-6 py-10 mx-auto mt-4 text-center">
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-white lg:text-4xl">
        Streamline Your Dropshipping Business with Us
      </h1>
      <p className="mt-6 text-gray-500 dark:text-gray-300">
        Join our platform to access seamless local payment options, efficient inventory management, reliable shipping partners, and a user-friendly interface designed to help your business thrive.
      </p>
      <SubscriptionForm />
    </div>
    <div className="max-w-screen-xl mx-auto mt-20">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5">
        {/* todo: add partners here  */}
      </div>
    </div>
  </div>
);
