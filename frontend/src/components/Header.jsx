import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "./SearchBar";

import { addToCart } from "../../store/cartSlice";
import { useDispatch } from "react-redux";

const Header = () => {
  const { items: cartItems } = useSelector((state) => state.cart);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Read auth from localStorage
  useEffect(() => {
    const readAuth = () => {
      const token = localStorage.getItem("token");
      let name = localStorage.getItem("userName");
      let role = "user";

      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (!name) name = user.name || user.email;
          if (user.role) role = user.role;
        } catch {
          // ignore
        }
      }

      setLoggedIn(!!token);
      setUserName(name || "");
      setIsAdmin(role === "admin");
    };

    readAuth();
    window.addEventListener("storage", readAuth);
    return () => window.removeEventListener("storage", readAuth);
  }, []);

  // Close dropdown on outside click & ESC
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") setShowMenu(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keyup", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keyup", handleEsc);
    };
  }, []);

  const links = [
    { to: "/home", label: "Home" },
    { to: "/books", label: "Store" },
    { to: "/about-us", label: "About Us" },
    { to: "/contact-us", label: "Contact Us" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md w-full border-b border-white/5">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 text-white w-full">
        {/* Logo */}
        <Link
          to="/home"
          className="text-xl font-bold tracking-tight hover:text-emerald-400 transition-colors z-50 shrink-0 mr-4"
          onClick={() => setMobileMenuOpen(false)}
        >
          Nerdy <span className="text-emerald-400">Enough</span>
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <SearchBar />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-md px-3 py-2 transition hover:bg-white/5 hover:text-emerald-400"
            >
              {link.label}
            </Link>
          ))}

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="group relative flex items-center justify-center rounded-full p-2 text-slate-300 transition hover:bg-white/5 hover:text-emerald-400"
            aria-label="Cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>

          {!loggedIn && (
            <>
              <Link
                to="/login"
                className="rounded-full bg-emerald-500 px-4 py-2 text-white font-semibold transition hover:bg-emerald-600 shadow-md shadow-emerald-500/20"
              >
                Login
              </Link>
            </>
          )}

          {loggedIn && (
            <div className="relative ml-2" ref={menuRef}>
              {/* Profile Button */}
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-slate-900 text-emerald-400 font-bold shadow-sm transition hover:bg-slate-800"
                aria-label="Profile"
                title={userName || "Profile"}
                onClick={() => setShowMenu((prev) => !prev)}
              >
                <span className="text-sm uppercase">
                  {(userName || "U").trim().charAt(0)}
                </span>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-slate-900 overflow-hidden shadow-2xl z-50">
                  {/* Manage Profile */}
                  <button
                    type="button"
                    className="block w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                    onClick={() => {
                      setShowMenu(false);
                      navigate("/profile");
                    }}
                  >
                    Manage Profile
                  </button>

                  <button
                    type="button"
                    className="block w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                    onClick={() => {
                      setShowMenu(false);
                      navigate("/my-orders");
                    }}
                  >
                    My Orders
                  </button>

                  {isAdmin && (
                    <button
                      type="button"
                      className="block w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                      onClick={() => {
                        setShowMenu(false);
                        navigate("/admin");
                      }}
                    >
                      Admin Dashboard
                    </button>
                  )}

                  <div className="h-px bg-white/10" />

                  {/* Logout */}
                  <button
                    type="button"
                    className="block w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors"
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("userName");
                      localStorage.removeItem("userEmail");
                      setLoggedIn(false);
                      setUserName("");
                      setShowMenu(false);
                      navigate("/login");
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>

        {/* Mobile Fullscreen Menu (Portal) */}
        {createPortal(
          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-999 md:hidden"
                />

                {/* Drawer */}
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed inset-y-0 right-0 w-64 bg-slate-950 border-l border-white/10 z-1000 md:hidden flex flex-col shadow-2xl"
                >
                  {/* Close Button Area */}
                  <div className="flex justify-end p-4 border-b border-white/5">
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 text-slate-400 hover:text-white transition-colors"
                      aria-label="Close menu"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={{
                      open: {
                        transition: {
                          staggerChildren: 0.1,
                        },
                      },
                      closed: {
                        transition: {
                          staggerChildren: 0.05,
                          staggerDirection: -1,
                        },
                      },
                    }}
                    className="flex flex-col p-6 space-y-6 text-lg font-medium w-full overflow-y-auto"
                  >
                    <div className="flex flex-col space-y-2">
                      {links.map((link) => (
                        <motion.div
                          key={link.to}
                          variants={{
                            open: { x: 0, opacity: 1 },
                            closed: { x: -20, opacity: 0 },
                          }}
                          className="w-full"
                        >
                          <Link
                            to={link.to}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block w-full py-3 text-slate-300 hover:text-white hover:bg-white/5 transition-all text-lg pl-4 border-l-2 border-transparent hover:border-emerald-500"
                          >
                            {link.label}
                          </Link>
                        </motion.div>
                      ))}
                    </div>

                    {/* Cart Link Mobile */}
                    <div className="flex flex-col space-y-2">
                      <motion.div
                        variants={{
                          open: { x: 0, opacity: 1 },
                          closed: { x: -20, opacity: 0 },
                        }}
                        className="w-full"
                      >
                        <Link
                          to="/cart"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            navigate("/cart");
                          }}
                          className="flex w-full items-center justify-between py-3 text-slate-300 hover:text-white hover:bg-white/5 transition-all text-lg pl-4 border-l-2 border-transparent hover:border-emerald-500"
                        >
                          <span>Cart</span>
                          {cartCount > 0 && (
                            <span className="bg-emerald-500 text-white text-sm font-bold px-2 py-0.5 rounded-full mr-4">
                              {cartCount}
                            </span>
                          )}
                        </Link>
                      </motion.div>
                    </div>

                    <motion.div
                      variants={{
                        open: { scaleX: 1, opacity: 1 },
                        closed: { scaleX: 0, opacity: 0 },
                      }}
                      className="w-full h-px bg-white/10 my-4"
                    />

                    {!loggedIn && (
                      <motion.div
                        variants={{
                          open: { y: 0, opacity: 1 },
                          closed: { y: 20, opacity: 0 },
                        }}
                      >
                        <Link
                          to="/login"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block w-full text-center py-3 rounded-lg bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-transform"
                        >
                          Login
                        </Link>
                      </motion.div>
                    )}

                    {loggedIn && (
                      <div className="flex flex-col space-y-2">
                        <motion.div
                          variants={{
                            open: { x: 0, opacity: 1 },
                            closed: { x: -20, opacity: 0 },
                          }}
                        >
                          <button
                            onClick={() => {
                              setMobileMenuOpen(false);
                              navigate("/profile");
                            }}
                            className="block w-full text-left py-3 text-slate-300 hover:text-white hover:bg-white/5 transition-all text-lg pl-4 border-l-2 border-transparent hover:border-emerald-500"
                          >
                            My Profile
                          </button>
                        </motion.div>

                        {isAdmin && (
                          <motion.div
                            variants={{
                              open: { x: 0, opacity: 1 },
                              closed: { x: -20, opacity: 0 },
                            }}
                          >
                            <button
                              onClick={() => {
                                setMobileMenuOpen(false);
                                navigate("/admin");
                              }}
                              className="block w-full text-left py-3 text-slate-300 hover:text-white hover:bg-white/5 transition-all text-lg pl-4 border-l-2 border-emerald-500/50 hover:border-emerald-500"
                            >
                              Admin Dashboard
                            </button>
                          </motion.div>
                        )}

                        <motion.div
                          variants={{
                            open: { x: 0, opacity: 1 },
                            closed: { x: -20, opacity: 0 },
                          }}
                        >
                          <button
                            onClick={() => {
                              localStorage.removeItem("token");
                              localStorage.removeItem("userName");
                              localStorage.removeItem("userEmail");
                              setLoggedIn(false);
                              setUserName("");
                              setMobileMenuOpen(false);
                              navigate("/login");
                            }}
                            className="block w-full text-left py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-lg pl-4 border-l-2 border-transparent hover:border-red-500"
                          >
                            Logout
                          </button>
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
      </div>
    </header>
  );
};

export default Header;
