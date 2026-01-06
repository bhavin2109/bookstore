import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  RotateCcw,
  CreditCard,
  Truck,
  AlertOctagon,
  Mail,
  PackageCheck,
} from "lucide-react";

const RefundPolicy = () => {
  const sections = [
    {
      title: "1. Returns",
      icon: <RotateCcw className="w-8 h-8 text-emerald-400" />,
      content:
        "You have 7 calendar days to return an item from the date you received it. Items must be unused, in the same condition as received, and in original packaging.",
    },
    {
      title: "2. Refunds",
      icon: <CreditCard className="w-8 h-8 text-emerald-400" />,
      content:
        "Once inspected, we will notify you of the status. If approved, a refund will be initiated to your original payment method immediately.",
    },
    {
      title: "3. Return Shipping",
      icon: <Truck className="w-8 h-8 text-emerald-400" />,
      content:
        "You are responsible for paying your own shipping costs for returns. Shipping costs are non-refundable and will be deducted from your refund.",
    },
    {
      title: "4. Damaged Items",
      icon: <AlertOctagon className="w-8 h-8 text-emerald-400" />,
      content:
        "Received a damaged product? Notify us immediately. We will arrange a free replacement or full refund at no extra cost to you.",
    },
    {
      title: "5. Process",
      icon: <PackageCheck className="w-8 h-8 text-emerald-400" />,
      content:
        "To initiate a return, simply contact our support team. We will guide you through the packaging and shipping process.",
    },
    {
      title: "6. Contact Us",
      icon: <Mail className="w-8 h-8 text-emerald-400" />,
      content: (
        <span>
          Questions on returns? Contact us at{" "}
          <a
            href="mailto:refunds@nerdyenough.com"
            className="text-emerald-400 hover:text-emerald-300 underline font-medium"
          >
            refunds@nerdyenough.com
          </a>
          .
        </span>
      ),
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-slate-900 py-24 overflow-hidden"
      >
        <div className="absolute inset-0 bg-linear-to-b from-emerald-500/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <RotateCcw className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6 tracking-tight"
          >
            Refund{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-400">
              Policy
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed"
          >
            We want you to be completely satisfied. Here is how we handle
            returns and refunds.
          </motion.p>
        </div>
      </motion.div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {sections.map((section, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group bg-slate-900 p-8 rounded-3xl border border-white/5 hover:border-emerald-500/30 shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full -mr-8 -mt-8 group-hover:bg-emerald-500/10 transition-colors" />

              <div className="mb-6 p-4 bg-slate-950 rounded-2xl w-fit border border-dashed border-white/10 group-hover:border-emerald-500/50 transition-colors">
                {section.icon}
              </div>

              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                {section.title}
              </h3>

              <div className="text-slate-400 leading-relaxed">
                {section.content}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-slate-500 text-sm italic">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RefundPolicy;
