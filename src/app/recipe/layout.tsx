"use client";

import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { pageVariants } from "@/utils/animations";
import Header from "@/components/Header";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push("/auth");
  }, [isAuthenticated, router]);

  useEffect(() => {
    const t = setTimeout(() => window.scrollTo(0, 0), 0);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-col w-full">
        <AnimatePresence mode="wait">
          {isAuthenticated && (
            <Header userName={user?.full_name} onLogout={logout} />
          )}
          <motion.main
            key={pathname}
            initial="initial"
            animate="enter"
            exit="exit"
            variants={pageVariants}
            className="flex-1"
          >
            {isAuthenticated ? children : null}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MainLayout;
