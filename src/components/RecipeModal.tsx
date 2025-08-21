"use client";

import React, { useEffect, useState } from "react";
import axiosClient, { ApiError } from "@/api/axiosClient";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { CloseIcon } from "@/utils/icons";
import { modalVariants, textVariants } from "@/utils/animations";

interface RecipeModalProps {
  recipeId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions?: string;
  strCategory?: string;
  strArea?: string;
  strTags?: string;
}

const RecipeModal: React.FC<RecipeModalProps> = ({
  recipeId,
  isOpen,
  onClose,
}) => {
  const [recipeDetails, setRecipeDetails] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !recipeId) return;

    const fetchRecipeDetails = async () => {
      try {
        setLoading(true);
        const res = await axiosClient(`recipes/details/${recipeId}`);
        setRecipeDetails(res || null);
      } catch (err: unknown) {
        const error = err as ApiError<{ message?: string }>;
        console.error(
          "Error fetching recipe details:",
          error.data?.message ?? error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [isOpen, recipeId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            onClick={onClose}
          />
          <motion.div
            key="modal"
            className="fixed inset-0 flex justify-center items-center z-50 p-4"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="bg-white rounded-lg p-6 w-[800px] relative shadow-lg">
              <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 p-1 rounded bg-gray-100 cursor-pointer"
              >
                <CloseIcon />
              </button>

              {loading ? (
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
              ) : recipeDetails ? (
                <div className="max-h-[80vh] overflow-y-auto">
                  <div className="md:flex block ">
                    <div className="md:w-[50%] w-full">
                      <motion.img
                        src={
                          recipeDetails.strMealThumb || "/images/fallback.webp"
                        }
                        alt={recipeDetails.strMeal}
                        className="w-full rounded-md mb-4"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <div className="md:w-[50%] w-full md:p-2">
                      <motion.h2
                        className="text-lg font-bold mb-4 md:text-center text-left text-gray-700"
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {recipeDetails.strMeal}
                      </motion.h2>

                      <motion.div
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-[14px] leading-6"
                      >
                        <div className="flex">
                          <div className="w-[150px]">Recipe Category</div>
                          <div>{recipeDetails.strCategory}</div>
                        </div>
                        <div className="flex">
                          <div className="w-[150px]">Tag</div>
                          <div>{recipeDetails.strTags || "-"}</div>
                        </div>

                        <div className="flex">
                          <div className="w-[150px]">Cuisine</div>
                          <div>{recipeDetails.strArea || "-"}</div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                  <motion.p
                    className="text-gray-600 text-[13px]"
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {recipeDetails.strInstructions ||
                      "No instructions available."}
                  </motion.p>
                </div>
              ) : (
                <motion.p
                  className="text-gray-500"
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                >
                  No details found for this recipe.
                </motion.p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RecipeModal;
