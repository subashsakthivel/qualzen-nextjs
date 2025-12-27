"use client";
import React, { useState, useRef, useEffect, use } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import DataClientAPI from "@/util/client/data-client-api";
import { TContent } from "@/schema/Content";

function ExhibitionView() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const isTransitioning = useRef(false);
  const touchStartY = useRef<number | null>(null);
  const [banners, setBanners] = useState<TContent[]>([]);

  const nextProject = () => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setDirection(1);
    setIndex((prev) => (prev + 1) % banners.length);
    setTimeout(() => {
      isTransitioning.current = false;
    }, 1000);
  };

  const prevProject = () => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setDirection(-1);
    setIndex((prev) => (prev - 1 + banners.length) % banners.length);
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
  useEffect(() => {
    const response = async () =>
      await DataClientAPI.getData({
        modelName: "content",
        operation: "GET_DATA_MANY",
        request: { filter: { identifier: "home_page_banner" } },
      });
    response().then((res) => {
      if (res && Array.isArray(res)) {
        setBanners(res);
      }
    });
  }, []);
  const banner = banners[index];

  if (banners.length === 0) {
    return <div className="h-screen w-full text-center">Loading...</div>;
  }

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
    <div className="relative">
      <div className="sticky top-0">
        <section
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="h-screen max-w-full w-full flex items-center justify-center relative overflow-hidden  bg-opacity-70"
        >
          {/* Dynamic Background with Color Shift */}
          <div className="absolute top-3 left-4 underline text-[10px] tracking-[0.8em] opacity-40 font-bold ">
            <a href="/products" className="block mb-4">
              EXPLORE
            </a>
            <a href="/explore/men" className="block mb-4">
              MEN
            </a>
            <a href="/explore/women" className="block mb-4">
              WOMEN
            </a>
            <a href="/explore/kids" className="block mb-4">
              KIDS
            </a>
          </div>
          <div className="absolute top-3 right-4 underline text-[10px] tracking-[0.8em] opacity-40 font-bold ">
            <a href="/cart" className="block mb-4">
              CART
            </a>
            <a href="/profile" className="block mb-4">
              PROFILE
            </a>
            <a href="/contact" className="block mb-4">
              CONTACT US
            </a>
          </div>
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
                key={banner._id}
                custom={direction}
                variants={variants}
                initial="initial"
                animate="center"
                exit="exit"
                className="relative will-change-transform"
              >
                {/* Labeling Overlay */}
                <div className="absolute -top-12 md:-top-16 left-0 z-20 pointer-events-none">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  >
                    <span className="text-[10px] tracking-[0.8em] opacity-40 font-bold block mb-4">
                      VOL. {index + 1}
                    </span>
                    <h2 className="serif text-5xl md:text-[10rem] italic font-light tracking-tighter leading-none select-none ">
                      {banner.title}
                    </h2>
                  </motion.div>
                </div>

                {/* Main Glitch Canvas */}
                <div className="relative group w-full aspect-[16/9] md:h-[55vh] md:aspect-auto overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] bg-zinc-900">
                  {/* Main Image */}
                  <motion.div
                    className="w-full h-full"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 2 }}
                  >
                    {banner.bg_img?.img && (
                      <Image
                        src={banner.bg_img?.img}
                        alt={banner.title}
                        fill
                        className="w-full h-full object-cover  transition-all duration-[1.5s]"
                      />
                    )}
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
                      {banner.description}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-8 md:mt-0 flex gap-12 text-right"
                  >
                    <div>
                      <span className="text-[10px] tracking-[0.2em] font-bold">
                        {banner.click_action?.text}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] tracking-[0.4em] opacity-30 block mb-2 uppercase">
                        Dress Better Today
                      </span>
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
                animate={{ height: `${((index + 1) / banners.length) * 100}%` }}
                transition={{ duration: 0.8, ease: "circOut" }}
              />
            </div>
          </div>

          {/* Sidebar Navigation */}
          <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50">
            {banners.map((_, i) => (
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
      </div>
      <div
        className={`min-h-[${banners.length * 100}vh] max-h-[${banners.length * 100}vh] -z-10`}
      ></div>
    </div>
  );
}

export default ExhibitionView;
