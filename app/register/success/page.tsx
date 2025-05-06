"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AnimatedButton from "@/components/AnimatedButton";
import { FiHome, FiCheck, FiAward } from "react-icons/fi";
import ReactConfetti from "react-confetti";

export default function RegistrationSuccess() {
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Handle window resize for confetti
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial size
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Auto-hide confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.15}
          colors={["#7C4DFF", "#FF4081", "#1E3A8A", "#FFD700"]}
        />
      )}

      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 md:p-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FiCheck className="w-12 h-12 text-green-500" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-3xl font-display font-bold text-gray-800 mb-4"
          >
            Registration Successful!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg text-gray-600 mb-8"
          >
            Thank you for submitting your information. Your profile will be
            reviewed for the Personality of the Week selection.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-primary/5 rounded-xl p-6 mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-3 text-primary">
              <FiAward className="w-5 h-5" />
              <h3 className="font-medium">What Happens Next?</h3>
            </div>
            <p className="text-gray-600">
              The LINCSSA team will review all submissions and select the
              Personality of the Week. If chosen, your profile will be featured
              on our platforms and a beautiful card will be created to celebrate
              your achievement.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/personality">
              <AnimatedButton variant="outline" icon={<FiAward />}>
                View Featured Personalities
              </AnimatedButton>
            </Link>

            <Link href="/">
              <AnimatedButton variant="primary" icon={<FiHome />}>
                Back to Home
              </AnimatedButton>
            </Link>
          </motion.div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <h3 className="font-bold text-blue-800 mb-2">
              Access Your Profile Anytime
            </h3>
            <p className="text-blue-700 mb-4">
              You can now log in using your email and password to view and edit
              your profile details!
            </p>
            <Link href="/student/login">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Go to Login
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
