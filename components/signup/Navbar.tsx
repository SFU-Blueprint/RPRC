'use client';

import React from 'react';
import Link from 'next/link';
import { inter } from '@/app/fonts';

export function Navbar() {
  return (
    <nav
      className={`bg-[#383533] text-white ${inter.className}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Navigation Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 xl:gap-10">
            <Link
              href="/"
              className="text-[14px] lg:text-[15px] xl:text-[16px] font-medium hover:text-[#90cd5f] transition-colors"
            >
              HOME
            </Link>

            <button className="flex items-center gap-1 text-[14px] lg:text-[15px] xl:text-[16px] font-medium hover:text-[#90cd5f] transition-colors">
              ABOUT
              <svg
                className="w-3 h-3 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <Link
              href="/events"
              className="text-[14px] lg:text-[15px] xl:text-[16px] font-medium hover:text-[#90cd5f] transition-colors"
            >
              EVENTS
            </Link>

            <button className="flex items-center gap-1 text-[14px] lg:text-[15px] xl:text-[16px] font-medium hover:text-[#90cd5f] transition-colors">
              POLICY AREAS
              <svg
                className="w-3 h-3 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <button className="flex items-center gap-1 text-[14px] lg:text-[15px] xl:text-[16px] font-medium hover:text-[#90cd5f] transition-colors">
              RESOURCES
              <svg
                className="w-3 h-3 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <Link
              href="/contact"
              className="text-[14px] lg:text-[15px] xl:text-[16px] font-medium hover:text-[#90cd5f] transition-colors"
            >
              CONTACT
            </Link>
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          <button
            className="md:hidden text-white"
            aria-label="Open menu"
            onClick={() => {
              // TODO: Add mobile menu functionality
              console.log('Mobile menu clicked');
            }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Right Side - Action Buttons */}
          <div className="flex items-center gap-3 md:gap-4">
            <Link
              href="/membership"
              className="px-4 md:px-5 lg:px-6 py-2 md:py-2.5 
                border-2 border-[#90cd5f] 
                text-[#90cd5f] 
                text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px]
                font-semibold 
                rounded-lg 
                hover:bg-[#90cd5f] hover:text-[#383533] 
                transition-colors"
            >
              JOIN US
            </Link>

            <Link
              href="/donate"
              className="px-4 md:px-5 lg:px-6 py-2 md:py-2.5 
                bg-[#90cd5f] 
                text-[#383533] 
                text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px]
                font-semibold 
                rounded-lg 
                hover:bg-[#7ab84f] 
                transition-colors"
            >
              DONATE
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
