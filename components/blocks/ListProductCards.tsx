import { TProduct } from "@/schema/Product";
import { Link } from "lucide-react";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const ListProductCards = (productCards: TProduct[]) => {
  return (
    <div>
      <section className="relative z-10 py-32 px-8 md:px-24 ">
        <div className="text-xl md:text-4xl p-2 m-2 font-bold underline">Just Now Came</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-16 gap-y-32 ">
          {productCards.map((item, idx) => (
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
                  (idx + 2) % 10,
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
    </div>
  );
};

export default ListProductCards;
