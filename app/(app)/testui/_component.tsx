import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import Image from "next/image";

const TITANS = [
  {
    name: "Global Editorial",
    quote:
      "The vision provided was beyond our standard expectations. A true master of minimalist form.",
  },
  {
    name: "Vogue Tokyo",
    quote:
      "Capturing essence where others see void. Watanabe's work is the pinnacle of modern art direction.",
  },
  {
    name: "Luxury Brand X",
    quote:
      "A seamless transition from concept to execution. The visual language created is timeless.",
  },
];

const SCROLL_IMAGES = [
  { name: "For Sigma", url: "https://picsum.photos/seed/sigma/800/1000" },
  { name: "For Lolita", url: "https://picsum.photos/seed/lolita/800/1000" },
  { name: "For Shinchan", url: "https://picsum.photos/seed/shin/800/1000" },
  { name: "For Micle", url: "https://picsum.photos/seed/micle/800/1000" },
];

export const ScrollView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Background fade logic
  const bgOpacity = useTransform(smoothProgress, [0, 0.1, 0.4, 0.5], [0, 0.6, 0.6, 0]);
  const bgScale = useTransform(smoothProgress, [0, 0.5], [1.1, 1]);

  return (
    <div ref={containerRef} className="relative bg-[#050505]">
      {/* Immersive Sticky Background */}
      <motion.div
        style={{ opacity: bgOpacity, scale: bgScale }}
        className="fixed inset-0 z-0 pointer-events-none"
      >
        <Image
          src="https://picsum.photos/seed/atmosphere/1920/1080"
          className="w-full h-full object-cover grayscale brightness-[0.3]"
          fill
          alt="Atmosphere"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </motion.div>

      {/* Part 1: Intro Section */}
      <section className="relative z-10 min-h-screen flex flex-col justify-center px-8 md:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="max-w-3xl"
        >
          <span className="text-[10px] tracking-[0.6em] font-bold opacity-40 uppercase block mb-6">
            New Vision
          </span>
          <h2 className="serif text-5xl md:text-8xl italic leading-none mb-12">
            Beyond the Visible.
          </h2>
          <p className="serif text-xl md:text-2xl text-neutral-400 italic font-light leading-relaxed">
            In the quietest moments, structure emerges from the shadows. We invite you to scroll
            through the evolution of form.
          </p>
        </motion.div>
      </section>

      {/* Part 2: 3D Grid Section */}
      <section className="relative z-10 py-32 px-8 md:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-32">
          {SCROLL_IMAGES.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1, delay: idx * 0.1 }}
              className="relative group cursor-none"
            >
              <div className="relative overflow-hidden aspect-[2/2] bg-neutral-900 border border-white/5 shadow-2xl">
                <div className="overflow-hidden group w-full h-full">
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 1.5 }}
                    className="w-full h-full"
                  >
                    <Image
                      src={item.url}
                      alt={item.name}
                      fill // Use fill for responsive containers
                      sizes="(max-width: 768px) 100vw, 50vw" // Adjust based on your layout
                      className="object-cover grayscale brightness-75 group-hover:brightness-100 transition-all duration-1000"
                    />
                  </motion.div>
                </div>
              </div>

              {/* 3D-like Labeling */}
              <motion.div
                initial={{ x: 0 }}
                whileHover={{ x: 20, y: -10 }}
                className="absolute -bottom-6 -right-4 md:-right-8 z-20 pointer-events-none"
              >
                <div className="bg-white text-black px-6 py-4 shadow-[10px_10px_30px_rgba(0,0,0,0.5)] transform -rotate-2 group-hover:rotate-0 transition-transform duration-500">
                  <span className="serif text-2xl md:text-4xl italic font-bold tracking-tight">
                    {item.name}
                  </span>
                </div>
              </motion.div>

              <div className="absolute -top-4 -left-4 z-0 text-[10vw] font-bold opacity-[0.03] select-none pointer-events-none uppercase">
                {String(idx + 1).padStart(2, "0")}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Part 3: Titans Section */}
      <section className="relative z-10 min-h-screen py-32 px-8 md:px-24 bg-white text-black mt-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-black/10 pb-12">
            <div>
              <span className="text-[10px] tracking-[0.4em] font-bold opacity-40 uppercase block mb-4">
                Reviews
              </span>
              <h2 className="serif text-5xl md:text-8xl italic leading-none">
                Hear from our Titans.
              </h2>
            </div>
          </div>

          {/* Titans Grid / Animation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {TITANS.map((titan, idx) => (
              <motion.div
                key={titan.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                className="flex flex-col justify-between h-full group"
              >
                <div className="mb-12">
                  <div className="w-12 h-[1px] bg-black mb-8 group-hover:w-24 transition-all duration-700" />
                  <p className="serif text-2xl md:text-3xl italic font-light leading-relaxed mb-12">
                    {'"' + titan.quote + '"'}
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] tracking-[0.5em] font-bold uppercase">{titan.name}</h4>
                  <span className="text-[9px] opacity-40">VERIFIED PARTNER</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bulk Customer Animation Representation */}
          <div className="mt-40 overflow-hidden py-12 border-y border-black/5">
            <motion.div
              animate={{ x: [0, -1000] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="flex gap-24 whitespace-nowrap"
            >
              {[...Array(10)].map((_, i) => (
                <span key={i} className="serif text-[4vw] italic font-light opacity-10">
                  TRUSTED BY 500+ TITANS WORLDWIDE • ESTABLISHED 2024 • MINIMALIST EXCELLENCE •
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Final Call */}
      <section className="relative z-10 py-32 bg-black flex items-center justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="serif text-3xl md:text-5xl italic border border-white/20 px-12 py-6 hover:bg-white hover:text-black transition-all duration-500"
        >
          Contact the Studio
        </motion.button>
      </section>
    </div>
  );
};
