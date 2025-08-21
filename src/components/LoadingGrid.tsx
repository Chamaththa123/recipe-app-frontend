"use client";

import React from "react";
import { motion } from "framer-motion";

interface LoadingGridProps {
  columns?: number;
  count?: number;
}

const LoadingGrid: React.FC<LoadingGridProps> = ({ columns = 5, count = 10 }) => {
  return (
    <motion.div
      className={`grid grid-cols-1 md:grid-cols-${columns} gap-6`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      role="status"
      aria-label="Loading content"
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={`skeleton-${i}`}
          className="border border-gray-200 rounded-lg bg-white overflow-hidden"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <div className="h-[150px] w-full bg-gray-100 animate-pulse" />
          <div className="p-3">
            <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default LoadingGrid;
