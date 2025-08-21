"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/sidebar";
import axiosClient, { ApiError } from "@/api/axiosClient";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { FavouriteIcon, ViewIcon } from "@/utils/icons";
import RecipeModal from "@/components/RecipeModal";

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

const DashboardPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  const handleCategorySelect = (name: string) => {

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

    const fetchFavorites = async () => {
      try {
        const res = await axiosClient("favorites");
        setFavorites(res || []);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };
    fetchFavorites();
  }, [selectedCategory]);

  useEffect(() => {}, []);

  const handleAddFavorite = async (recipe: Recipe) => {
    try {
       await axiosClient("favorites", {
        method: "POST",
        body: JSON.stringify(recipe),
      });
      setFavorites((prev) => [...prev, recipe]);
    } catch (err: unknown) {
    const error = err as ApiError<{ message?: string }>;
    console.error("Error adding favorite:", error.data?.message ?? error);
  }
  };

  const isFavorite = (idMeal: string) =>
    favorites.some((fav) => fav.idMeal === idMeal);

  const handleRemoveFavorite = async (idMeal: string) => {
    try {
      await axiosClient(`favorites/${idMeal}`, {
        method: "DELETE",
      });
      setFavorites((prev) => prev.filter((fav) => fav.idMeal !== idMeal));
    } catch (err: unknown) {
    const error = err as ApiError<{ message?: string }>;
    console.error("Error removing favorite:", error.data?.message ?? error);
  }
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
    }),
  };

  const openModal = (idMeal: string) => {
    setSelectedRecipeId(idMeal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRecipeId(null);
    setIsModalOpen(false);
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
                      className="relative border-[1px] border-gray-200 rounded-lg shadow bg-white"
                    >
                      <Image
                        src={recipe.strMealThumb || "/images/fallback.webp"}
                        alt={recipe.strMeal}
                        width={200}
                        height={120}
                        className="rounded-t-lg object-cover h-[150px] w-full"
                      />
                      <div className="flex justify-between px-2 py-1">
                        <p className="text-[14px] font-semibold ">
                          {recipe.strMeal}
                        </p>
                        <div className="absolute top-2 right-2">
                          <button
                              onClick={() => openModal(recipe.idMeal)}
                              className="bg-white mr-2 text-white text-xs px-1 py-1 rounded hover:bg-[#ff8d76] cursor-pointer"
                            >
                              <ViewIcon />
                            </button>
                          {isFavorite(recipe.idMeal) ? (
                            <button
                              onClick={() =>
                                handleRemoveFavorite(recipe.idMeal)
                              }
                              className="bg-[#FF795E] text-white text-xs px-1 py-1 rounded hover:bg-[#ff8d76] cursor-pointer"
                            >
                              <FavouriteIcon />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAddFavorite(recipe)}
                              className="bg-white text-white text-xs px-1 py-1 rounded hover:bg-[#ff8d76] cursor-pointer"
                            >
                              <FavouriteIcon />
                            </button>
                          )}
                        </div>
                      </div>
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
      {isModalOpen && selectedRecipeId && (
  <RecipeModal
    recipeId={selectedRecipeId}
    isOpen={isModalOpen}
    onClose={closeModal}
  />
)}
    </div>
  );
};

export default DashboardPage;
