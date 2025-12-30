import React, { useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";

const OrderSuccessAnimation = ({ onComplete }) => {
  useEffect(() => {
    // Navigate away after animation completes
    const timer = setTimeout(() => {
      onComplete();
    }, 10000); // 10 seconds total duration

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.5 } },
  };

  const bookVariants = {
    hidden: { y: -100, opacity: 0, scale: 0.5 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 10,
        delay: 0.5,
      },
    },
    packed: {
      scale: 0,
      opacity: 0,
      y: 50,
      transition: { duration: 0.5, delay: 2 },
    },
  };

  const bagVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, delay: 1.5 },
    },
    packing: {
      scale: [1, 1.1, 1], // Pulse effect
      transition: { duration: 0.5, delay: 2 },
    },
    loaded: {
      x: 200, // Move to truck
      opacity: 0,
      scale: 0.5,
      transition: { duration: 0.8, delay: 3 },
    },
  };

  const truckVariants = {
    hidden: { x: "-100vw" },
    enter: {
      x: 0,
      transition: { type: "spring", stiffness: 50, damping: 15, delay: 0 },
    },
    depart: {
      x: "100vw",
      transition: { duration: 7, ease: "easeIn", delay: 1 }, // Slowed down more
    },
  };

  return (
    <AnimatePresence>
      <Motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="relative w-full max-w-lg h-64 flex items-center justify-center overflow-hidden">
          {/* 1. The Book */}
          <Motion.div
            className="absolute z-10"
            variants={bookVariants}
            initial="hidden"
            animate={["visible", "packed"]}
          >
            <div className="w-16 h-20 bg-emerald-500 rounded shadow-lg border-2 border-white/20 flex items-center justify-center">
              <span className="text-2xl">📖</span>
            </div>
          </Motion.div>

          {/* 2. The Bag */}
          <Motion.div
            className="absolute z-20"
            variants={bagVariants}
            initial="hidden"
            animate={["visible", "packing", "loaded"]}
          >
            <div className="text-6xl">👜</div>
          </Motion.div>

          {/* 3. The Truck */}
          <Motion.div
            className="absolute z-30"
            variants={truckVariants}
            initial="hidden"
            animate={["enter", "depart"]}
          >
            <div className="text-8xl transform scale-x-[-1] relative z-30">
              🚚
            </div>

            {/* Smoke Effect */}
            <Motion.div
              className="absolute bottom-2 left-[-20px] z-20 flex"
              variants={{
                hidden: { opacity: 0 },
                enter: { opacity: 0 },
                depart: { opacity: 1 },
              }}
            >
              {[...Array(3)].map((_, i) => (
                <Motion.div
                  key={i}
                  className="absolute bg-slate-400 rounded-full opacity-60"
                  style={{
                    width: 10 + i * 5,
                    height: 10 + i * 5,
                    left: i * -15,
                  }}
                  animate={{
                    x: [-10, -50],
                    y: [0, -20 - i * 10],
                    scale: [0.5, 2],
                    opacity: [0.6, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeOut",
                  }}
                />
              ))}
            </Motion.div>
          </Motion.div>

          {/* Success Text */}
          <Motion.div
            className="absolute bottom-10 text-white font-bold text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.1, duration: 0.3 } }}
            exit={{ opacity: 0 }}
          >
            Order Placed Successfully!
          </Motion.div>
        </div>
      </Motion.div>
    </AnimatePresence>
  );
};

export default OrderSuccessAnimation;
