"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/sidebar";
import axiosClient from "@/api/axiosClient";
import Image from "next/image";
import { motion, useAnimation, Variants } from "framer-motion";

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

const DashboardPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const controls = useAnimation();
  const handleCategorySelect = (name: string) => {
    console.log("Selected Category ID:", name);
    setSelectedCategory(name);
  };

  useEffect(() => {
    if (!selectedCategory) return;

    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const res = await axiosClient(`recipes/${selectedCategory}`);
        setRecipes(res || []);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [selectedCategory]);

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
    }),
  };

  return (
    <div className="flex">
      <Sidebar handleCategorySelect={handleCategorySelect} />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        {selectedCategory ? (
          <>
            <p className="mb-4 text-gray-700">
              Selected Category:{" "}
              <span className="font-semibold">{selectedCategory}</span>
            </p>

            {loading ? (
              <p className="text-gray-500">Loading recipes...</p>
            ) : recipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <>
                  {recipes.map((recipe, index) => (
                    <motion.div
                      key={recipe.idMeal}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      variants={fadeUp}
                      className="border-[1px] border-gray-200 rounded-lg shadow bg-white"
                    >
                      <Image
                        src={recipe.strMealThumb || "/images/fallback.jpg"}
                        alt={recipe.strMeal}
                        width={200}
                        height={120}
                        className="rounded-t-lg object-cover h-[150px] w-full"
                      />
                      <p className="text-[14px] font-semibold px-2 py-1">
                        {recipe.strMeal}
                      </p>
                    </motion.div>
                  ))}
                </>
              </div>
            ) : (
              <p className="text-gray-500">No recipes found.</p>
            )}
          </>
        ) : (
          <p className="text-gray-500">
            Please select a category from the sidebar.
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
