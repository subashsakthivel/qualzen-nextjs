import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import DataClientAPI from "@/util/client/data-client-api";
import Link from "next/link";
import { TProduct } from "@/schema/Product";
import { TCategory } from "@/schema/Category";
import { TOffer } from "@/schema/Offer";

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

const AUDIENCE = [
  {
    name: "Men",
    img: "/#",
  },
  {
    name: "Women",
    img: "/#",
  },
  {
    name: "Unisex",
    img: "/#",
  },
  {
    name: "Boys",
    img: "/#",
  },
  {
    name: "Girls",
    img: "/#",
  },
  {
    name: "Kids",
    img: "/#",
  },
];

export const LandingPageScrollView = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [featuredProducts, setFeaturedProducts] = React.useState<TProduct[]>([]);
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [offers, setOffers] = useState<TOffer[]>([]);

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

  useEffect(() => {
    const response = async () =>
      await DataClientAPI.getData({
        modelName: "product",
        operation: "GET_DATA_MANY",
        request: {
          filter: { feature_location: "featured-product" },
          options: { limit: 8, sort: { updatedAt: -1 } },
        },
      });
    const categoriesResponse = async () =>
      await DataClientAPI.getData({
        modelName: "category",
        operation: "GET_DATA_MANY",
        request: {
          filter: { img: { exists: true } },
        },
      });
    const offerResponse = async () =>
      await DataClientAPI.getData({
        modelName: "offer",
        operation: "GET_DATA_MANY",
        request: { filter: { endDateTime: { exists: true, lte: new Date() } } },
      });
    response().then((data) => {
      if (data && Array.isArray(data)) setFeaturedProducts(data);
    });
    categoriesResponse().then((data) => {
      if (data && Array.isArray(data)) setCategories(data);
    });
    offerResponse().then((data) => {
      if (data && Array.isArray(data)) setOffers(data);
    });
  }, []);

  return (
    <div ref={containerRef} className="relative bg-[#050505]">
      <section className="relative z-10 px-8 md:px-24 ">
        <div>
          <h2 className="serif text-3xl md:text-8xl italic leading-none w-full p-5">
            Ongoing Factory Outlet
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-16 gap-y-32 ">
          {featuredProducts.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1, delay: idx * 0.1 }}
              className="relative group cursor-none"
            >
              <div className="relative overflow-hidden aspect-square bg-neutral-900 border border-white/5 shadow-2xl">
                <div className="overflow-hidden group w-full h-full">
                  <Image
                    src={"/products/" + item._id}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div
                className={`absolute -bottom-${Math.floor((idx + 3) % 10)} left-${Math.floor(
                  (idx + 2) % 10
                )} z-10 backdrop-blur-sm  p-1 rounded `}
              >
                <span className="serif text-2xl md:text-4xl font-bold tracking-tight">
                  {item.name}
                </span>
              </div>

              <div className="absolute -top-4 -left-4 z-0 text-[10vw] font-bold opacity-[0.03] select-none pointer-events-none uppercase">
                {String(idx + 1).padStart(2, "0")}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      {/* Immersive Sticky Background */}
      <motion.div
        style={{ opacity: bgOpacity, scale: bgScale }}
        className="fixed inset-0 z-0 pointer-events-none"
      >
        <Image
          src="https://i.pinimg.com/1200x/dd/68/88/dd68888c8c4880f35ad7f26eddac8d1e.jpg"
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
            Begining of EndGame
          </span>
          <h2 className="serif text-5xl md:text-8xl italic leading-none mb-12">
            Built brands silently. Now making noise.
          </h2>
          <p className="serif text-xl md:text-2xl text-neutral-400 italic font-light leading-relaxed">
            “Not another fashion brand. Relax, your closet will survive.” 😏
          </p>
        </motion.div>
      </section>

      {/* Part 2: 3D Grid Section */}
      {featuredProducts && (
        <section className="relative z-10 py-32 px-8 md:px-24 ">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-16 gap-y-32 ">
            {featuredProducts.map((item, idx) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1, delay: idx * 0.1 }}
                className="relative group cursor-none"
              >
                <div className="relative overflow-hidden aspect-square bg-neutral-900 border border-white/5 shadow-2xl">
                  <div className="overflow-hidden group w-full h-full">
                    <Link href={"/products/" + item._id}>
                      <Image
                        src={item.images[0] || "/placeholder.svg"}
                        alt={item.name}
                        fill // Use fill for responsive containers
                        className="object-cover"
                      />
                    </Link>
                  </div>
                </div>

                <div
                  className={`absolute -bottom-${Math.floor((idx + 3) % 10)} left-${Math.floor(
                    (idx + 2) % 10
                  )} z-10 bg-black/60 backdrop-blur-sm  p-1 rounded `}
                >
                  <span className="serif text-2xl md:text-4xl font-bold tracking-tight">
                    {item.name}
                  </span>
                </div>

                <div className="absolute -top-4 -left-4 z-0 text-[10vw] font-bold opacity-[0.03] select-none pointer-events-none uppercase">
                  {String(idx + 1).padStart(2, "0")}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Part 2.1 : Grid Section for Collections Audiance*/}
      <section className="relative z-10 py-32 px-8 md:px-24 ">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-16 gap-y-32 ">
          {AUDIENCE.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1, delay: idx * 0.1 }}
              className="relative group cursor-none"
            >
              <div className="relative overflow-hidden aspect-square bg-neutral-900 border border-white/5 shadow-2xl">
                <div className="overflow-hidden group w-full h-full">
                  <Link href={"/explore/audience-" + item.name}>
                    <Image
                      src={item.img || "/placeholder.svg"}
                      alt={item.name}
                      fill // Use fill for responsive containers
                      className="object-cover"
                    />
                  </Link>
                </div>
              </div>

              <div
                className={`absolute -bottom-${Math.floor((idx + 3) % 10)} left-${Math.floor(
                  (idx + 2) % 10
                )} z-10 bg-black/60 backdrop-blur-sm  p-1 rounded `}
              >
                <span className="serif text-2xl md:text-4xl font-bold tracking-tight">
                  {item.name}
                </span>
              </div>

              <div className="absolute -top-4 -left-4 z-0 text-[10vw] font-bold opacity-[0.03] select-none pointer-events-none uppercase">
                {String(idx + 1).padStart(2, "0")}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Part 2.2 : Grid Section for Collections Category*/}
      <section className="relative z-10 py-32 px-8 md:px-24 ">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-16 gap-y-32 ">
          {categories.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1, delay: idx * 0.1 }}
              className="relative group cursor-none"
            >
              <div className="relative overflow-hidden aspect-square bg-neutral-900 border border-white/5 shadow-2xl">
                <div className="overflow-hidden group w-full h-full">
                  <Link href={"/explore/audience-" + item.name}>
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill // Use fill for responsive containers
                      className="object-cover"
                    />
                  </Link>
                </div>
              </div>

              <div
                className={`absolute -bottom-${Math.floor((idx + 3) % 10)} left-${Math.floor(
                  (idx + 2) % 10
                )} z-10 bg-black/60 backdrop-blur-sm  p-1 rounded `}
              >
                <span className="serif text-2xl md:text-4xl font-bold tracking-tight">
                  {item.name}
                </span>
              </div>

              <div className="absolute -top-4 -left-4 z-0 text-[10vw] font-bold opacity-[0.03] select-none pointer-events-none uppercase">
                {String(idx + 1).padStart(2, "0")}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Part 2.3 : Grid Section for Collections offers*/}
      <section className="relative z-10 py-32 px-8 md:px-24 ">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-16 gap-y-32 ">
          {categories.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1, delay: idx * 0.1 }}
              className="relative group cursor-none"
            >
              <div className="relative overflow-hidden aspect-square bg-neutral-900 border border-white/5 shadow-2xl">
                <div className="overflow-hidden group w-full h-full">
                  <Link href={"/explore/offer-" + item.name}>
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill // Use fill for responsive containers
                      className="object-cover"
                    />
                  </Link>
                </div>
              </div>

              <div
                className={`absolute -bottom-${Math.floor((idx + 3) % 10)} left-${Math.floor(
                  (idx + 2) % 10
                )} z-10 bg-black/60 backdrop-blur-sm  p-1 rounded `}
              >
                <span className="serif text-2xl md:text-4xl font-bold tracking-tight">
                  {item.name}
                </span>
              </div>

              <div className="absolute -top-4 -left-4 z-0 text-[10vw] font-bold opacity-[0.03] select-none pointer-events-none uppercase">
                {String(idx + 1).padStart(2, "0")}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Part 3: Titans Section */}
      <section className="relative z-10 min-h-screen py-32 px-8 md:px-24 mt-24 no-scrollbar overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-black/10 pb-12 sticky top-0">
            <div>
              <h2 className="serif text-5xl md:text-8xl italic leading-none border border-gray-300  border-opacity-60 w-full p-5">
                What them saying ?.
              </h2>
            </div>
            <div className="absolute  border border-gray-300 min-w-[50vh] rounded-full min-h-[50vh] -right-52 top-52 opacity-60 brightness-200 bg-white"></div>
          </div>

          <div className="flex gap-16 overflow-hidden">
            <Carousel>
              <CarouselContent>
                {TITANS.map((titan, idx) => (
                  <motion.div
                    key={titan.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: idx * 0.2 }}
                    className="flex flex-col justify-between h-full group"
                  >
                    <CarouselItem className="">
                      <div className="mb-12">
                        <div className="w-12 h-[1px] bg-black mb-8 group-hover:w-24 transition-all duration-700" />
                        <p className="serif text-2xl md:text-3xl italic font-light leading-relaxed mb-12">
                          {'"' + titan.quote + '"'}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-[10px] tracking-[0.5em] font-bold uppercase">
                          {titan.name}
                        </h4>
                        <span className="text-[9px] opacity-40">VERIFIED</span>
                      </div>
                    </CarouselItem>
                  </motion.div>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </motion.div>
      </section>

      {/* Final Call */}
      <section className="relative z-10 py-32 bg-black flex items-center justify-center">
        <motion.button whileHover={{ scale: 1.05 }} className="serif text-3xl md:text-5xl ">
          <div className="flex flex-wrap gap-5 m-2 justify-center">
            <div className="border border-white/20 px-12 py-6 hover:bg-white hover:text-black transition-all duration-500">
              Contact the Studio
            </div>
            <div className="grid grid-rows-2 grid-cols-1 gap-2 border border-white/20 px-12 py-6 hover:bg-white hover:text-black transition-all duration-500">
              <div>Dont You thing We should stay connected</div>
              <div className="border border-spacing-10 p-4">Subscribe Now</div>
            </div>
          </div>
        </motion.button>
      </section>
    </div>
  );
};
