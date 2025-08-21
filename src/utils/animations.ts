import { Variants } from "framer-motion";

// Text fade up
export const textVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// Modal animation
export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 1 } },
};

// spring loader
export const spinnerAnimation = {
  animate: { rotate: 360 },
  transition: { repeat: Infinity, duration: 1, ease: "linear" },
};
