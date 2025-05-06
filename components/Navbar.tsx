"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Personality of the Week", path: "/personality" },
    { name: "About LINCSSA", path: "/about" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-white/90 backdrop-blur-md shadow-md"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-lincssa-blue to-primary flex items-center justify-center text-white font-bold text-lg">
              L
            </div>
            <h1
              className={`text-xl font-display font-bold ${
                isScrolled ? "text-lincssa-blue" : "text-white text-shadow"
              }`}
            >
              <span className="text-lincssa-gold">LINCSSA</span> Portal
            </h1>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex space-x-8"
          >
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.path}
                  className={`relative px-2 py-1 font-medium transition-colors ${
                    isActive(item.path)
                      ? "text-primary"
                      : isScrolled
                      ? "text-gray-700 hover:text-primary"
                      : "text-white hover:text-lincssa-gold"
                  }`}
                >
                  {item.name}
                  {isActive(item.path) && (
                    <motion.span
                      layoutId="navbar-underline"
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/student/login"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Student Login
              </Link>
            </li>
          </motion.ul>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden block"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <FiX
                className={`w-6 h-6 ${
                  isScrolled ? "text-gray-800" : "text-white"
                }`}
              />
            ) : (
              <FiMenu
                className={`w-6 h-6 ${
                  isScrolled ? "text-gray-800" : "text-white"
                }`}
              />
            )}
          </motion.button>

          {/* Mobile Menu */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: mobileMenuOpen ? 1 : 0,
              height: mobileMenuOpen ? "auto" : 0,
              display: mobileMenuOpen ? "block" : "none",
            }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-lg overflow-hidden md:hidden"
          >
            <ul className="py-4 px-6 space-y-4">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 ${
                      isActive(item.path)
                        ? "text-primary font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/student/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-gray-700"
                >
                  Student Login
                </Link>
              </li>
            </ul>
          </motion.div>
        </nav>
      </div>
    </header>
  );
}
