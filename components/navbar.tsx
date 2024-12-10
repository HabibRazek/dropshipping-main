"use client";
import React, { useState } from 'react';
import { RiMenu3Line } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import Link from 'next/link';
import Image from 'next/image';

type NavLink = {
  name: string;
  href: string;
  current?: boolean;
};

type NavbarProps = {
  links: NavLink[];
};

export const Navbar = ({ links }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-transparent text-sm py-3 dark:bg-gray-800 dark:border-gray-700">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Global">
        <div className="flex justify-between items-center">
          <a className="flex-none text-xl font-semibold dark:text-white" href="#" aria-label="Home">
            <div className="flex items-center ">
              <Image
                src="/assets/logo.png"
                alt="Logo"
                width={200}
                height={100}
              />
            </div>
          </a>
          <div className="hidden sm:block sm:ml-6">
            <div className="flex space-x-4">
              {links.map((link) => (
                <Link legacyBehavior key={link.name} href={link.href} aria-current={link.current ? 'page' : undefined}>
                  <a className={`px-3 py-2 rounded-md text-sm font-medium ${link.current ? 'text-gray-900 border-emerald-500 rounded-none border-b-2' : 'text-gray-700 hover:text-gray-900'}`}>
                    {link.name}
                  </a>
                </Link>
              ))}
            </div>
          </div>
          <div className="sm:hidden">
            <button onClick={toggleMenu} className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:text-white" aria-expanded={isMenuOpen ? 'true' : 'false'}>
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <IoMdClose size={24} /> : <RiMenu3Line size={24} />}
            </button>
          </div>
        </div>
        <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
          {links.map((link) => (
            <Link legacyBehavior key={link.name} href={link.href} aria-current={link.current ? 'page' : undefined}>
              <a className={`block px-3 py-2 rounded-md text-base font-medium ${link.current ? 'text-gray-900 bg-transparent' : 'text-gray-700 hover:text-gray-900'}`}>
                {link.name}
              </a>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};
