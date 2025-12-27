"use client";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import ExhibitionView from "./blocks/ComponentFligs";
import { LandingPageScrollView } from "./blocks/LandingPage";

const layout = () => {
  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key="exhibition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <ExhibitionView />
        </motion.div>
      </AnimatePresence>

      <LandingPageScrollView />
    </div>
  );
};

export default layout;
