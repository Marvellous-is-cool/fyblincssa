"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import AnimatedButton from "@/components/AnimatedButton";
import {
  collection,
  query,
  getDocs,
  updateDoc,
  doc,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import {
  FiSearch,
  FiUser,
  FiLogOut,
  FiStar,
  FiDownload,
  FiList,
  FiInfo,
  FiChevronDown,
  FiChevronUp,
  FiMenu,
  FiX,
  FiGrid,
  FiCamera,
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

export default function AdminDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      router.push("/admin/login");
      return;
    }

    // Fetch students
    fetchStudents();
  }, [user, router]);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = students.filter(
        (student) =>
          student.fullName.toLowerCase().includes(query) ||
          student.matricNumber.toLowerCase().includes(query)
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchQuery, students]);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      // Use dedicated API endpoint instead of client-side Firestore
      const response = await fetch("/api/students");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const fetchedStudents = await response.json();

      // Sort by createdAt (assuming it's a timestamp)
      const sortedStudents = fetchedStudents.sort((a: Student, b: Student) => {
        return b.createdAt?.seconds - a.createdAt?.seconds;
      });

      setStudents(sortedStudents);
      setFilteredStudents(sortedStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      router.push("/admin/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to log out");
    }
  };

  const handleSetFeatured = async (student: Student) => {
    try {
      // Show confirmation toast
      toast((t) => (
        <div className="flex flex-col items-center space-y-2">
          <p>
            Set <b>{student.fullName}</b> as Personality of the Week?
          </p>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 bg-green-500 text-white rounded-md"
              onClick={async () => {
                toast.dismiss(t.id);
                await confirmSetFeatured(student);
              }}
            >
              Yes
            </button>
            <button
              className="px-3 py-1 bg-gray-300 rounded-md"
              onClick={() => toast.dismiss(t.id)}
            >
              No
            </button>
          </div>
        </div>
      ));
    } catch (error) {
      console.error("Error updating featured status:", error);
      toast.error("Failed to update featured status");
    }
  };

  const confirmSetFeatured = async (student: Student) => {
    try {
      // First, unfeature any currently featured student
      const featuredStudents = students.filter((s) => s.featured);

      // Update on server through API endpoint
      const response = await fetch("/api/students/feature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: student.id,
          unfeaturedIds: featuredStudents.map((s) => s.id),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update featured status");
      }

      // Update local state
      setStudents((prevStudents) =>
        prevStudents.map((s) => ({
          ...s,
          featured: s.id === student.id,
        }))
      );

      setFilteredStudents((prevStudents) =>
        prevStudents.map((s) => ({
          ...s,
          featured: s.id === student.id,
        }))
      );

      toast.success(`${student.fullName} is now the Personality of the Week!`);

      // Ask if admin wants to generate a card for the student
      toast(
        (t) => (
          <div className="flex flex-col items-center space-y-2">
            <p>Generate personality card?</p>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 bg-primary text-white rounded-md"
                onClick={() => {
                  toast.dismiss(t.id);
                  router.push(`/admin/generate-card?id=${student.id}`);
                }}
              >
                Yes
              </button>
              <button
                className="px-3 py-1 bg-gray-300 rounded-md"
                onClick={() => toast.dismiss(t.id)}
              >
                No
              </button>
            </div>
          </div>
        ),
        { duration: 5000 }
      );
    } catch (error) {
      console.error("Error updating featured status:", error);
      toast.error("Failed to update Personality of the Week");
    }
  };

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
    setShowDetailsModal(true);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? (
          <FiX className="w-6 h-6" />
        ) : (
          <FiMenu className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-64 bg-gradient-to-b from-blue-600 to-purple-600 text-white fixed md:relative inset-y-0 left-0 z-30 md:z-0 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center text-blue-600 font-bold text-lg">
                  A
                </div>
                <h1 className="text-xl font-display font-bold">
                  Admin Dashboard
                </h1>
              </div>

              <nav className="space-y-1">
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 text-white"
                >
                  <FiList className="w-5 h-5" />
                  <span>Students</span>
                </Link>
                <Link
                  href="/admin/featured"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                >
                  <FiStar className="w-5 h-5" />
                  <span>Featured</span>
                </Link>
              </nav>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-3 mb-4 text-white/80">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <FiUser className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {user?.email?.split("@")[0]}
                  </p>
                  <p className="text-xs opacity-70">Administrator</p>
                </div>
              </div>

              <AnimatedButton
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-center border border-white/20 hover:bg-white/10 text-white"
                icon={<FiLogOut className="w-5 h-5" />}
              >
                Sign Out
              </AnimatedButton>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-8">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-display font-bold text-gray-800">
                Student Management
              </h1>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <FiSearch className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search students..."
                    className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-black"
                  />
                </div>

                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md ${
                      viewMode === "list"
                        ? "bg-white shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    <FiList className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md ${
                      viewMode === "grid"
                        ? "bg-white shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    <FiGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500">Loading students...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <FiInfo className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No students found
                </h3>
                <p className="text-gray-500">
                  {searchQuery
                    ? "Try a different search query"
                    : "No students have registered yet"}
                </p>
              </div>
            ) : viewMode === "list" ? (
              <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Student
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Matric Number
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Level
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map((student) => (
                      <motion.tr
                        key={student.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{
                          backgroundColor: "rgba(249, 250, 251, 0.5)",
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 relative">
                              {student.photoURL ? (
                                <img
                                  src={student.photoURL}
                                  alt={student.fullName}
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                  {student.fullName.charAt(0)}
                                </div>
                              )}
                              {student.featured && (
                                <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-0.5 w-4 h-4 flex items-center justify-center">
                                  <FiStar className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {student.fullName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {student.email || "No email provided"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {student.matricNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {student.level} Level
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.featured ? (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          ) : (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-500">
                              Regular
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleViewDetails(student)}
                              className="text-primary hover:text-primary-dark transition p-1"
                            >
                              View
                            </button>
                            {!student.featured && (
                              <button
                                onClick={() => handleSetFeatured(student)}
                                className="text-yellow-500 hover:text-yellow-600 transition p-1"
                              >
                                Feature
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredStudents.map((student) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{
                      y: -5,
                      boxShadow:
                        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                    }}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col relative"
                  >
                    {student.featured && (
                      <div className="absolute top-3 right-3 z-10">
                        <div className="bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                          <FiStar className="w-3 h-3 mr-1" />
                          Featured
                        </div>
                      </div>
                    )}

                    <div className="h-48 bg-gray-100 relative">
                      {student.photoURL ? (
                        <img
                          src={student.photoURL}
                          alt={student.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                          <FiCamera className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-gray-900 mb-1">
                        {student.fullName}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {student.matricNumber} • {student.level} Level
                      </p>

                      <p className="text-xs text-gray-500 line-clamp-2 flex-1">
                        {student.bio || "No bio provided"}
                      </p>

                      <div className="mt-4 flex justify-between items-center">
                        <button
                          onClick={() => handleViewDetails(student)}
                          className="text-xs text-primary font-medium"
                        >
                          View Details
                        </button>

                        {!student.featured && (
                          <button
                            onClick={() => handleSetFeatured(student)}
                            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md flex items-center gap-1"
                          >
                            <FiStar className="w-3 h-3" />
                            Feature
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {filteredStudents.length > 0 && (
              <div className="mt-6 text-center text-sm text-gray-500">
                Showing {filteredStudents.length} of {students.length} students
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Student Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <div className="h-40 md:h-64 bg-gradient-to-r from-blue-600 to-purple-600 relative">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <div className="px-6 md:px-10 -mt-16 md:-mt-24 relative pb-8">
                  <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-xl border-4 border-white overflow-hidden shadow-lg flex-shrink-0 mx-auto md:mx-0">
                      {selectedStudent.photoURL ? (
                        <img
                          src={selectedStudent.photoURL}
                          alt={selectedStudent.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                          <FiUser className="w-16 h-16" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 justify-center md:justify-start">
                        <h2 className="text-2xl font-bold text-gray-900">
                          {selectedStudent.fullName}
                        </h2>
                        {selectedStudent.featured && (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 inline-flex items-center gap-1 w-fit mx-auto md:mx-0">
                            <FiStar className="w-3 h-3" />
                            Featured
                          </span>
                        )}
                      </div>

                      <p className="text-gray-500 mt-1">
                        {selectedStudent.level} Level •{" "}
                        {selectedStudent.department}
                      </p>

                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-gray-500 mb-1">
                            Matric Number
                          </h3>
                          <p className="text-gray-900">
                            {selectedStudent.matricNumber}
                          </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-gray-500 mb-1">
                            Contact
                          </h3>
                          <p className="text-gray-900">
                            {selectedStudent.email || "No email provided"}
                          </p>
                          <p className="text-gray-900">
                            {selectedStudent.phone || "No phone provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        About
                      </h3>
                      <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                        {selectedStudent.bio || "No bio provided"}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Favorite Quote
                      </h3>
                      <p className="text-gray-700 italic bg-gray-50 p-4 rounded-lg">
                        "{selectedStudent.quote || "No quote provided"}"
                      </p>
                    </div>

                    {selectedStudent.hobbies && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Hobbies & Interests
                        </h3>
                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                          {selectedStudent.hobbies}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
                    <AnimatedButton
                      onClick={() => setShowDetailsModal(false)}
                      variant="outline"
                    >
                      Close
                    </AnimatedButton>

                    {!selectedStudent.featured && (
                      <AnimatedButton
                        onClick={() => {
                          setShowDetailsModal(false);
                          handleSetFeatured(selectedStudent);
                        }}
                        variant="primary"
                        icon={<FiStar />}
                      >
                        Set as Featured
                      </AnimatedButton>
                    )}

                    {selectedStudent.featured && (
                      <AnimatedButton
                        onClick={() => {
                          setShowDetailsModal(false);
                          router.push(
                            `/admin/generate-card?id=${selectedStudent.id}`
                          );
                        }}
                        variant="secondary"
                        icon={<FiDownload />}
                      >
                        Generate Card
                      </AnimatedButton>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
