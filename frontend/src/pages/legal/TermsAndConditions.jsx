import React from "react";
import { motion } from "framer-motion";
import {
  Scale,
  Users,
  ShieldCheck,
  AlertTriangle,
  Globe,
  FileText,
  Mail,
  Gavel,
} from "lucide-react";

const TermsAndConditions = () => {
  const sections = [
    {
      title: "1. Introduction",
      icon: <FileText className="w-8 h-8 text-emerald-400" />,
      content:
        "Welcome to Nerdy Enough. These Terms and Conditions govern your use of our website and services. By accessing or using our service, you agree to be bound by these terms.",
    },
    {
      title: "2. Accounts",
      icon: <Users className="w-8 h-8 text-emerald-400" />,
      content:
        "When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms.",
    },
    {
      title: "3. Intellectual Property",
      icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
      content:
        "The Service and its original content, features, and functionality are and will remain the exclusive property of Nerdy Enough and its licensors.",
    },
    {
      title: "4. Termination",
      icon: <AlertTriangle className="w-8 h-8 text-emerald-400" />,
      content:
        "We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.",
    },
    {
      title: "5. Governing Law",
      icon: <Gavel className="w-8 h-8 text-emerald-400" />,
      content:
        "These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.",
    },
    {
      title: "6. Changes",
      icon: <Scale className="w-8 h-8 text-emerald-400" />,
      content:
        "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice.",
    },
    {
      title: "7. Contact Us",
      icon: <Mail className="w-8 h-8 text-emerald-400" />,
      content: (
        <span>
          If you have any questions about these Terms, please contact us at{" "}
          <a
            href="mailto:support@nerdyenough.com"
            className="text-emerald-400 hover:text-emerald-300 underline font-medium"
          >
            support@nerdyenough.com
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
            <Scale className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6 tracking-tight"
          >
            Terms &{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-400">
              Conditions
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed"
          >
            A clear and transparent overview of the rules that govern our
            relationship with you.
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

export default TermsAndConditions;
