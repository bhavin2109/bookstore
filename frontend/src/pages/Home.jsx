import React, { useEffect, useRef, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { books } from "../data/books";

const Home = () => {
  const productsRef = useRef(null);
  const isProductsInView = useInView(productsRef, { once: true, amount: 0.1 });
  const productsControls = useAnimation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isProductsInView) {
      productsControls.start("visible");
    }
  }, [isProductsInView, productsControls]);

  // Books for hero carousel
  const heroBooks = books.slice(0, 6);

  // Auto-rotate through books with smooth transitions
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroBooks.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroBooks.length, isAutoPlaying]);

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

  // Show first 4 books on home page
  const featuredBooks = books.slice(0, 4);

  // Book spines background image
  const bookSpinesBg = "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800";

  // Get books for stack (show only 3 books behind the active one)
  const getStackedBooks = () => {
    const stack = [];
    const maxStackSize = 3; // Only 3 books in stack
    
    // Get books after the active one
    for (let i = 1; i <= maxStackSize; i++) {
      const index = (activeIndex + i) % heroBooks.length;
      stack.push({
        book: heroBooks[index],
        stackPosition: i - 1, // 0, 1, 2
        originalIndex: index,
      });
    }
    
    return stack;
  };

  const stackedBooks = getStackedBooks();

  const handleBookClick = (index) => {
    setIsAutoPlaying(false);
    setActiveIndex(index);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="relative -mt-16 bg-white pt-16 overflow-x-hidden max-w-full">
      {/* Hero Section - Split Layout */}
      <section className="relative h-[calc(100vh-4rem)] flex overflow-hidden">
        {/* Left Section - Welcome Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full lg:w-1/3 bg-black flex items-center justify-center p-8 lg:p-12"
        >
          {/* Blurred Book Spines Background */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm"
            style={{
              backgroundImage: `url(${bookSpinesBg})`,
            }}
          ></div>
          
          {/* Welcome Content */}
          <div className="relative z-10 max-w-md space-y-8 text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
            >
              Welcome to BookStore
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
              className="text-lg md:text-xl text-gray-300 leading-relaxed"
            >
              Get your favorite books from 50+ publishers, 200+ authors and 1000+ categories.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
            >
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-lg transition-all shadow-lg hover:shadow-xl"
                >
                  <span>Go to Collections</span>
                  <motion.svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <path
                      d="M7.5 15L12.5 10L7.5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Section - Main Book + Stacked Books */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative hidden lg:flex w-full lg:w-2/3 bg-gradient-to-br from-slate-900 via-slate-800 to-black overflow-visible"
        >
          {/* Blurred Book Spines Background */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 blur-md"
            style={{
              backgroundImage: `url(${bookSpinesBg})`,
            }}
          ></div>

          {/* Main Book + Stack Container */}
          <div 
            className="relative z-10 w-full h-full flex items-center justify-center pl-8 lg:pl-16" 
            style={{ perspective: '1500px', perspectiveOrigin: 'left center' }}
          >
            <div className="relative w-full max-w-5xl h-full flex items-center">
              {/* Main Book Display */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.9, x: -50, rotateY: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: 50, rotateY: 10 }}
                  transition={{ 
                    duration: 0.8, 
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  className="relative flex-shrink-0 z-30 cursor-pointer"
                  onClick={() => handleBookClick(activeIndex)}
                  whileHover={{ scale: 1.03, y: -5 }}
                  style={{ width: '320px' }}
                >
                  {/* Best Selling Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="absolute -top-4 left-4 z-20 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-xl"
                  >
                    Best Selling
                  </motion.div>

                  {/* Main Book Cover */}
                  <motion.div
                    className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-white/10"
                  >
                    <motion.img
                      src={heroBooks[activeIndex].image}
                      alt={heroBooks[activeIndex].title}
                      className="w-full h-auto object-cover"
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.8 }}
                    />
                    
                    {/* Book Info Overlay */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/85 to-transparent p-6"
                    >
                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-2xl md:text-3xl font-bold text-white mb-2"
                        style={{ fontFamily: 'serif' }}
                      >
                        {heroBooks[activeIndex].title}
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-sm text-gray-300 mb-1"
                      >
                        {heroBooks[activeIndex].description}
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="text-xs text-gray-400 uppercase tracking-wider"
                      >
                        BY {heroBooks[activeIndex].author.toUpperCase()}
                      </motion.p>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Stacked Books - 3 books with proper spacing */}
              <AnimatePresence>
                {stackedBooks.map(({ book, stackPosition, originalIndex }) => {
                  // Calculate transform values for stack effect with better spacing
                  const scale = 1 - (stackPosition * 0.1); // Each book 10% smaller
                  const translateX = 80 + (stackPosition * 70); // Better spacing: 80px initial + 70px per book
                  const translateZ = -stackPosition * 80; // Move back in 3D space
                  const opacity = 1 - (stackPosition * 0.12); // Fade as they go back
                  const rotateY = stackPosition * 1.5; // Slight rotation for depth

                  return (
                    <motion.div
                      key={`${originalIndex}-${activeIndex}`}
                      initial={{ 
                        opacity: 0, 
                        scale: 0.8, 
                        x: translateX + 100, 
                        z: -300,
                        rotateY: 15
                      }}
                      animate={{
                        opacity: opacity,
                        scale: scale,
                        x: translateX,
                        z: translateZ,
                        rotateY: rotateY,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.8,
                        x: translateX + 100,
                        z: -300,
                        rotateY: 15,
                      }}
                      transition={{
                        duration: 0.8,
                        delay: stackPosition * 0.15,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                      style={{
                        position: 'absolute',
                        left: 0,
                        transformStyle: 'preserve-3d',
                        cursor: 'pointer',
                        zIndex: 20 - stackPosition,
                      }}
                      className="origin-left"
                      onClick={() => handleBookClick(originalIndex)}
                      whileHover={{ 
                        scale: scale + 0.08,
                        z: translateZ + 30,
                        x: translateX - 5,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <div className="relative" style={{ width: '280px' }}>
                        {/* Best Selling Badge */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 + stackPosition * 0.15, type: "spring" }}
                          className="absolute -top-3 left-3 z-20 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xl"
                        >
                          Best Selling
                        </motion.div>

                        {/* Book Cover with enhanced styling */}
                        <motion.div
                          className="relative rounded-lg overflow-hidden shadow-2xl border border-white/5"
                          style={{
                            boxShadow: `0 ${10 + stackPosition * 5}px ${20 + stackPosition * 10}px rgba(0, 0, 0, ${0.5 + stackPosition * 0.1})`,
                          }}
                        >
                          <img
                            src={book.image}
                            alt={book.title}
                            className="w-full h-auto object-cover"
                            style={{ maxHeight: '400px' }}
                          />
                          
                          {/* Book Info Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/85 to-transparent p-4">
                            <h3 className="text-lg font-bold text-white mb-1 line-clamp-1" style={{ fontFamily: 'serif' }}>
                              {book.title}
                            </h3>
                            <p className="text-xs text-gray-300 line-clamp-1 mb-1">
                              {book.description}
                            </p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                              BY {book.author.toUpperCase()}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Pagination Dots */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
              {heroBooks.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleBookClick(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === activeIndex
                      ? 'w-8 bg-red-600'
                      : 'w-3 bg-white/50 hover:bg-white/70'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    width: index === activeIndex ? 32 : 12,
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Mobile Book Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative lg:hidden w-full bg-gradient-to-br from-slate-900 via-slate-800 to-black overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 blur-md"
            style={{
              backgroundImage: `url(${bookSpinesBg})`,
            }}
          ></div>
          <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
            <div className="relative w-full max-w-xs">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.9, x: 50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -50 }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                  <div className="absolute -top-4 left-4 z-20 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-md">
                    Best Selling
                  </div>
                  <img
                    src={heroBooks[activeIndex].image}
                    alt={heroBooks[activeIndex].title}
                    className="w-full h-auto object-cover rounded-lg shadow-2xl"
                  />
                </motion.div>
              </AnimatePresence>
              
              {/* Mobile Pagination */}
              <div className="flex gap-2 justify-center mt-4">
                {heroBooks.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleBookClick(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === activeIndex
                        ? 'w-6 bg-red-600'
                        : 'w-3 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-white py-20 overflow-x-hidden">
        <div className="mx-auto max-w-7xl px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-3 text-4xl font-bold text-slate-900 md:text-5xl">
              Featured Books
            </h2>
            <p className="text-lg text-slate-600">
              Handpicked titles for every kind of reader
            </p>
          </motion.div>

          <motion.div
            ref={productsRef}
            variants={containerVariants}
            initial="hidden"
            animate={productsControls}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {featuredBooks.map((book, index) => (
              <ProductCard
                key={book.id}
                book={book}
                index={index}
                variants={cardVariants}
              />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-lg bg-slate-900 px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-slate-800 hover:shadow-xl"
              >
                View All Books
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
