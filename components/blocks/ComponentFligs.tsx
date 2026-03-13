"use client";
import React, { useState, useRef, useEffect, use } from "react";
import { motion, AnimatePresence, Variants, useScroll, useMotionValueEvent } from "framer-motion";
import Image from "next/image";
import DataClientAPI from "@/api/client/data-api";
import { TContent } from "@/schema/Content";
import { Button } from "../ui/button";
import Link from "next/link";

function ExhibitionView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const [banners, setBanners] = useState<TContent[]>([]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (banners.length <= 1) return;
    const rawIndex = latest * (banners.length - 1);
    const newIndex = Math.max(0, Math.min(Math.round(rawIndex), banners.length - 1));

    if (newIndex !== index) {
      setDirection(newIndex > index ? 1 : -1);
      setIndex(newIndex);
    }
  });
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
    <div
      ref={containerRef}
      style={{ height: banners.length > 0 ? `${banners.length * 100}vh` : '100vh' }}
      className="relative w-full"
    >
      {banners.length === 0 ? (
        <div className="h-screen w-full flex items-center justify-center text-center">Loading...</div>
      ) : (
        <div className="sticky top-0 h-screen overflow-hidden w-full bg-black">
          <section
            className="h-screen max-w-full w-full flex items-center justify-center relative overflow-hidden bg-opacity-70"
          >
            {/* Dynamic Background with Color Shift */}
            <div className="absolute top-3 left-4 underline text-[10px] tracking-[0.8em] opacity-40 font-bold ">
              <a href="/products" className="block mb-4 w-10 text-wrap">
                EXPLORE COLLECTIONS
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
                  <div className="relative group w-full aspect-[16/9] md:h-[80vh] md:aspect-auto overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] bg-zinc-900">
                    {/* Main Image */}
                    <motion.div
                      className="w-full h-full"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 2 }}
                    >
                      {banner.bgImg?.img && (
                        <>
                          <Image
                            src={banner.bgImg?.img}
                            alt={banner.title}
                            fill
                            className="w-full h-full object-cover  transition-all duration-[1.5s]"
                          />
                          {banner.clickAction?.action && <Link href={banner.clickAction?.action || "#"} className="bottom-4 right-4 px-2 py-1 md:py-4 font-bold text-secondary absolute bg-neutral-200 border border-neutral-200">{banner.clickAction?.text}</Link>}
                        </>
                      )}
                    </motion.div>
                  </div>

                  {/* Metadata Footer */}
                  <div className="mt-2 flex flex-col md:flex-row justify-between items-start md:items-end border-t border-white/5 pt-0">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="max-w-md"
                    >
                      <p className="text-2xl md:text-base text-neutral-200 font-light leading-relaxed italic">
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
                        <span className="text-[9px] tracking-[0.4em] opacity-30 block mb-2 uppercase">
                          {banner.groupName}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Sidebar Navigation */}
            <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (containerRef.current && banners.length > 1) {
                      const rect = containerRef.current.getBoundingClientRect();
                      const containerTop = window.scrollY + rect.top;
                      const containerScrollHeight = rect.height - window.innerHeight;
                      const targetScroll = containerTop + (i / (banners.length - 1)) * containerScrollHeight;
                      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                    }
                  }}
                  className="relative w-6 h-6 md:w-8 md:h-8  flex items-center justify-center group"
                >
                  <span
                    className={` tabular-nums transition-all duration-500 ${index === i
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
      )}
    </div>
  );
}

export default ExhibitionView;
