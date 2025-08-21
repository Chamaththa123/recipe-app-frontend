"use client";

import React, { useEffect, useState } from "react";
import axiosClient, { ApiError } from "@/api/axiosClient";

interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryDescription: string;
}

interface CategoryProps {
  handleCategorySelect: (name: string) => void;
}

const Sidebar: React.FC<CategoryProps> = ({ handleCategorySelect }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await axiosClient("recipes/categories");
        setCategories(res);
      } catch (err: unknown) {
  const error = err as ApiError<{ error?: string }>;
  console.log(error)
  // toast.error(error.data?.error ?? "Registration failed");
} finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="w-[200px] h-screen shadow-md">
      
      <div className="mx-3 mt-5">
        <h3 className="font-bold mb-6 text-[20px] text-gray-600 ">
          Categories
        </h3>

        {loading && <p>Loading...</p>}

        <div className="space-y-2 text-black">
          {categories.map((cat, index) => (
            <p
              key={index}
              onClick={() => handleCategorySelect(cat.strCategory)}
              className="hover:bg-[#70665d] hover:text-[#ffffff] bg-gray-100 px-2 py-3 text-[14px] rounded-md cursor-pointer"
            >
              {cat.strCategory}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
