"use client";

import React, { useState } from "react";
import Login from "../../components/auth/login";
import Register from "../../components/auth/register";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { tabVariants } from "@/utils/animations";

const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="md:w-[500px] w-full bg-white p-6 mx-4 rounded-xl shadow-lg">
        <div className="flex gap-3 items-center">
          <Image
            src="/images/logo.jpg"
            alt="brand"
            width={180}
            height={50}
            className="object-contain"
          />
          <h2 className="text-gray-600 md:text-[30px] text-[20px] font-bold">
            Recipe App
          </h2>
        </div>
        <div className="flex mb-6 ">
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === "login"
                ? "border-b-2 border-[#FF795E] font-bold text-[#FF795E] cursor-pointer"
                : "text-gray-600 cursor-pointer"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === "register"
                ? "border-b-2 border-[#FF795E] font-bold text-[#FF795E] cursor-pointer"
                : "text-gray-600 cursor-pointer"
            }`}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </div>

        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            {activeTab === "login" && (
              <motion.div
                key="login"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <Login />
              </motion.div>
            )}
            {activeTab === "register" && (
              <motion.div
                key="register"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <Register />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
