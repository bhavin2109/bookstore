import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How long does delivery take?",
      answer:
        "Standard delivery takes 3-5 business days. We also offer express delivery which takes 1-2 business days for an additional fee. You'll receive a tracking number once your order is shipped.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a hassle-free 7-day return policy. If you're not satisfied with your purchase, you can return the book in its original condition for a full refund. Simply contact our customer service team to initiate the return process.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Yes, we ship to over 50 countries worldwide. International shipping costs and delivery times vary by location. You can check the shipping cost and estimated delivery time at checkout.",
    },
    {
      question: "Are the books brand new or used?",
      answer:
        "All books in our collection are brand new unless specifically marked as 'Used' or 'Pre-owned'. We ensure all new books are in pristine condition with proper packaging to prevent damage during transit.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order is shipped, you'll receive an email with a tracking number and a link to track your package. You can also log into your account on our website to view your order status and tracking information.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-slate-900 py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tight mb-4">
            Frequently Asked <span className="text-emerald-400">Questions</span>
          </h2>
          <p className="text-slate-400 text-lg">
            Find answers to common questions about our services
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-slate-950 border border-white/10 rounded-xl overflow-hidden shadow-lg hover:border-emerald-500/30 transition-colors duration-300"
            >
              {/* Question Button */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left transition-colors duration-200"
              >
                <h3
                  className={`text-lg lg:text-xl font-bold pr-4 transition-colors ${
                    openIndex === index ? "text-emerald-400" : "text-white"
                  }`}
                >
                  {faq.question}
                </h3>

                {/* Toggle Icon */}
                <motion.div
                  animate={{ rotate: openIndex === index ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-bold text-xl transition-colors ${
                    openIndex === index
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  +
                </motion.div>
              </button>

              {/* Answer */}
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2 border-t border-white/5">
                      <p className="text-slate-400 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-slate-400 mb-4">Still have questions?</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-emerald-500 text-white font-bold rounded-lg shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all duration-200 uppercase tracking-wide"
          >
            Contact Support
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQs;
