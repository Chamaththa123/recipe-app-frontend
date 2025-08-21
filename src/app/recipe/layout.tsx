"use client";

import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  console.log(user);
  React.useEffect(() => {
    if (!isAuthenticated) router.push("/auth");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex">
        <div className="w-full">
          <header className=" text-gray-600 flex justify-between items-center shadow-md">
            <Image
              src="/images/logo.jpg"
              alt="brand"
              width={130}
              height={50}
              className="object-contain"
            />
            <Link
                href="/recipe/favourite"
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Favorites
              </Link>
            <span>Welcome, {user?.full_name}</span>
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
              Logout
            </button>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
