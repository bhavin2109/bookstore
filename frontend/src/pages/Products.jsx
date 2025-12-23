import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { books } from "../data/books";

// Generate random values for floating particles (outside component to avoid linter issues)
const generateParticleData = () => {
  const random = () => Math.random();
  return Array.from({ length: 15 }, () => ({
    left: random() * 100,
    top: random() * 100,
    duration: 3 + random() * 2,
    delay: random() * 2,
  }));
};

const floatingParticlesData = generateParticleData();

const Products = () => {

  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white overflow-x-hidden max-w-full"
    >
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20"
      >
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 h-full w-full">
            {floatingParticlesData.map((particle, i) => (
              <motion.div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-white/20"
                style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  delay: particle.delay,
                }}
              />
            ))}
          </div>
        </div>
        <div className="relative mx-auto max-w-6xl px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-4 text-5xl font-bold text-white md:text-6xl"
          >
            Our Collection
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg text-slate-300 md:text-xl"
          >
            Handpicked titles for every kind of reader
          </motion.p>
        </div>
      </motion.section>

      {/* Books Grid */}
      <div className="mx-auto max-w-7xl px-4 py-16 w-full">
        <motion.div
          ref={containerRef}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {books.map((book, index) => (
            <ProductCard
              key={book.id}
              book={book}
              index={index}
              variants={cardVariants}
            />
          ))}
        </motion.div>
      </div>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-slate-50 py-16"
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { number: "10K+", label: "Books Available", icon: "📚" },
              { number: "5K+", label: "Happy Readers", icon: "😊" },
              { number: "500+", label: "New Arrivals", icon: "✨" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="rounded-xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200"
              >
                <div className="mb-4 text-4xl">{stat.icon}</div>
                <div className="mb-2 text-3xl font-bold text-slate-900">
                  {stat.number}
                </div>
                <div className="text-base font-medium text-slate-600">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Products;
