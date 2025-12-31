import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../../store/cartSlice";

const Cart = () => {
  const { items: cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const total = calculateTotal();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4">
        <Motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white">Your Cart is Empty</h2>
          <p className="text-slate-400 max-w-md mx-auto">
            Looks like you haven't added any books yet. Explore our collection
            and find your next read!
          </p>
          <Link
            to="/books"
            className="inline-block px-8 py-3 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 uppercase tracking-wide"
          >
            Browse Books
          </Link>
        </Motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-white mb-8 border-l-4 border-emerald-500 pl-4"
        >
          Shopping Cart
        </Motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Grid */}
          <div className="lg:col-span-2 lg:h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <Motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-slate-950 border border-white/10 rounded-lg overflow-hidden group hover:border-emerald-500/50 transition-all duration-300 shadow-md hover:shadow-emerald-500/10 flex flex-col"
                  >
                    {/* Image Area - Vertical */}
                    <div className="relative w-full aspect-2/3 overflow-hidden bg-slate-800 border-b border-white/5">
                      <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent opacity-60 z-10" />
                      <img
                        src={
                          item.image || "https://via.placeholder.com/300x450"
                        }
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />

                      {/* Price Badge on Image */}
                      <div className="absolute top-2 right-2 z-20 bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full shadow-lg shadow-emerald-500/20 text-xs">
                        ₹{item.price}
                      </div>

                      {/* Remove Button Overlay (Top Left) */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(removeFromCart({ id: String(item.id) }));
                        }}
                        className="absolute top-2 left-2 z-30 w-7 h-7 flex items-center justify-center bg-red-500/20 hover:bg-red-500 text-red-100 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                        title="Remove Item"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-3.5 h-3.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Content Area */}
                    <div className="p-3 flex flex-col grow bg-slate-950">
                      <Link
                        to={`/books/${item.id}`}
                        className="block mb-1 group-hover:text-emerald-400 transition-colors"
                      >
                        <h3
                          className="text-sm font-bold text-white line-clamp-2 leading-snug"
                          title={item.title}
                        >
                          {item.title}
                        </h3>
                      </Link>

                      <div className="mt-auto pt-3">
                        {/* Quantity Controls Compact */}
                        <div className="flex items-center justify-between bg-slate-900 rounded-md p-1 border border-white/10">
                          <button
                            onClick={() =>
                              dispatch(
                                decreaseQuantity({ id: String(item.id) })
                              )
                            }
                            className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="font-bold text-white text-sm w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              dispatch(
                                increaseQuantity({ id: String(item.id) })
                              )
                            }
                            className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-center mt-2">
                          <span className="text-xs text-slate-500">
                            Total:{" "}
                          </span>
                          <span className="text-emerald-400 font-bold text-sm">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-slate-950 border border-white/5 rounded-2xl p-6 sticky top-24 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="text-white font-medium">₹{total}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Shipping</span>
                  <span className="text-emerald-400 font-medium">Free</span>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-white">Total</span>
                  <span className="text-2xl font-bold text-emerald-400">
                    ₹{total}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-200 uppercase tracking-wide flex items-center justify-center gap-2 group"
              >
                Proceed to Checkout
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </button>

              <p className="text-xs text-slate-500 text-center mt-4">
                Secure Checkout - SSL Encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
