"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import AnimatedButton from "@/components/AnimatedButton";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiDownload,
  FiStar,
  FiCalendar,
  FiUser,
  FiShare2,
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
  [key: string]: any;
};

export default function FeaturedAdminPage() {
  const [featuredStudents, setFeaturedStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      router.push("/admin/login");
      return;
    }

    fetchFeaturedStudents();
  }, [user, router]);

  const fetchFeaturedStudents = async () => {
    try {
      setIsLoading(true);

      // Use the API to fetch featured students
      const response = await fetch("/api/students/featured");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setFeaturedStudents(data);
    } catch (error) {
      console.error("Error fetching featured students:", error);
      toast.error("Failed to load featured students");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCard = (student: Student) => {
    router.push(`/admin/generate-card?id=${student.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12 md:px-8">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-display font-bold text-gray-800">
              Featured Personalities
            </h1>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500">Loading featured students...</p>
            </div>
          ) : featuredStudents.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiStar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No Featured Personalities
              </h3>
              <p className="text-gray-500 mb-6">
                You haven't selected any students as Personality of the Week
                yet.
              </p>
              <Link href="/admin/dashboard">
                <AnimatedButton variant="primary">
                  Go to Student Management
                </AnimatedButton>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredStudents.map((student) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col"
                >
                  <div className="relative">
                    <div className="h-48 bg-gray-200">
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
                    </div>
                    <div className="absolute top-3 right-3">
                      <div className="bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                        <FiStar className="w-3 h-3 mr-1" />
                        Featured
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {student.fullName}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {student.matricNumber} • {student.level} Level
                    </p>

                    <div className="italic text-gray-700 text-sm mb-4">
                      "{student.quote || "No quote provided"}"
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                      <div className="text-xs text-gray-500 flex items-center">
                        <FiCalendar className="w-3 h-3 mr-1" />
                        <span>
                          {student.createdAt?.toDate
                            ? new Date(
                                student.createdAt.toDate()
                              ).toLocaleDateString()
                            : "Unknown date"}
                        </span>
                      </div>

                      <button
                        onClick={() => handleGenerateCard(student)}
                        className="inline-flex items-center text-primary text-sm font-medium"
                      >
                        <FiDownload className="w-4 h-4 mr-1" />
                        Generate Card
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
