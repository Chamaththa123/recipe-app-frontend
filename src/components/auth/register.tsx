"use client";

import axiosClient, { ApiError } from "@/api/axiosClient";
import { ProcessingIcon } from "@/utils/icons";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//formdata structure
interface RegisterFormData {
  full_name: string;
  email: string;
  password: string;
}

interface RegisterErrors {
  full_name?: string;
  email?: string;
  password?: string;
}

const Register: React.FC = () => {
  const initialFormData: RegisterFormData = {
    full_name: "",
    email: "",
    password: "",
  };

  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);

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
    const newErrors: RegisterErrors = {};

    if (!formData.full_name) {
      newErrors.full_name = "Full name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!isPasswordValid(formData.password)) {
      newErrors.password = "Password does not meet all requirements";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const isPasswordValid = (password: string): boolean => {
    const rules = [
      password.length >= 6,
      /[A-Z]/.test(password),
      /\d/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ];
    return rules.every(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validate()) return;
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

  // Password requirements status
  const passwordChecks = [
    { label: "At least 6 characters", valid: formData.password.length >= 6 },
    {
      label: "At least 1 uppercase letter",
      valid: /[A-Z]/.test(formData.password),
    },
    { label: "At least 1 number", valid: /\d/.test(formData.password) },
    {
      label: "At least 1 special character",
      valid: /[^A-Za-z0-9]/.test(formData.password),
    },
  ];

  return (
    <div className="w-full px-5 ">
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
            className="border border-[#e6e8ed] focus:outline-[#bdbdbd] rounded-lg px-3 py-2 min-w-[250px] text-[15px] w-full mt-2"
          />
          {errors.full_name && (
            <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
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
            placeholder="Password"
            className="border border-[#e6e8ed] focus:outline-[#bdbdbd] rounded-lg px-3 py-2 min-w-[250px] text-[15px] w-full mt-2"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
          <ul className="mt-2 space-y-1 text-xs">
            {passwordChecks.map((check, idx) => (
              <li
                key={idx}
                className={check.valid ? "text-green-600" : "text-gray-500"}
              >
                {check.label}
              </li>
            ))}
          </ul>
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
            "Register"
          )}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Register;
