"use client";

import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

const GuestLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const {isAuthenticated } = useAuth();
    const router = useRouter();
  
    React.useEffect(() => {
      if (isAuthenticated) router.push("/recipe/dashboard");
    }, [isAuthenticated, router]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <main>{children}</main>
    </div>
  );
};

export default GuestLayout;
