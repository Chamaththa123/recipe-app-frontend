"use client";

import React, { useState } from "react";
import Login from "../../components/auth/login";
import Register from "../../components/auth/register";
import Image from "next/image";

const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-[500px] bg-white p-6 rounded-xl shadow-lg">
        <Image
                src="/images/logo.jpg"
                alt="brand"
                width={180}
                height={50}
                className="object-contain"
              />
        <div className="flex mb-6 ">
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === "login"
                ? "border-b-2 border-[#FF795E] font-bold text-[#FF795E]"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === "register"
                ? "border-b-2 border-[#FF795E] font-bold text-[#FF795E]"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </div>

        {activeTab === "login" ? <Login /> : <Register />}
      </div>
    </div>
  );
};

export default LoginPage;
