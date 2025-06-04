"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import AnimatedButton from "@/components/AnimatedButton";
import { FiArrowRight, FiUser, FiAward, FiStar } from "react-icons/fi";
import ReactConfetti from "react-confetti";
import toast from "react-hot-toast";

export default function Home() {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);
  const [matricNumber, setMatricNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [featuredStudent, setFeaturedStudent] = useState<any>(null);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  // Fetch featured student for the card display
  useEffect(() => {
    const fetchFeaturedStudent = async () => {
      try {
        const response = await fetch("/api/students/featured");
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setFeaturedStudent(data[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching featured student:", error);
      } finally {
        setLoadingFeatured(false);
      }
    };

    fetchFeaturedStudent();
  }, []);

  const handleMatricSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!matricNumber || matricNumber.length < 6) {
      toast.error("Please enter a valid matric number");
      setIsSubmitting(false);
      return;
    }

    // Show success animation then redirect
    setShowConfetti(true);
    toast.success("Matric number verified!");

    setTimeout(() => {
      router.push(`/register?matric=${encodeURIComponent(matricNumber)}`);
    }, 2000);
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const features = [
    {
      icon: <FiUser className="h-8 w-8 text-primary" />,
      title: "Student Showcase",
      description: "Highlight your personality to the LINCSSA community",
    },
    {
      icon: <FiAward className="h-8 w-8 text-secondary" />,
      title: "Personality of the Week",
      description: "Get featured as the department's personality of the day",
    },
    {
      icon: <FiStar className="h-8 w-8 text-lincssa-gold" />,
      title: "Beautiful Profile Cards",
      description: "Automatically generated cards for featured personalities",
    },
  ];

  return (
    <main>
      {showConfetti && <ReactConfetti recycle={false} numberOfPieces={500} />}
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-black">
        {/* Background Gradient Blobs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-lincssa-gold/20 rounded-full blur-3xl animate-pulse-slow" />
        <div
          className="absolute top-1/3 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute -bottom-20 right-1/3 w-60 h-60 bg-lincssa-gold/10 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />

        {/* Add the LINCSSA logo watermark */}
        <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none">
          <img
            src="/logo.png"
            alt="LINCSSA Logo"
            className="w-4/5 h-auto max-w-2xl"
          />
        </div>

        <div className="container mx-auto px-4 md:px-6 pt-24 pb-20 relative z-10">
          <motion.div
            className="flex flex-col lg:flex-row items-center justify-between gap-12 md:gap-16"
            initial="hidden"
            animate="show"
            variants={staggerContainer}
          >
            <motion.div variants={item} className="flex-1">
              <motion.span
                className="inline-block px-3 py-1 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                LINCSSA SET 25
              </motion.span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight bg-gradient-to-r from-lincssa-gold via-white to-lincssa-gold bg-clip-text text-transparent animate-gradient bg-300">
                LINCSSA Set 25 Finalists
              </h1>

              <motion.p
                className="mt-6 text-lg text-white text-shadow max-w-xl"
                variants={item}
              >
                A celebration of the linguistics and communication studies
                graduates of Set 25. Share your journey and memories as you
                embark on the next chapter.
              </motion.p>

              <motion.form
                onSubmit={handleMatricSubmit}
                className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md"
                variants={item}
              >
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={matricNumber}
                    onChange={(e) => setMatricNumber(e.target.value)}
                    placeholder="Enter your matric number"
                    className="w-full p-4 pr-12 rounded-lg border-2 border-white/20 bg-white/10 backdrop-blur-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-white placeholder:text-white/70"
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70">
                    #
                  </div>
                </div>
                <AnimatedButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  icon={<FiArrowRight />}
                  iconPosition="right"
                >
                  Get Started
                </AnimatedButton>
              </motion.form>
            </motion.div>

            <motion.div
              variants={item}
              className="flex-1 relative max-w-md lg:max-w-none"
            >
              <motion.div
                className="relative z-10 bg-white p-2 rounded-xl shadow-2xl rotate-3"
                animate={{
                  y: [0, -10, 0],
                  rotate: [3, 5, 3],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut",
                }}
              >
                <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-lincssa-blue to-primary">
                  {/* Display the card image if available */}
                  {featuredStudent && featuredStudent.cardImageURL ? (
                    <div className="aspect-[9/16] flex items-center justify-center">
                      <img
                        src={featuredStudent.cardImageURL.replace(
                          "/upload/",
                          "/upload/c_scale,w_800,q_auto/"
                        )}
                        alt={`${featuredStudent.fullName} Card`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[9/16]">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-lincssa-gold rounded-full flex items-center justify-center text-lincssa-blue text-xl font-bold">
                            L
                          </div>
                          <div>
                            <p className="text-sm text-lincssa-gold">
                              PERSONALITY OF THE DAY
                            </p>
                            <h3 className="text-xl font-bold">
                              {featuredStudent
                                ? featuredStudent.fullName
                                : "John Doe"}
                            </h3>
                          </div>
                        </div>
                        <p className="text-sm opacity-90">
                          {featuredStudent && featuredStudent.quote
                            ? `"${featuredStudent.quote}"`
                            : `"The future belongs to those who believe in the beauty of their dreams."`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                className="absolute -z-10 -bottom-8 -right-8 w-full h-full bg-secondary rounded-xl"
                animate={{
                  rotate: [-2, -4, -2],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  delay: 0.2,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-[300%] h-24 text-white"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V56.44Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-lincssa-blue">
              Features & Benefits
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto my-6"></div>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Join the LINCSSA community and showcase your talents and
              personality
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-gray-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-all border border-gray-100 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="bg-white w-16 h-16 rounded-xl shadow-sm flex items-center justify-center mb-6 relative z-10 group-hover:shadow-md transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 relative z-10">
                  {feature.title}
                </h3>
                <p className="text-gray-600 relative z-10">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-lincssa-blue to-primary text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Ready to Shine?
            </h2>
            <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
              Join the LINCSSA community today and get a chance to be featured
              as our next Personality of the Week!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <AnimatedButton
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                variant="secondary"
                size="lg"
                icon={<FiArrowRight />}
                iconPosition="right"
              >
                Enter Your Matric Number
              </AnimatedButton>

              <AnimatedButton
                onClick={() => router.push("/challenge")}
                variant="outline"
                size="lg"
                icon={<FiStar />}
                iconPosition="left"
                className="border-white text-white hover:bg-white hover:text-lincssa-blue"
              >
                30 Days Challenge
              </AnimatedButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-lincssa-blue flex items-center justify-center text-white font-bold text-sm">
                  L
                </div>
                <h3 className="text-lg font-display font-bold text-lincssa-blue">
                  <span className="text-lincssa-gold">LINCSSA</span> Portal
                </h3>
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} Linguistics and Communication
                Studies Students Association (LINCSSA Set 25)
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Built with ❤️ for LINCSSA community
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
