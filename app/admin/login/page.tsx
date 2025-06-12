"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import AnimatedButton from "@/components/AnimatedButton";
import { FiUser, FiLock, FiArrowRight } from "react-icons/fi";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundElements, setBackgroundElements] = useState<
    Array<{ id: number; x: number; y: number; scale: number }>
  >([]);
  const { signInAdmin } = useAuth();
  const router = useRouter();

  // Initialize background elements after component mounts to avoid SSR issues
  useEffect(() => {
    setBackgroundElements(
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        scale: Math.random() * 0.5 + 0.5,
      }))
    );
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInAdmin(email, password);
      toast.success("Admin login successful! 🎉");
      router.push("/admin/dashboard");
    } catch (error: any) {
      console.error("Admin login error:", error);
      toast.error(
        error.message || "Login failed. Please check your credentials and admin privileges."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
      {/* Background Animation Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
        <div
          className="absolute bottom-20 -left-20 w-80 h-80 bg-white/20 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        />

        {backgroundElements.map((el) => (
          <motion.div
            key={el.id}
            className="absolute bg-white/20 rounded-full w-2 h-2"
            initial={{
              x: el.x,
              y: el.y,
              scale: el.scale,
            }}
            animate={{
              y: [null, Math.random() * -100, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              repeat: Infinity,
              duration: Math.random() * 5 + 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg transform -rotate-6">
              A
            </div>
          </div>
          <h1 className="text-2xl font-display font-bold text-gray-800">
            Admin Portal
          </h1>
          <p className="text-gray-500 mt-2">
            Restricted access - Admin credentials required
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <FiUser />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-black"
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <FiLock />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-black"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <AnimatedButton
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            fullWidth
            icon={<FiArrowRight />}
            iconPosition="right"
          >
            Sign In
          </AnimatedButton>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-primary hover:text-primary-dark text-sm inline-flex items-center gap-1 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
