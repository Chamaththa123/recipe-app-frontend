"use client";

import React, { useEffect, useState } from "react";
import axiosClient from "@/api/axiosClient";
import Image from "next/image";
import { motion } from "framer-motion";
import { FavouriteIcon, NextIcon, PreviousIcon, ViewIcon } from "@/utils/icons";
import { cardVariants, gridVariants } from "@/utils/animations";
import { toast, ToastContainer } from "react-toastify";
import LoadingGrid from "@/components/LoadingGrid";
import RecipeModal from "@/components/RecipeModal";

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

const ITEMS_PER_PAGE = 10;

const FavouritePage: React.FC = () => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const res = await axiosClient("favorites");
        setFavorites(res || []);
      } catch (error) {
        toast.error("Error fetching recipes");
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (idMeal: string) => {
    try {
      await axiosClient(`favorites/${idMeal}`, {
        method: "DELETE",
      });
      setFavorites((prev) => prev.filter((fav) => fav.idMeal !== idMeal));
      toast.success(`Recipe removed from favorites.`);
    } catch (err: unknown) {
      toast.error("Error removing favorite Recipes");
    }
  };

  const openModal = (idMeal: string) => {
    setSelectedRecipeId(idMeal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRecipeId(null);
    setIsModalOpen(false);
  };

  const totalPages = Math.ceil(favorites.length / ITEMS_PER_PAGE);
  const currentFavorites = favorites.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="md:p-8 p-4">
      {loading ? (
        <LoadingGrid columns={5} count={10} />
      ) : currentFavorites.length > 0 ? (
        <>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-5 gap-6"
            variants={gridVariants}
            initial="hidden"
            animate="show"
            key={`favorites-page-${currentPage}`}
          >
            {currentFavorites.map((recipe) => (
              <motion.div
                key={recipe.idMeal}
                variants={cardVariants}
                whileHover={{
                  y: -6,
                  boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
                }}
                whileTap={{ scale: 0.98 }}
                className="relative border border-gray-200 rounded-lg shadow bg-white overflow-hidden"
              >
                <Image
                  src={recipe.strMealThumb || "/images/fallback.webp"}
                  alt={recipe.strMeal}
                  width={200}
                  height={120}
                  className="rounded-t-lg object-cover h-[150px] w-full"
                />
                <div className="flex justify-between px-2 py-1">
                  <p className="text-[14px] font-semibold text-gray-600">
                    {recipe.strMeal}
                  </p>
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <motion.button
                      onClick={() => openModal(recipe.idMeal)}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="View recipe"
                      className="bg-white text-xs px-1 py-1 rounded hover:bg-[#ffedd5] cursor-pointer"
                    >
                      <ViewIcon />
                    </motion.button>
                    <motion.button
                      onClick={() => handleRemoveFavorite(recipe.idMeal)}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Remove from favorites"
                      className="bg-[#FF795E] text-white text-xs px-1 py-1 rounded hover:bg-[#ff8d76] cursor-pointer"
                    >
                      <FavouriteIcon />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <div className="flex justify-center items-center mt-6 space-x-3">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className=" text-gray-500 hover:text-gray-800 p-2 rounded bg-[#FF795E] cursor-pointer"
            >
              <PreviousIcon />
            </button>
            <span className="text-[14px] text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className=" text-gray-500 hover:text-gray-800 p-2 rounded bg-[#FF795E] cursor-pointer"
            >
              <NextIcon />
            </button>
          </div>
        </>
      ) : (
        <motion.p
          className="text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No recipes found.
        </motion.p>
      )}

      {isModalOpen && selectedRecipeId && (
        <RecipeModal
          recipeId={selectedRecipeId}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default FavouritePage;
