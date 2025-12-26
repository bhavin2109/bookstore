import React, { useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from "framer-motion";

function AboutUs() {
  const specialties = [
    {
      title: "Expert Curation",
      description:
        "Handpicked selections from bestsellers to hidden gems across all genres",
      icon: "📚",
    },
    {
      title: "Author Events",
      description: "Regular meet-and-greets with renowned and emerging authors",
      icon: "🎤",
    },
    {
      title: "Book Clubs",
      description:
        "Community-driven discussions and literary engagement programs",
      icon: "👥",
    },
    {
      title: "Fast Shipping",
      description:
        "Quick and reliable delivery with easy returns within 30 days",
      icon: "🚚",
    },
    {
      title: "Competitive Prices",
      description:
        "Best prices in town with regular discounts and loyalty rewards",
      icon: "💰",
    },
    {
      title: "Independent Support",
      description: "Dedicated space for indie authors and small publishers",
      icon: "⭐",
    },
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-slate-900 text-white overflow-x-hidden max-w-full"
    >
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-linear-to-r from-slate-950 to-slate-900 py-20 text-white border-b border-white/5"
      >
        <div className="mx-auto max-w-5xl px-4 text-center space-y-4">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl font-bold leading-tight md:text-5xl"
          >
            About <span className="text-emerald-400">Our Bookstore</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg text-slate-400 md:text-xl"
          >
            Your gateway to worlds of imagination and knowledge.
          </motion.p>
        </div>
      </motion.section>

      <section ref={ref} className="mx-auto max-w-6xl px-4 py-16 space-y-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid gap-8 md:grid-cols-2"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            className="rounded-2xl bg-slate-950 p-8 shadow-xl border border-white/10 space-y-4"
          >
            <h2 className="text-2xl font-bold text-white">Our Story</h2>
            <p className="text-slate-400 leading-relaxed">
              Founded in 2010, our bookstore has been a beloved destination for
              book lovers of all ages. What started as a small shop has grown
              into a thriving community hub for literature enthusiasts.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Over the past decade, we&apos;ve served thousands of customers and
              built lasting relationships with our community. Our passion for
              books drives everything we do.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            className="rounded-2xl bg-slate-950 p-8 shadow-xl border border-white/10 space-y-4"
          >
            <h2 className="text-2xl font-bold text-white">Our Mission</h2>
            <p className="text-slate-400 leading-relaxed">
              To foster a love of reading and make quality books accessible to
              everyone while supporting independent authors and publishers. We
              believe every person deserves stories that inspire, educate, and
              entertain.
            </p>
            <p className="text-slate-400 leading-relaxed">
              We strive to create an inclusive space where all readers feel
              welcome and valued, regardless of their background or literary
              preferences.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-slate-800/50 p-10 border border-white/5"
        >
          <h2 className="text-center text-3xl font-bold text-white">
            Our Values
          </h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-10 grid gap-6 md:grid-cols-3"
          >
            {[
              { title: "Community First", color: "text-emerald-400" },
              { title: "Quality Selection", color: "text-emerald-400" },
              { title: "Accessibility", color: "text-emerald-400" },
            ].map((value) => (
              <motion.div
                key={value.title}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="rounded-2xl bg-slate-900 p-6 text-center shadow-lg border border-white/5"
              >
                <h3 className={`text-xl font-bold ${value.color}`}>
                  {value.title}
                </h3>
                <p className="mt-3 text-slate-400">
                  We believe in building strong connections and making
                  literature accessible with a carefully curated selection.
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <div className="space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-3xl font-bold text-white"
          >
            Why Choose Us
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {specialties.map((specialty, index) => (
              <motion.div
                key={specialty.title}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -10, rotateY: 5 }}
                className="group relative rounded-2xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-xl border border-white/10 transition hover:shadow-2xl hover:border-emerald-500/30"
              >
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-linear-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl"></div>
                <div className="relative z-10 w-24 h-24 bg-linear-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                      delay: index * 0.2,
                    }}
                    className="text-3xl"
                  >
                    {specialty.icon}
                  </motion.div>
                </div>
                <h3 className="mt-3 text-xl font-semibold text-emerald-400">
                  {specialty.title}
                </h3>
                <p className="mt-2 text-slate-300">{specialty.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-linear-to-r from-emerald-900/20 to-slate-900 p-10 border border-emerald-500/20"
        >
          <h2 className="text-center text-3xl font-bold text-white">
            Join Our Community
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-lg text-slate-400">
            Become part of a thriving community of book lovers. Attend our
            events, join book clubs, and discover your next favorite read with
            fellow enthusiasts.
          </p>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-8 grid gap-6 text-center md:grid-cols-3"
          >
            {[
              { stat: "10K+", label: "Active Members", color: "text-white" },
              { stat: "500+", label: "Books in Stock", color: "text-white" },
              { stat: "50+", label: "Events Per Year", color: "text-white" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                variants={itemVariants}
                whileHover={{ scale: 1.1, y: -5 }}
                className="rounded-2xl bg-slate-950 p-6 shadow-lg border border-white/10"
              >
                <motion.p
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                  className={`text-3xl font-bold ${item.color}`}
                >
                  {item.stat}
                </motion.p>
                <p className="text-slate-500">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-linear-to-r from-slate-950 to-slate-900 py-14 text-white border-t border-white/5"
      >
        <div className="mx-auto max-w-5xl px-4 text-center space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold"
          >
            Get in Touch
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400"
          >
            We&apos;d love to hear from you. Reach out with any questions or
            inquiries.
          </motion.p>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {[
              { text: "📧 Email: opbhavin21@gmail.com" },
              { text: "📞 Phone: 9316134234" },
              { text: "📍 Location: Gandhinagar" },
            ].map((contact, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="rounded-2xl bg-white/5 px-6 py-4 shadow-lg backdrop-blur border border-white/10"
              >
                <p className="text-lg font-semibold">{contact.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-slate-950 py-10 text-slate-500"
      >
        <div className="mx-auto max-w-5xl px-4 text-center">
          <p>
            &copy; 2024 Our Bookstore. All rights reserved. Dedicated to readers
            everywhere.
          </p>
        </div>
      </motion.section>
    </motion.div>
  );
}

export default AboutUs;
