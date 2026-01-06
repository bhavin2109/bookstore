import React, { Suspense, lazy } from "react";
import Header from "./components/Header.jsx";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import ProtectRoute from "./components/ProtectRoute.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthRoute from "./components/AuthRoute.jsx";

import SellerRoute from "./components/SellerRoute.jsx";
import DeliveryRoute from "./components/DeliveryRoute.jsx";
import Chatbot from "./components/Chatbot.jsx";
import SellerLayout from "./layouts/SellerLayout.jsx";
import DeliveryLayout from "./layouts/DeliveryLayout.jsx";

// Lazy Load Pages
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
const Wishlist = lazy(() => import("./pages/Wishlist.jsx"));

// Legal Pages
const TermsAndConditions = lazy(() =>
  import("./pages/legal/TermsAndConditions.jsx")
);
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy.jsx"));
const RefundPolicy = lazy(() => import("./pages/legal/RefundPolicy.jsx"));
const Disclaimer = lazy(() => import("./pages/legal/Disclaimer.jsx"));
const SellerDashboard = lazy(() => import("./seller/SellerDashboard.jsx"));
const SellerProducts = lazy(() => import("./seller/SellerProducts.jsx"));
const SellerAddBook = lazy(() => import("./seller/SellerAddBook.jsx"));
const SellerEditBook = lazy(() => import("./seller/SellerEditBook.jsx"));
const SellerShopSettings = lazy(() =>
  import("./seller/SellerShopSettings.jsx")
);
const SellerOrders = lazy(() => import("./seller/SellerOrders.jsx"));
const Shop = lazy(() => import("./seller/Shop.jsx"));
const SellerRegistration = lazy(() => import("./pages/SellerRegistration.jsx"));
const DeliveryRegistration = lazy(() =>
  import("./pages/DeliveryRegistration.jsx")
);
const DeliveryDashboard = lazy(() =>
  import("./delivery/DeliveryDashboard.jsx")
);
const DeliveryJobs = lazy(() => import("./delivery/DeliveryJobs.jsx"));
const DeliveryHistory = lazy(() => import("./delivery/DeliveryHistory.jsx"));
const DeliveryProfile = lazy(() => import("./delivery/DeliveryProfile.jsx"));

// Admin Components Lazy Load
const AddBook = lazy(() => import("./admin/AddBook.jsx"));
const EditBook = lazy(() => import("./admin/EditBook.jsx"));
const AdminDashboard = lazy(() => import("./admin/AdminDashboard.jsx"));
const AdminOrders = lazy(() => import("./admin/AdminOrders.jsx"));
const RoleRequests = lazy(() => import("./admin/RoleRequests.jsx"));
const AdminReviews = lazy(() => import("./admin/AdminReviews.jsx"));

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-950">
    <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
  </div>
);

const App = () => {
  const location = useLocation();
  const hideLayout =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/seller") ||
    location.pathname.startsWith("/delivery");

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
      <Chatbot />
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
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/refund" element={<RefundPolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          {/* Protected User Routes */}
          <Route element={<AuthRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route
              path="/seller-registration"
              element={<SellerRegistration />}
            />
            <Route
              path="/delivery-registration"
              element={<DeliveryRegistration />}
            />
            <Route path="/wishlist" element={<Wishlist />} />
          </Route>

          {/* Seller Routes - Protected */}
          <Route element={<SellerRoute />}>
            <Route element={<SellerLayout />}>
              <Route path="/seller" element={<SellerDashboard />} />
              <Route path="/seller/products" element={<SellerProducts />} />
              <Route path="/seller/add-product" element={<SellerAddBook />} />
              <Route
                path="/seller/edit-product/:id"
                element={<SellerEditBook />}
              />
              <Route path="/seller/shop" element={<SellerShopSettings />} />
              <Route path="/seller/orders" element={<SellerOrders />} />
            </Route>
          </Route>

          {/* Delivery Routes - Protected */}
          <Route element={<DeliveryRoute />}>
            <Route element={<DeliveryLayout />}>
              <Route path="/delivery" element={<DeliveryDashboard />} />
              <Route path="/delivery/jobs" element={<DeliveryJobs />} />
              <Route path="/delivery/history" element={<DeliveryHistory />} />
              <Route path="/delivery/profile" element={<DeliveryProfile />} />
            </Route>
          </Route>

          <Route path="/shop/:slug" element={<Shop />} />
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
            <Route path="/admin/role-requests" element={<AdminDashboard />} />
            <Route path="/admin/reviews" element={<AdminDashboard />} />
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
