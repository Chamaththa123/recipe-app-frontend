"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FavouriteIcon } from "@/utils/icons";

interface HeaderProps {
  userName?: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ userName, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="text-gray-600 flex justify-between items-center shadow-md px-4 py-2 relative">
      <Link href="/recipe/dashboard" className=" cursor-pointer">
        <Image
          src="/images/logo.jpg"
          alt="brand"
          width={130}
          height={50}
          className="object-contain"
        />
      </Link>

      <div className="flex items-center space-x-4">
        <div className="md:flex md:text-left text-end items-center gap-1">
          <span className="md:text-[20px] font-bold">Welcome </span> {userName}
        </div>
        <Link
          href="/recipe/favourite"
          className="bg-[#FF795E] text-white text-xs px-1 py-1 rounded hover:bg-[#ff8d76] cursor-pointer"
        >
          <FavouriteIcon />
        </Link>

        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setDropdownOpen((prev) => !prev)}>
            <Image
              src="/images/user.png"
              alt="user"
              width={45}
              height={45}
              className="object-contain rounded-full border border-gray-300 cursor-pointer"
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-xl h-10 rounded-md z-50">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  onLogout();
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
