import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const SellerOrders = () => {
  // TODO: Implement actual order fetching for seller
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-white/5">
        <span className="text-4xl">📦</span>
        <h3 className="text-xl font-bold text-white mt-4">Order Management</h3>
        <p className="text-slate-400 mt-2">Feature coming soon...</p>
      </div>
    </motion.div>
  );
};

export default SellerOrders;
