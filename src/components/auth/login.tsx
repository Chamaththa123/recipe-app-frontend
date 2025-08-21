"use client";

import React from "react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { ProcessingIcon } from "@/utils/icons";

//formdata structure
interface LoginFormData {
  email: string;
  password: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const initialFormData: LoginFormData = {
    email: "",
    password: "",
  };
  const { login } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});

  // handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  //validate user input
  const validate = (): boolean => {
    const newErrors: LoginErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      await login(formData.email, formData.password);
    } catch {
      toast.error("Login Fail");
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
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-[#e6e8ed] focus:outline-[#bdbdbd] rounded-lg px-3 py-2 min-w-[250px] text-[15px] w-full mt-2"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
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
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF795E] text-white py-2 rounded-lg hover:bg-[#ff8d76] cursor-pointer"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <ProcessingIcon />
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
