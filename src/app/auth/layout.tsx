"use client";

import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { pageVariants } from "@/utils/animations";

const GuestLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Redirect to dashboard if the user is already authenticated
  React.useEffect(() => {
    if (isAuthenticated) router.push("/recipe/dashboard");
  }, [isAuthenticated, router]);

  // Scroll to top whenever the pathname changes
  useEffect(() => {
    const t = setTimeout(() => window.scrollTo(0, 0), 0);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <motion.main
          key={pathname}
          initial="initial"
          animate="enter"
          exit="exit"
          variants={pageVariants}
          className="flex-1"
        >
          {children}
        </motion.main>
      </div>
    </AnimatePresence>
  );
};

export default GuestLayout;
