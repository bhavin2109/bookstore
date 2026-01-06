import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="overflow-x-hidden max-w-full">
      <footer className="bg-slate-950 text-white py-8 mt-12 border-t border-white/10">
        <div className="container mx-auto px-4 w-full max-w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">About Us</h3>
              <p className="text-slate-400">
                Your trusted online bookstore for quality reads and great
                prices.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Quick Links</h3>
              <ul className="text-slate-400 space-y-2">
                <li>
                  <Link
                    to="/home"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/books"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Books
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about-us"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact-us"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">
                Legal & Support
              </h3>
              <ul className="text-slate-400 space-y-2">
                <li>
                  <Link
                    to="/terms"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/refund"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/disclaimer"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Disclaimer
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about-us"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact-us"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Contact</h3>
              <p className="text-slate-400">Email: opbhavin21@gmail.com</p>
              <p className="text-slate-400">Phone: 9316134234</p>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-slate-500 text-sm">
            <p>&copy; 2026 Nerdy Enough. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
