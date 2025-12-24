"use client";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import ExhibitionView from "./page";
import { ScrollView } from "./_component";

const layout = () => {
  return (
    <div className="max-w-full">
      <div className="relative min-h-[650vh] max-h-[650vh]">
        <div className="sticky top-0 ">
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
        </div>
      </div>
      <ScrollView />
    </div>
  );
};

export default layout;
