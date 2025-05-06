"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedButton from "@/components/AnimatedButton";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  FiArrowLeft,
  FiArrowRight,
  FiUser,
  FiCalendar,
  FiMessageCircle,
  FiHeart,
} from "react-icons/fi";
import Link from "next/link";

type Student = {
  id: string;
  fullName: string;
  matricNumber: string;
  level: string;
  department: string;
  photoURL: string;
  quote: string;
  bio: string;
  featured: boolean;
  createdAt: any;
  hobbies?: string;
  achievements?: string;
  // New fields
  birthMonth?: string;
  birthDay?: string;
  relationshipStatus?: string;
  socials?: string;
  specializationTrack?: string; // "Linguistics", "Communication", "Both"
  favoriteLevel?: string;
  shegeLevel?: string;
  favoriteCourse?: string;
  shegeCourse?: string;
  worstMoment?: string;
  bestMoment?: string;
  favoriteLecturer?: string;
  partingWords?: string;
  ifNotLinguistics?: string;
  favoriteColor?: string;
  advice?: string;
  [key: string]: any;
};

export default function PersonalityPage() {
  const [featuredStudent, setFeaturedStudent] = useState<Student | null>(null);
  const [previousStudents, setPreviousStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHeroAnimation, setShowHeroAnimation] = useState(false);

  useEffect(() => {
    fetchFeaturedStudent();

    // Show hero animation after a short delay
    const timer = setTimeout(() => {
      setShowHeroAnimation(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const fetchFeaturedStudent = async () => {
    try {
      setIsLoading(true);

      // Get current featured student
      const featuredQuery = query(
        collection(db, "students"),
        where("featured", "==", true),
        limit(1)
      );

      const featuredSnapshot = await getDocs(featuredQuery);
      let currentFeatured: Student | null = null;

      featuredSnapshot.forEach((doc) => {
        currentFeatured = { id: doc.id, ...doc.data() } as Student;
      });

      setFeaturedStudent(currentFeatured);

      // Get previous featured students (for history)
      const previousQuery = query(
        collection(db, "students"),
        orderBy("createdAt", "desc"),
        limit(10)
      );

      const previousSnapshot = await getDocs(previousQuery);
      const prevFeatured: Student[] = [];

      previousSnapshot.forEach((doc) => {
        const student = { id: doc.id, ...doc.data() } as Student;
        if (!student.featured) {
          prevFeatured.push(student);
        }
      });

      setPreviousStudents(prevFeatured);
    } catch (error) {
      console.error("Error fetching featured student:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStudent = () => {
    if (currentIndex < previousStudents.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevStudent = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-lincssa-blue mb-4">
            Personality of the Week
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Celebrating the outstanding individuals in the Linguistics and
            Communication Studies department
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Loading featured personality...</p>
          </div>
        ) : featuredStudent ? (
          <div className="max-w-6xl mx-auto">
            {/* Current Featured Student */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden mb-20"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-80 lg:h-auto bg-gradient-to-br from-lincssa-blue to-primary overflow-hidden">
                  {featuredStudent.photoURL ? (
                    <motion.div
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 1.2 }}
                      className="w-full h-full"
                    >
                      <img
                        src={featuredStudent.photoURL}
                        alt={featuredStudent.fullName}
                        className="w-full h-full object-cover opacity-80"
                      />
                    </motion.div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiUser className="w-24 h-24 text-white/50" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
                    <AnimatePresence>
                      {showHeroAnimation && (
                        <>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="inline-block bg-lincssa-gold px-4 py-1 rounded-full text-sm font-bold text-lincssa-blue mb-4 w-fit"
                          >
                            Current Feature
                          </motion.div>
                          <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="text-3xl font-bold text-white mb-2"
                          >
                            {featuredStudent.fullName}
                          </motion.h2>
                          <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="text-white/90"
                          >
                            {featuredStudent.level} Level •{" "}
                            {featuredStudent.department}
                          </motion.p>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="p-8 lg:p-10">
                  <div className="flex items-center gap-3 mb-6 text-gray-400">
                    <FiCalendar className="w-5 h-5" />
                    <span className="text-sm">
                      {featuredStudent.createdAt?.toDate
                        ? featuredStudent.createdAt
                            .toDate()
                            .toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                        : "Date unavailable"}
                    </span>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full text-primary">
                        <FiMessageCircle className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-900">
                        Favorite Quote
                      </h3>
                    </div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className="text-gray-700 italic mt-2 pl-10"
                    >
                      "{featuredStudent.quote}"
                    </motion.p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                      About
                    </h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.7 }}
                      className="text-gray-700"
                    >
                      {featuredStudent.bio}
                    </motion.p>
                  </div>

                  {featuredStudent.hobbies && (
                    <div className="mb-6">
                      <h3 className="text-xl font-medium text-gray-900 mb-2">
                        Hobbies & Interests
                      </h3>
                      <p className="text-gray-700">{featuredStudent.hobbies}</p>
                    </div>
                  )}

                  {featuredStudent.achievements && (
                    <div className="mb-6">
                      <h3 className="text-xl font-medium text-gray-900 mb-2">
                        Achievements
                      </h3>
                      <p className="text-gray-700">
                        {featuredStudent.achievements}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end mt-8">
                    <AnimatedButton
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                      variant="outline"
                      icon={<FiHeart />}
                    >
                      Become Next Featured Personality
                    </AnimatedButton>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Previous Featured Students */}
            {previousStudents.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-display font-bold text-gray-800 mb-6">
                  Previous Personalities
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {previousStudents.slice(0, 4).map((student, index) => (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{
                        y: -5,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                      }}
                      className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col"
                    >
                      <div className="h-48 relative">
                        {student.photoURL ? (
                          <img
                            src={student.photoURL}
                            alt={student.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <FiUser className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                          <div className="p-4">
                            <h3 className="text-white font-bold">
                              {student.fullName}
                            </h3>
                            <p className="text-white/80 text-sm">
                              {student.level} Level
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <p className="text-sm text-gray-500 italic line-clamp-2 flex-1">
                          "{student.quote}"
                        </p>
                        <div className="mt-4 text-xs text-gray-400">
                          {student.createdAt?.toDate
                            ? student.createdAt
                                .toDate()
                                .toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                })
                            : "Date unavailable"}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {previousStudents.length > 4 && (
                  <div className="text-center mt-10">
                    <AnimatedButton variant="outline" size="md">
                      View All Previous Personalities
                    </AnimatedButton>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <FiUser className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No Featured Personality Yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              We haven't selected our first Personality of the Week yet. Be the
              first one by registering now!
            </p>
            <Link href="/">
              <AnimatedButton variant="primary">Register Now</AnimatedButton>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
