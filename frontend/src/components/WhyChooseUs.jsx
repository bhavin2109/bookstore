import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const WhyChooseUs = () => {
  const features = [
    {
      icon: "📚",
      title: "Vast Collection",
      description:
        "Access to over 10,000+ books across 1000+ categories from 200+ renowned authors and 50+ publishers.",
    },
    {
      icon: "⚡",
      title: "Fast Delivery",
      description:
        "Get your books delivered within 2-3 business days with our express shipping service.",
    },
    {
      icon: "💰",
      title: "Best Prices",
      description:
        "Competitive pricing with regular discounts and special offers on bestsellers and new arrivals.",
    },
    {
      icon: "🔒",
      title: "Secure Payment",
      description:
        "100% secure payment gateway with multiple payment options for your convenience.",
    },
    {
      icon: "📱",
      title: "Easy Returns",
      description:
        "Hassle-free 7-day return policy. Not satisfied? Get a full refund, no questions asked.",
    },
    {
      icon: "🎁",
      title: "Loyalty Rewards",
      description:
        "Earn points on every purchase and redeem them for exciting discounts on future orders.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
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
    <section className="bg-slate-900 py-16 lg:py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tight mb-4">
            Why Choose <span className="text-emerald-400">Us</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Discover what makes us the preferred choice for book lovers
            everywhere
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-slate-950 border border-white/10 rounded-xl p-6 lg:p-8 shadow-xl hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-300"
            >
              {/* Icon */}
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                {feature.description}
              </p>

              {/* Shine Effect - Subtle in dark mode */}
              <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full pointer-events-none rounded-xl"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
