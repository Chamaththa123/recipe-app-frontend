"use client";

import React, { useEffect, useState } from "react";
import axiosClient from "@/api/axiosClient";
import { motion } from "framer-motion";
import { textVariants } from "@/utils/animations";

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  //fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await axiosClient("recipes/categories");
        setCategories(res);

        if (res && res.length > 0) {
          const firstCategory = res[0].strCategory;
          setSelectedCategory(firstCategory);
          handleCategorySelect(firstCategory);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  //handel selected category
  const handleClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    handleCategorySelect(categoryName);
  };

  return (
    <>
      <div className="w-[200px] h-screen shadow-md md:block hidden">
        <div className="mx-3 mt-5">
          <h3 className="font-bold mb-6 text-[20px] text-gray-600 ">
            Categories
          </h3>

          {loading && (
            <div className="flex flex-col items-center justify-center py-8 ">
              <motion.div
                className="w-12 h-12 border-4 border-gray-300 border-t-[#FF795E] rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  ease: "linear",
                }}
              />
              <motion.p
                className="mt-4 text-gray-500"
                variants={textVariants}
                initial="hidden"
                animate="visible"
              ></motion.p>
            </div>
          )}

          <div className="space-y-2 text-black">
            {categories.map((cat) => (
              <p
                key={cat.idCategory}
                onClick={() => handleClick(cat.strCategory)}
                className={`px-2 py-3 text-[14px] rounded-md cursor-pointer 
                ${
                  selectedCategory === cat.strCategory
                    ? "bg-[#7c7772] text-white font-semibold"
                    : "bg-gray-100 hover:bg-[#70665d] hover:text-white"
                }`}
              >
                {cat.strCategory}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="block md:hidden">
        <div className="mx-3 mt-5">
          <h3 className="font-bold mb-6 text-[20px] text-gray-600 ">
            Categories
          </h3>

          {loading && (
            <div className="flex flex-col items-center justify-center py-8 ">
              <motion.div
                className="w-12 h-12 border-4 border-gray-300 border-t-[#FF795E] rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  ease: "linear",
                }}
              />
              <motion.p
                className="mt-4 text-gray-500"
                variants={textVariants}
                initial="hidden"
                animate="visible"
              ></motion.p>
            </div>
          )}

          <div className="space-y-2 text-black flex flex-wrap gap-4">
            {categories.map((cat) => (
              <p
                key={cat.idCategory}
                onClick={() => handleClick(cat.strCategory)}
                className={`px-2 py-3 text-[14px] rounded-md cursor-pointer flex justify-center items-center 
                ${
                  selectedCategory === cat.strCategory
                    ? "bg-[#7c7772] text-white font-semibold"
                    : "bg-gray-100 hover:bg-[#70665d] hover:text-white"
                }`}
              >
                {cat.strCategory}
              </p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
