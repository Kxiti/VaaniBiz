"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaMicrophone } from "react-icons/fa";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
              <FaMicrophone className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold text-dark">VaaniBiz AI</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              href="/idea"
              className="hidden sm:block px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition"
            >
              Try Now
            </Link>
            <Link
              href="/idea"
              className="px-6 py-2 gradient-primary text-white rounded-full font-medium hover:shadow-lg transition"
            >
              Start Free
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
