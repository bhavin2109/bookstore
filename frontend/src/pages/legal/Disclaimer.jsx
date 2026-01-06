import React from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ExternalLink,
  Briefcase,
  Mail,
  Info,
  ShieldAlert,
} from "lucide-react";

const Disclaimer = () => {
  const sections = [
    {
      title: "1. General Information",
      icon: <Info className="w-8 h-8 text-emerald-400" />,
      content:
        "All information on the Site is provided in good faith. We make no representation or warranty of any kind, express or implied, regarding accuracy, validity, or reliability.",
    },
    {
      title: "2. External Links",
      icon: <ExternalLink className="w-8 h-8 text-emerald-400" />,
      content:
        "The Site may contain links to other websites. We do not investigate, monitor, or check such external links for accuracy or validity.",
    },
    {
      title: "3. Professional Disclaimer",
      icon: <Briefcase className="w-8 h-8 text-emerald-400" />,
      content:
        "The Site does not contain professional advice. Information is for educational purposes only and not a substitute for professional consultation.",
    },
    {
      title: "4. No Liability",
      icon: <ShieldAlert className="w-8 h-8 text-emerald-400" />,
      content:
        "Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site.",
    },
    {
      title: "5. Contact Us",
      icon: <Mail className="w-8 h-8 text-emerald-400" />,
      content: (
        <span>
          Questions regarding this disclaimer? Contact us at{" "}
          <a
            href="mailto:legal@nerdyenough.com"
            className="text-emerald-400 hover:text-emerald-300 underline font-medium"
          >
            legal@nerdyenough.com
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
            <AlertCircle className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6 tracking-tight"
          >
            Disclaimer
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Please read this disclaimer carefully before using our website.
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

export default Disclaimer;
