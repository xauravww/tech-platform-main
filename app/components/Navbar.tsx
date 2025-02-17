'use client';

import { useState } from 'react';
import Link from 'next/link';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle the hamburger menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close the menu after clicking on a link
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gray-900 shadow-lg h-16 relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold text-white">
              TechPlatform
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:ml-6 sm:space-x-8 sm:justify-end">
            <Link
              href="/services"
              className="text-white inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-400 hover:text-gray-300"
            >
              Services
            </Link>
            <Link
              href="/products"
              className="text-white inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-400 hover:text-gray-300"
            >
              Products
            </Link>
            <Link
              href="/research"
              className="text-white inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-400 hover:text-gray-300"
            >
              Research
            </Link>
          </div>

          {/* Hamburger Icon for Small Screens */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay with Background */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={closeMenu}
        ></div>
      )}

      {/* Mobile Menu */}
      <div
        className={`${
          isMenuOpen ? 'block' : 'hidden'
        } sm:hidden bg-gray-800 text-white p-4 space-y-4 z-50 absolute top-16 left-0 w-full`}
      >
        <Link
          href="/services"
          className="block px-2 py-1 text-white hover:text-gray-300"
          onClick={closeMenu}
        >
          Services
        </Link>
        <Link
          href="/products"
          className="block px-2 py-1 text-white hover:text-gray-300"
          onClick={closeMenu}
        >
          Products
        </Link>
        <Link
          href="/research"
          className="block px-2 py-1 text-white hover:text-gray-300"
          onClick={closeMenu}
        >
          Research
        </Link>
      </div>
    </nav>
  );
};
