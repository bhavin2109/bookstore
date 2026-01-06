import React from "react";
import { motion } from "framer-motion";
import { Lock, Eye, Share2, Shield, Cookie, Mail, FileKey } from "lucide-react";

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "1. Information Collection",
      icon: <FileKey className="w-8 h-8 text-emerald-400" />,
      content:
        "We collect information you provide directly to us when you register, purchase a product, or communicate with us. This includes contact details and payment info.",
    },
    {
      title: "2. Use of Information",
      icon: <Eye className="w-8 h-8 text-emerald-400" />,
      content:
        "We use your data to operate, maintain, and provide the Service, process orders, and communicate with you about promotions and updates.",
    },
    {
      title: "3. Information Sharing",
      icon: <Share2 className="w-8 h-8 text-emerald-400" />,
      content:
        "We do not share your personal information with third parties except as necessary to provide the Service (e.g., shipping, payments) or as required by law.",
    },
    {
      title: "4. Data Security",
      icon: <Shield className="w-8 h-8 text-emerald-400" />,
      content:
        "We implement robust security measures to protect your personal information. While we match industry standards, no method is 100% secure.",
    },
    {
      title: "5. Cookies",
      icon: <Cookie className="w-8 h-8 text-emerald-400" />,
      content:
        "We use cookies to improve your experience. You can control cookie preferences through your browser settings.",
    },
    {
      title: "6. Contact Us",
      icon: <Mail className="w-8 h-8 text-emerald-400" />,
      content: (
        <span>
          Questions about this policy? Contact us at{" "}
          <a
            href="mailto:privacy@nerdyenough.com"
            className="text-emerald-400 hover:text-emerald-300 underline font-medium"
          >
            privacy@nerdyenough.com
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
            <Lock className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6 tracking-tight"
          >
            Privacy{" "}
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
            Your privacy matters. Learn how we collect, use, and protect your
            data.
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

export default PrivacyPolicy;
