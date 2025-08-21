"use client";

import axiosClient, { ApiError } from "@/api/axiosClient";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface RegisterFormData {
  full_name: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const initialFormData: RegisterFormData = {
    full_name: "",
    email: "",
    password: "",
  };

  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axiosClient("users/register", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      console.log(res);
      toast.success(`${res}`);

      setFormData(initialFormData);
    } catch (err: unknown) {
  const error = err as ApiError<{ error?: string }>;
  toast.error(error.data?.error ?? "Registration failed");
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-5 ">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Full Name
          </label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="border border-[#e6e8ed] focus:outline-[#bdbdbd] rounded-lg px-3 py-2 min-w-[250px] text-[15px] w-full mt-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
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
            placeholder="Password"
            required
            className="border border-[#e6e8ed] focus:outline-[#bdbdbd] rounded-lg px-3 py-2 min-w-[250px] text-[15px] w-full mt-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FF795E] text-white py-2 rounded-lg hover:bg-[#ff8d76] cursor-pointer"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Register;
