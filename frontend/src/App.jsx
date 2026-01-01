import React, { Suspense, lazy } from "react";
import Header from "./components/Header.jsx";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import ProtectRoute from "./components/ProtectRoute.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthRoute from "./components/AuthRoute.jsx";

// Lazy Load Pages
const Home = lazy(() => import("./pages/Home.jsx"));
const Books = lazy(() => import("./pages/Books.jsx"));
const AboutUs = lazy(() => import("./pages/AboutUs.jsx"));
const ContactUs = lazy(() => import("./pages/ContactUs.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const VerifyOtp = lazy(() => import("./pages/VerifyOtp.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const BookDetails = lazy(() => import("./pages/BookDetails.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const Checkout = lazy(() => import("./pages/Checkout.jsx"));
const MyOrders = lazy(() => import("./pages/MyOrders.jsx"));
const SearchResults = lazy(() => import("./pages/SearchResults.jsx"));

// Admin Components Lazy Load
const AddBook = lazy(() => import("./admin/AddBook.jsx"));
const EditBook = lazy(() => import("./admin/EditBook.jsx"));
const AdminDashboard = lazy(() => import("./admin/AdminDashboard.jsx"));
const AdminOrders = lazy(() => import("./admin/AdminOrders.jsx"));

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-950">
    <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
  </div>
);

const App = () => {
  const location = useLocation();
  const hideLayout = location.pathname.startsWith("/admin");

  React.useEffect(() => {
    window.scrollTo(0, 0);
    const path = location.pathname;
    let title = "Nerdy Enough";

    if (path === "/" || path === "/home") title = "Home | Nerdy Enough";
    else if (path === "/books") title = "Books | Nerdy Enough";
    else if (path === "/about-us") title = "About Us | Nerdy Enough";
    else if (path === "/contact-us") title = "Contact Us | Nerdy Enough";
    else if (path === "/register") title = "Register | Nerdy Enough";
    else if (path === "/login") title = "Login | Nerdy Enough";
    else if (path === "/verify-otp") title = "Verify OTP | Nerdy Enough";
    else if (path === "/profile") title = "Profile | Nerdy Enough";
    else if (path.startsWith("/books/")) title = "Book Details | Nerdy Enough";
    else if (path === "/admin" || path === "/admin/dashboard")
      title = "Admin Dashboard | Nerdy Enough";
    else if (path === "/admin/books-management")
      title = "Books Management | Nerdy Enough";
    else if (path === "/admin/books/add") title = "Add Book | Nerdy Enough";
    else if (path.startsWith("/admin/books/edit/"))
      title = "Edit Book | Nerdy Enough";
    else if (path === "/admin/orders") title = "Manage Orders | Nerdy Enough";
    else if (path === "/my-orders") title = "My Orders | Nerdy Enough";

    document.title = title;
  }, [location]);

  return (
    <div
      className={`overflow-x-hidden max-w-full ${!hideLayout ? "pt-16" : ""}`}
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {!hideLayout && <Header />}

      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/search" element={<SearchResults />} />
          {/* Protected User Routes */}
          <Route element={<AuthRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/my-orders" element={<MyOrders />} />
          </Route>
          {/* Admin Routes - Protected */}
          <Route element={<ProtectRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            {/* Helper redirect for legacy link */}
            <Route
              path="/admin/dashboard"
              element={<Navigate to="/admin" replace />}
            />
            <Route
              path="/admin/books-management"
              element={<AdminDashboard />}
            />
            <Route path="/admin/books/add" element={<AddBook />} />
            <Route path="/admin/books/add" element={<AddBook />} />
            <Route path="/admin/books/edit/:id" element={<EditBook />} />
            <Route path="/admin/orders" element={<AdminDashboard />} />
            <Route path="/admin/orders/:status" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </Suspense>

      {!hideLayout &&
        ![
          "/login",
          "/register",
          "/verify-otp",
          "/profile",
          "/cart",
          "/cart",
          "/checkout",
          "/my-orders",
        ].includes(location.pathname) && <Footer />}
    </div>
  );
};

export default App;
