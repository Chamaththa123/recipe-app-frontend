"use client";

import React from "react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ToastContainer, toast } from "react-toastify";

interface LoginFormData {
  email: string;
  password: string;
}

const login = () => {
  const initialFormData: LoginFormData = {
    email: "",
    password: "",
  };
  const { login } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>(initialFormData);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="w-full p-5 ">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-[#e6e8ed] focus:outline-[#bdbdbd] rounded-lg px-3 py-2 min-w-[250px] text-[15px] w-full mt-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border border-[#e6e8ed] focus:outline-[#bdbdbd] rounded-lg px-3 py-2 min-w-[250px] text-[15px] w-full mt-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF795E] text-white py-2 rounded-lg hover:bg-[#ff8d76] cursor-pointer"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default login;
