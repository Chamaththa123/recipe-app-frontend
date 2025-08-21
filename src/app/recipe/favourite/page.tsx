"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/sidebar";
import axiosClient, { ApiError } from "@/api/axiosClient";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { FavouriteIcon } from "@/utils/icons";

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

const FavouritePage: React.FC = () => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const res = await axiosClient("favorites");
        setFavorites(res || []);
      } catch (error) {
        console.error("Error fetching favorites:", error);
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

  return (
    <div>
      {loading ? (
        <p className="text-gray-500">Loading recipes...</p>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <>
            {favorites.map((recipe, index) => (
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
                  <p className="text-[14px] font-semibold ">{recipe.strMeal}</p>
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => handleRemoveFavorite(recipe.idMeal)}
                      className="bg-[#FF795E] text-white text-xs px-1 py-1 rounded hover:bg-[#ff8d76] cursor-pointer"
                    >
                      <FavouriteIcon />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </>
        </div>
      ) : (
        <p className="text-gray-500">No recipes found.</p>
      )}
    </div>
  );
};

export default FavouritePage;
