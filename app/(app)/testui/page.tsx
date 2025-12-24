"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";

export interface Project {
  id: string;
  title: string;
  year: string;
  category: string;
  imageUrl: string;
  description: string;
}

export enum ProjectCategory {
  Editorial = "EDITORIAL",
  Commercial = "COMMERCIAL",
  ArtDirection = "ART DIRECTION",
  Digital = "DIGITAL",
}

export const PROJECTS: Project[] = [
  {
    id: "1",
    title: "SYMPHONY OF LIGHT",
    year: "2024",
    category: "EDITORIAL",
    imageUrl: "https://picsum.photos/seed/p1/1200/1600",
    description: "An exploration of shadow and light in urban landscapes.",
  },
  {
    id: "2",
    title: "MONOCHROME VOID",
    year: "2023",
    category: "ART DIRECTION",
    imageUrl: "https://picsum.photos/seed/p2/1600/1200",
    description: "Visual identity for the conceptual exhibition 'Void'.",
  },
  {
    id: "3",
    title: "KINETIC ARCHIVE",
    year: "2024",
    category: "DIGITAL",
    imageUrl: "https://picsum.photos/seed/p3/1200/1600",
    description: "Interactive archival system for contemporary art.",
  },
  {
    id: "4",
    title: "THE SILENT FRAME",
    year: "2023",
    category: "COMMERCIAL",
    imageUrl: "https://picsum.photos/seed/p4/1600/900",
    description: "Global campaign for luxury timepiece brand.",
  },
  {
    id: "5",
    title: "REDACTED BEAUTY",
    year: "2022",
    category: "EDITORIAL",
    imageUrl: "https://picsum.photos/seed/p5/1200/1600",
    description: "Fashion editorial exploring obscured identities.",
  },
  {
    id: "6",
    title: "URBAN WHISPER",
    year: "2024",
    category: "COMMERCIAL",
    imageUrl: "https://picsum.photos/seed/p6/1600/1200",
    description: "Short film series documenting the rhythm of Tokyo.",
  },
];

function ExhibitionView() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const isTransitioning = useRef(false);
  const touchStartY = useRef<number | null>(null);

  const nextProject = () => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setDirection(1);
    setIndex((prev) => (prev + 1) % PROJECTS.length);
    setTimeout(() => {
      isTransitioning.current = false;
    }, 1000);
  };

  const prevProject = () => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setDirection(-1);
    setIndex((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length);
    setTimeout(() => {
      isTransitioning.current = false;
    }, 1000);
  };
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) > 30) {
      if (e.deltaY > 0) {
        nextProject();
      } else {
        prevProject();
      }
    }
  };
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;
    const swipeThreshold = 50;

    if (Math.abs(deltaY) > swipeThreshold) {
      if (deltaY > 0) {
        nextProject();
      } else {
        prevProject();
      }
    }
    touchStartY.current = null;
  };
  const project = PROJECTS[index];

  // Variants for bi-directional transitions
  // Added Variants type and explicit tuple casting for cubic-bezier ease to fix TS incompatibility
  const variants: Variants = {
    initial: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      y: direction > 0 ? "-100%" : "100%",
      opacity: 0,
      skewX: direction > 0 ? 30 : -30,
      skewY: direction > 0 ? -15 : 15,
      scale: 0.8,
    }),
    center: {
      x: 0,
      y: 0,
      opacity: 1,
      skewX: 0,
      skewY: 0,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      y: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      skewX: direction > 0 ? -30 : 30,
      skewY: direction > 0 ? 15 : -15,
      scale: 1.2,
      transition: {
        duration: 0.8,
        ease: [0.7, 0, 0.84, 0] as [number, number, number, number],
      },
    }),
  };

  return (
    <section
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="h-screen max-w-full w-full flex items-center justify-center relative overflow-hidden bg-[#050505] "
    >
      {/* Dynamic Background with Color Shift */}
      <motion.div
        key={`bg-${index}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0 bg-gradient-to-br from-neutral-800 to-black pointer-events-none"
      />

      <div className="z-10 w-full max-w-7xl px-8 md:px-24">
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={project.id}
            custom={direction}
            variants={variants}
            initial="initial"
            animate="center"
            exit="exit"
            className="relative will-change-transform"
          >
            {/* Labeling Overlay */}
            <div className="absolute -top-16 md:-top-32 left-0 z-20 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <span className="text-[10px] tracking-[0.8em] opacity-40 font-bold block mb-4">
                  VOL. 0{index + 1}
                </span>
                <h2 className="serif text-5xl md:text-[10rem] italic font-light tracking-tighter leading-none select-none">
                  {project.title}
                </h2>
              </motion.div>
            </div>

            {/* Main Glitch Canvas */}
            <div className="relative group w-full aspect-[16/9] md:h-[55vh] md:aspect-auto overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] bg-zinc-900">
              {/* Collision Glitch Layers - Only visible during transitions */}
              <motion.div
                className="absolute inset-0 z-30 pointer-events-none opacity-0 group-hover:opacity-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                <div className="absolute inset-0 mix-blend-color-dodge opacity-50 flex items-center justify-center">
                  <Image
                    alt="kdk"
                    src={project.imageUrl}
                    className="w-full h-full object-cover scale-110 translate-x-4 grayscale invert"
                    fill
                  />
                </div>
                <div className="absolute inset-0 mix-blend-hard-light opacity-50 flex items-center justify-center">
                  <Image
                    alt="dfv"
                    src={project.imageUrl}
                    className="w-full h-full object-cover scale-105 -translate-x-8 hue-rotate-180"
                    fill
                  />
                </div>
              </motion.div>

              {/* Main Image */}
              <motion.div
                className="w-full h-full"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 2 }}
              >
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-[1.5s]"
                />

                {/* Scroll-induced "Collision" layers */}
                <motion.div
                  className="absolute inset-0 z-20 mix-blend-screen opacity-0"
                  animate={
                    direction !== 0
                      ? {
                          opacity: [0, 0.4, 0],
                          x: [-20, 20, 0],
                          scale: [1, 1.1, 1],
                        }
                      : { opacity: 0 }
                  }
                  transition={{ duration: 0.4 }}
                >
                  <Image
                    src={project.imageUrl}
                    alt="kdk"
                    fill
                    className="absolute inset-0 w-full h-full object-cover opacity-50 -translate-x-4 hue-rotate-90"
                  />
                  <Image
                    src={project.imageUrl}
                    alt="dfv"
                    fill
                    className="absolute inset-0 w-full h-full object-cover opacity-50 translate-x-4 -hue-rotate-90"
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* Metadata Footer */}
            <div className="mt-12 flex flex-col md:flex-row justify-between items-start md:items-end border-t border-white/5 pt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="max-w-md"
              >
                <p className="text-xs md:text-base text-neutral-500 font-light leading-relaxed italic">
                  {project.description}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 md:mt-0 flex gap-12 text-right"
              >
                <div>
                  <span className="text-[9px] tracking-[0.4em] opacity-30 block mb-2 uppercase">
                    Category
                  </span>
                  <span className="text-[10px] tracking-[0.2em] font-bold">{project.category}</span>
                </div>
                <div>
                  <span className="text-[9px] tracking-[0.4em] opacity-30 block mb-2 uppercase">
                    Year
                  </span>
                  <span className="text-[10px] tracking-[0.2em] font-bold">{project.year}</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Indicator */}
      <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 flex flex-col gap-6 items-center">
        <span className="text-[9px] tracking-[0.3em] font-bold rotate-90 opacity-20 origin-left translate-y-12 whitespace-nowrap">
          VIEWING WORK
        </span>
        <div className="w-[1px] h-24 md:h-32 bg-white/10 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full bg-white"
            animate={{ height: `${((index + 1) / PROJECTS.length) * 100}%` }}
            transition={{ duration: 0.8, ease: "circOut" }}
          />
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div className="fixed right-6 md:right-12 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50">
        {PROJECTS.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              setIndex(i);
            }}
            className="relative w-6 h-6 md:w-8 md:h-8  flex items-center justify-center group"
          >
            <span
              className={` tabular-nums transition-all duration-500 ${
                index === i
                  ? "opacity-100 scale-125"
                  : "opacity-20 scale-100 group-hover:opacity-40"
              }`}
            >
              {i + 1}
            </span>
            {index === i && (
              <motion.div
                layoutId="active-dot"
                className="absolute inset-0 border border-white/20 rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}

export default ExhibitionView;
