import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { toast } from "react-toastify";
import { clearCart } from "../../store/cartSlice";
import orderService from "../services/orderServices";

import OrderSuccessAnimation from "../components/OrderSuccessAnimation";

const Checkout = () => {
  const { items: cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(() => {
    const defaults = {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    };
    // Pre-fill user data if available (lazy initialization)
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return {
          ...defaults,
          name: user.username || "",
          email: user.email || "",
        };
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
    return defaults;
  });
  const [showAnimation, setShowAnimation] = useState(false);
  const [isVerified] = useState(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.isVerified === true;
      } catch {
        return true;
      }
    }
    return true;
  });

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  useEffect(() => {
    if (cartItems.length === 0 && !showAnimation) {
      toast.info("Your cart is empty. Redirecting to store.");
      navigate("/books");
    }
  }, [cartItems, navigate, showAnimation]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!window.Razorpay) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      // Check user verification
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (!user.isVerified) {
          toast.error("Please verify your email to place an order.");
          // Optional: Redirect to profile or show verification modal
          // For now, just toast is enough as per requirement "should give verify your email option in profile page"
          // But let's be helpful and offer a redirect via toast or just let them go to profile manually?
          // Requirement says "give option to verify your email option in profile page" - implying they go there.
          // Let's force navigation to profile for better UX? Or just alert.
          // "and to order something user should be verified"

          // Let's redirect to profile after a short delay or just toast. Toast is safer.
          setTimeout(() => navigate("/profile"), 2000);
          return;
        }
      }

      // 1. Create Order on Backend
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item.id,
          title: item.title,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.zip,
          country: formData.country,
          phone: formData.phone,
        },
        paymentMethod: "Razorpay",
        itemsPrice: total,
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: total,
      };

      const createdOrder = await orderService.createOrder(orderData);
      // console.log("Order Created:", createdOrder);

      const RAZORPAY_KEY = "rzp_test_RwZ8MWEM2Bc67U";

      const options = {
        key: RAZORPAY_KEY,
        amount: Math.round(createdOrder.totalPrice * 100),
        currency: "INR",
        name: "Nerdy Enough",
        description: `Order #${createdOrder._id}`,
        order_id: "", // If generating Razorpay Order ID on backend, pass it here. For now, standard checkout.
        handler: async function (response) {
          // Show animation IMMEDIATELY upon payment success callback
          setShowAnimation(true);

          try {
            // 2. Pay Order on Backend
            await orderService.payOrder(createdOrder._id, {
              id: response.razorpay_payment_id,
              status: "COMPLETED",
              update_time: new Date().toISOString(),
              email_address: formData.email,
            });

            // dispatch(clearCart()); // Moved to animation completion
            // toast.success("Payment successful! Order placed."); // Moved to animation
          } catch (error) {
            console.error(error);
            // If backend fails, we might want to alert/log, but animation is already showing success.
            // Ideally we'd have a way to 'pause' animation or show error, but for "immediate" feedback requirement, this is the tradeoff.
            toast.error(
              "Payment recorded failed on server, but payment was successful."
            );
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#10b981",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        toast.error(response.error.description);
      });
      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create order");
    }
  };

  if (cartItems.length === 0 && !showAnimation) return null;

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      {showAnimation && (
        <OrderSuccessAnimation
          onComplete={() => {
            dispatch(clearCart());
            navigate("/my-orders");
          }}
        />
      )}
      <div className="max-w-7xl mx-auto">
        <Motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-white mb-8 border-l-4 border-emerald-500 pl-4"
        >
          Checkout
        </Motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Shipping Form */}
          <Motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-slate-950 border border-white/5 rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 text-sm">
                  1
                </span>
                Shipping Details
              </h2>

              <form
                id="checkout-form"
                onSubmit={handlePayment}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 text-base text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 text-base text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 text-base text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 text-base text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="123 Main St, Apt 4B"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 text-base text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      State / Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 text-base text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="zip"
                      required
                      value={formData.zip}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 text-base text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 text-base text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              </form>
            </div>
          </Motion.div>

          {/* Order Summary */}
          <Motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-slate-950 border border-white/5 rounded-2xl p-6 shadow-xl lg:sticky lg:top-24">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 text-sm">
                  2
                </span>
                Order Summary
              </h2>

              <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 items-center bg-slate-900/50 p-3 rounded-lg border border-white/5"
                  >
                    <div className="w-16 h-20 bg-slate-800 rounded overflow-hidden shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="grow">
                      <h4 className="text-white font-bold text-sm line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-slate-400 text-xs mt-1">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-emerald-400 font-bold text-sm">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Shipping</span>
                  <span className="text-emerald-400">Free</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-white pt-2">
                  <span>Total</span>
                  <span className="text-emerald-400">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                className={`w-full mt-8 py-4 font-bold rounded-xl shadow-lg transition-all duration-200 uppercase tracking-wide group ${
                  isVerified
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
                    : "bg-slate-700 text-slate-400 cursor-not-allowed"
                }`}
                disabled={!isVerified}
              >
                {isVerified ? "Place Order" : "Verify Email to Order"}
              </button>

              <p className="text-xs text-slate-500 text-center mt-4 flex items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
                Secure Payment Processor
              </p>
            </div>
          </Motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
