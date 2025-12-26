import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

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
    { to: "/products", label: "Store" },
    { to: "/about-us", label: "About Us" },
    { to: "/contact-us", label: "Contact Us" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md w-full border-b border-white/5">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 text-white w-full">
        {/* Logo */}
        <Link
          to="/home"
          className="text-xl font-bold tracking-tight hover:text-emerald-400 transition-colors"
        >
          Book<span className="text-emerald-400">Store</span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-4 text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-md px-3 py-2 transition hover:bg-white/5 hover:text-emerald-400"
            >
              {link.label}
            </Link>
          ))}

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
      </div>
    </header>
  );
};

export default Header;
