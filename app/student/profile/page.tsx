"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedButton from "@/components/AnimatedButton";
import {
  FiUser,
  FiEdit2,
  FiCamera,
  FiSave,
  FiX,
  FiLogOut,
  FiLock,
  FiArrowLeft,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiUpload,
  FiInfo,
  FiHeart,
  FiMail,
  FiPhone,
  FiCalendar,
  FiBookOpen,
  FiUsers,
  FiMeh,
  FiSmile,
  FiStar,
  FiMessageCircle,
  FiGithub,
  FiInstagram,
  FiTwitter,
  FiLinkedin,
  FiMapPin,
  FiAward,
  FiTrendingUp,
  FiZap,
  FiFeather,
  FiCoffee,
  FiMusic,
  FiHeadphones,
  FiWifi,
  FiSun,
  FiMoon,
  FiTarget,
  FiPieChart,
  FiBarChart,
  FiTrendingDown,
  FiRefreshCw,
  FiShield,
  FiGlobe,
  FiLayers,
  FiActivity,
  FiSettings,
} from "react-icons/fi";
import {
  HiAcademicCap,
  HiOutlineRocketLaunch,
  HiChartBar,
} from "react-icons/hi2";
import { IoGameController } from "react-icons/io5";
import Link from "next/link";

export default function StudentProfile() {
  const { user, loading, refreshToken, signOut } = useAuth();
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>({});
  const [isUploading, setIsUploading] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/student/login?redirect=/student/profile");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchStudentData();
    }
  }, [user]);

  const fetchStudentData = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const token = await refreshToken();
      const response = await fetch(`/api/students/user/${user.uid}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!response.ok) {
        throw new Error("Failed to fetch student data");
      }
      const data = await response.json();
      setStudent(data);
      setEditedData(data);
    } catch (error: any) {
      console.error("Error fetching student data:", error);
      toast.error(error.message || "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditToggle = async () => {
    if (!isEditing && user) {
      try {
        await refreshToken();
      } catch (error) {
        console.error("Failed to refresh token before editing:", error);
        toast.error("Authentication error. Please log out and log in again.");
        return;
      }
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditedData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploading(true);

      try {
        const token = await user?.getIdToken(true);
        if (!token) {
          throw new Error("Authentication required");
        }
        const formData = new FormData();
        formData.append("file", file);
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to upload image");
        }
        const uploadData = await uploadResponse.json();
        setEditedData((prev: any) => ({
          ...prev,
          photoURL: uploadData.url,
        }));
        toast.success("Photo uploaded successfully!");
      } catch (error) {
        console.error("Error uploading photo:", error);
        toast.error(
          `Failed to upload photo: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSaveChanges = async () => {
    try {
      if (!editedData.id) {
        toast.error("Missing student ID");
        return;
      }
      let idToken;
      try {
        idToken = await user?.getIdToken(true);
        console.log("Token refreshed successfully for profile update");
      } catch (tokenError) {
        console.error("Failed to refresh token:", tokenError);
        toast.error("Authentication error. Please log out and log in again.");
        return;
      }
      if (!idToken) {
        toast.error(
          "Failed to get authentication token. Please try logging in again."
        );
        return;
      }
      const response = await fetch(`/api/students/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          id: editedData.id,
          updates: editedData,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update profile");
      }
      const updatedData = await response.json();
      setStudent(updatedData.data || updatedData);
      setIsEditing(false);
      toast.success("🎉 Profile updated successfully!", {
        duration: 4000,
        style: {
          background: "#10B981",
          color: "white",
          fontWeight: "bold",
          borderRadius: "12px",
          padding: "12px 20px",
        },
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error("New passwords don't match");
        return;
      }
      if (passwordData.newPassword.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
      const response = await fetch("/api/students/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to change password");
      }
      toast.success("Password changed successfully!");
      setChangePasswordMode(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(error.message || "Failed to change password");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to log out");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      transition: { duration: 0.2 },
    },
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditing) {
        if (e.key === "Escape") {
          e.preventDefault();
          handleEditToggle();
          toast.success("✨ Edit mode cancelled", {
            style: {
              background: "#6B7280",
              color: "white",
              borderRadius: "12px",
            },
          });
        }
        if ((e.metaKey || e.ctrlKey) && e.key === "s") {
          e.preventDefault();
          handleSaveChanges();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEditing, editedData]);

  const hasUnsavedChanges =
    isEditing && JSON.stringify(editedData) !== JSON.stringify(student);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-400 rounded-full mx-auto"
            ></motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 text-lg font-medium"
          >
            Loading your amazing profile...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FiX className="w-10 h-10 text-red-500" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Profile Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            We couldn't find your student profile. Please contact support if
            this issue persists.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AnimatedButton
              onClick={handleLogout}
              variant="outline"
              icon={<FiLogOut />}
            >
              Sign Out
            </AnimatedButton>
            <Link href="/">
              <AnimatedButton variant="primary" icon={<FiArrowLeft />}>
                Back to Home
              </AnimatedButton>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const canEdit = student.canEdit !== false;

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isEditing
          ? "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
          : "bg-gradient-to-br from-slate-50 to-gray-100"
      }`}
    >
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-blue-500/5 pointer-events-none z-0"
          />
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50"
      >
        <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
          <Link
            href="/"
            className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2 group"
          >
            <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>

          <AnimatedButton
            onClick={handleLogout}
            variant="outline"
            size="sm"
            icon={<FiLogOut />}
          >
            Sign Out
          </AnimatedButton>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto p-4 py-8"
      >
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 p-8 mb-8 shadow-2xl"
        >
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <pattern
                  id="heroPattern"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="10" cy="10" r="2" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#heroPattern)" />
            </svg>
          </div>

          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute top-4 left-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-xl border-2 border-white/30 backdrop-blur-md"
            >
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block mr-2"
              >
                ✏️
              </motion.span>
              Edit Mode Active
            </motion.div>
          )}

          {/* --- MODIFIED EDIT BUTTON FOR MOBILE + DESKTOP --- */}
          {!isEditing && canEdit && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{
                scale: 1.1,
                rotate: 5,
                boxShadow: "0 10px 30px rgba(59, 130, 246, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEditToggle}
              className="
                absolute
                top-4
                right-4
                md:top-6 md:right-6
                bg-gradient-to-r from-blue-500 to-purple-500
                hover:from-blue-600 hover:to-purple-600
                text-white
                rounded-full
                transition-all duration-300
                shadow-lg hover:shadow-2xl
                border-2 border-white/30
                backdrop-blur-md
                group
                z-20
                focus:outline-none focus:ring-4 focus:ring-blue-300
                active:scale-90
                flex items-center justify-center
              "
              style={{
                width: "56px",
                height: "56px",
                minWidth: "56px",
                minHeight: "56px",
                padding: 0,
                touchAction: "manipulation",
              }}
              title="Edit Profile"
              aria-label="Edit Profile"
              tabIndex={0}
            >
              <FiEdit2 className="w-7 h-7 md:w-6 md:h-6 group-hover:rotate-12 transition-transform duration-300" />
              <span className="sr-only">Edit Profile</span>
            </motion.button>
          )}

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
            {/* Profile Picture */}
            <motion.div variants={itemVariants} className="relative">
              <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-4 border-white/30 shadow-xl">
                {isEditing ? (
                  <div
                    className="w-full h-full cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {editedData.photoURL ? (
                      <>
                        <img
                          src={editedData.photoURL}
                          alt={editedData.fullName}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <FiCamera className="w-8 h-8 text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-white/20 backdrop-blur-md">
                        <FiCamera className="w-12 h-12 text-white mb-2" />
                        <span className="text-sm text-white font-medium">
                          Upload Photo
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoSelect}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                ) : (
                  <>
                    {student.photoURL ? (
                      <img
                        src={student.photoURL}
                        alt={student.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white/20 backdrop-blur-md text-white">
                        <FiUser className="w-20 h-20" />
                      </div>
                    )}
                  </>
                )}

                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Profile Info */}
            <motion.div
              variants={itemVariants}
              className="flex-1 text-center lg:text-left"
            >
              {isEditing ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <input
                      type="text"
                      name="fullName"
                      value={editedData.fullName}
                      onChange={handleChange}
                      className="text-4xl font-bold text-black bg-white w-full border-3 border-blue-300 rounded-xl px-6 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 shadow-lg placeholder-gray-400"
                      placeholder="Enter your full name"
                      maxLength={100}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2"
                    >
                      <span className="text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
                        {(editedData.fullName || "").length}/100
                      </span>
                      <FiEdit2 className="w-5 h-5 text-blue-500" />
                    </motion.div>
                  </div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-white/90 text-lg font-medium"
                  >
                    ✨ Click anywhere to edit your profile details
                  </motion.p>
                </motion.div>
              ) : (
                <>
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl lg:text-5xl font-bold text-white mb-2"
                  >
                    {student.fullName}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-white/80 mb-4"
                  >
                    {student.level} Level • {student.department}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap justify-center lg:justify-start gap-2"
                  >
                    <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-medium">
                      {student.matricNumber}
                    </span>
                    {student.partTrack && (
                      <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-medium">
                        {student.partTrack}
                      </span>
                    )}
                  </motion.div>
                </>
              )}
            </motion.div>

            {/* Enhanced Action Buttons for Edit Mode */}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex flex-col sm:flex-row gap-3 relative z-10"
              >
                <AnimatedButton
                  onClick={handleEditToggle}
                  variant="outline"
                  icon={<FiX />}
                  className="bg-red-500/20 border-red-300 text-red-700 hover:bg-red-500/30 hover:border-red-400 backdrop-blur-md shadow-lg hover:shadow-xl border-2 font-semibold"
                >
                  <span className="flex items-center gap-2">
                    Cancel Changes
                    <span className="text-xs bg-red-100 px-2 py-1 rounded-full">
                      ESC
                    </span>
                  </span>
                </AnimatedButton>
                <AnimatedButton
                  onClick={handleSaveChanges}
                  variant="primary"
                  icon={<FiSave />}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-2xl border-0 font-semibold transform hover:scale-105 transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    Save Profile
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                      ⌘S
                    </span>
                  </span>
                </AnimatedButton>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Main Profile Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Main Information */}
          <div className="xl:col-span-2 space-y-8">
            {/* Enhanced About Me Section */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className={`rounded-2xl p-8 shadow-xl border transition-all duration-300 ${
                isEditing
                  ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 ring-2 ring-blue-300/50"
                  : "bg-white/80 backdrop-blur-md border-white/20"
              }`}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 mb-6"
              >
                <div
                  className={`rounded-xl p-3 ${
                    isEditing
                      ? "bg-gradient-to-r from-blue-600 to-purple-600"
                      : "bg-gradient-to-r from-blue-500 to-purple-500"
                  }`}
                >
                  <FiUser className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">About Me</h2>
                {isEditing && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-medium"
                  >
                    Editing
                  </motion.span>
                )}
              </motion.div>
              {isEditing ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative"
                >
                  <textarea
                    name="bio"
                    value={editedData.bio || ""}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-4 border-2 border-blue-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 outline-none text-gray-800 bg-white shadow-inner transition-all duration-300 resize-none placeholder-gray-400"
                    placeholder="Tell us about yourself... Share your passions, interests, or anything that makes you unique!"
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {(editedData.bio || "").length}/500 characters
                  </div>
                </motion.div>
              ) : (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-gray-700 leading-relaxed text-lg"
                >
                  {student.bio ||
                    "No bio provided yet. Share something about yourself!"}
                </motion.p>
              )}
            </motion.div>

            {/* Enhanced Personal Details Grid */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className={`rounded-2xl p-8 shadow-xl border transition-all duration-300 ${
                isEditing
                  ? "bg-gradient-to-br from-green-50 to-teal-50 border-green-200 ring-2 ring-green-300/50"
                  : "bg-white/80 backdrop-blur-md border-white/20"
              }`}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 mb-6"
              >
                <div
                  className={`rounded-xl p-3 ${
                    isEditing
                      ? "bg-gradient-to-r from-green-600 to-teal-600"
                      : "bg-gradient-to-r from-green-500 to-teal-500"
                  }`}
                >
                  <FiInfo className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Personal Details
                </h2>
                {isEditing && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium"
                  >
                    Editing
                  </motion.span>
                )}
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Birthday */}
                <motion.div
                  variants={itemVariants}
                  className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-100"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FiCalendar className="w-4 h-4 text-pink-600" />
                    <span className="text-sm font-medium text-pink-600">
                      Birthday
                    </span>
                  </div>
                  {isEditing ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <select
                        name="birthMonth"
                        value={editedData.birthMonth || ""}
                        onChange={handleChange}
                        className="w-full p-3 border-2 border-pink-300 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-200/50 outline-none text-sm bg-white shadow-lg font-semibold text-gray-800 transition-all duration-300"
                      >
                        <option value="">Select Month</option>
                        {[
                          "January",
                          "February",
                          "March",
                          "April",
                          "May",
                          "June",
                          "July",
                          "August",
                          "September",
                          "October",
                          "November",
                          "December",
                        ].map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        name="birthDay"
                        value={editedData.birthDay || ""}
                        onChange={handleChange}
                        min="1"
                        max="31"
                        placeholder="Day (1-31)"
                        className="w-full p-3 border-2 border-pink-300 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-200/50 outline-none text-sm bg-white shadow-lg font-semibold text-gray-800 transition-all duration-300 placeholder-gray-400"
                      />
                    </motion.div>
                  ) : (
                    <p className="text-gray-700 font-medium">
                      {student.birthMonth && student.birthDay
                        ? `${student.birthMonth} ${student.birthDay}`
                        : "Not specified"}
                    </p>
                  )}
                </motion.div>

                {/* Relationship Status */}
                <motion.div
                  variants={itemVariants}
                  className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border border-red-100"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FiHeart className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-600">
                      Relationship
                    </span>
                  </div>
                  {isEditing ? (
                    <motion.select
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      name="relationshipStatus"
                      value={editedData.relationshipStatus || ""}
                      onChange={handleChange}
                      className="w-full p-3 border-2 border-red-300 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-200/50 outline-none text-sm bg-white shadow-lg font-semibold text-gray-800 transition-all duration-300"
                    >
                      <option value="">Choose Status</option>
                      <option value="Single">Single</option>
                      <option value="In a Relationship">
                        In a Relationship
                      </option>
                      <option value="Engaged">Engaged</option>
                      <option value="Married">Married</option>
                      <option value="It's Complicated">It's Complicated</option>
                      <option value="Prefer not to say">
                        Prefer not to say
                      </option>
                    </motion.select>
                  ) : (
                    <p className="text-gray-700 font-medium">
                      {student.relationshipStatus || "Not specified"}
                    </p>
                  )}
                </motion.div>

                {/* Favorite Color */}
                <motion.div
                  variants={itemVariants}
                  className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FiSun className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-600">
                      Favorite Color
                    </span>
                  </div>
                  {isEditing ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <input
                        type="text"
                        name="favoriteColor"
                        value={editedData.favoriteColor || ""}
                        onChange={handleChange}
                        placeholder="Enter color name (e.g., Blue, Red)"
                        className="flex-1 p-3 border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200/50 outline-none text-sm bg-white shadow-lg font-semibold text-gray-800 transition-all duration-300 placeholder-gray-400"
                      />
                      <motion.input
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="color"
                        value={
                          editedData.favoriteColor?.startsWith("#")
                            ? editedData.favoriteColor
                            : "#3b82f6"
                        }
                        onChange={(e) =>
                          setEditedData({
                            ...editedData,
                            favoriteColor: e.target.value,
                          })
                        }
                        className="w-12 h-12 border-2 border-purple-300 rounded-xl cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
                        title="Pick a color"
                      />
                    </motion.div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-gray-700 font-medium">
                        {student.favoriteColor || "Not specified"}
                      </p>
                      {student.favoriteColor?.startsWith("#") && (
                        <div
                          className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: student.favoriteColor }}
                        />
                      )}
                    </div>
                  )}
                </motion.div>

                {/* Hobbies */}
                <motion.div
                  variants={itemVariants}
                  className="md:col-span-2 lg:col-span-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FiZap className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">
                      Hobbies & Interests
                    </span>
                  </div>
                  {isEditing ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative"
                    >
                      <textarea
                        name="hobbies"
                        value={editedData.hobbies || ""}
                        onChange={handleChange}
                        rows={3}
                        className="w-full p-4 border-2 border-blue-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 outline-none text-sm bg-white shadow-lg resize-none font-semibold text-gray-800 transition-all duration-300 placeholder-gray-400"
                        placeholder="Share what you love doing! Gaming, reading, sports, music, cooking, etc."
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-full">
                        {(editedData.hobbies || "").length}/300 characters
                      </div>
                    </motion.div>
                  ) : (
                    <p className="text-gray-700 font-medium">
                      {student.hobbies || "No hobbies specified"}
                    </p>
                  )}
                </motion.div>

                {/* Social Media */}
                <motion.div
                  variants={itemVariants}
                  className="md:col-span-2 lg:col-span-3 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-100"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FiGlobe className="w-4 h-4 text-violet-600" />
                    <span className="text-sm font-medium text-violet-600">
                      Social Media
                    </span>
                  </div>
                  {isEditing ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative"
                    >
                      <textarea
                        name="socials"
                        value={editedData.socials || ""}
                        onChange={handleChange}
                        rows={3}
                        className="w-full p-4 border-2 border-violet-300 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-200/50 outline-none text-sm bg-white resize-none shadow-lg font-semibold text-gray-800 transition-all duration-300 placeholder-gray-400"
                        placeholder="Share your social media handles (Instagram, Twitter, LinkedIn, TikTok, etc.)"
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-full">
                        {(editedData.socials || "").length}/200 characters
                      </div>
                    </motion.div>
                  ) : (
                    <p className="text-gray-700 font-medium">
                      {student.socials || "No social media handles provided"}
                    </p>
                  )}
                </motion.div>
              </div>
            </motion.div>

            {/* Academic Journey */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl p-3">
                  <HiAcademicCap className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Academic Journey
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Specialization Track */}
                <motion.div
                  variants={itemVariants}
                  className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FiTarget className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-600">
                      Specialization Track
                    </span>
                  </div>
                  {isEditing ? (
                    <select
                      name="partTrack"
                      value={editedData.partTrack || ""}
                      onChange={handleChange}
                      className="w-full p-3 border border-emerald-200 rounded-lg text-black focus:border-emerald-500 outline-none bg-white"
                    >
                      <option value="">Choose Track</option>
                      <option value="Linguistics">Linguistics</option>
                      <option value="Communication">Communication</option>
                      <option value="Both">Both</option>
                    </select>
                  ) : (
                    <p className="text-gray-700 font-medium">
                      {student.partTrack || "Not specified"}
                    </p>
                  )}
                </motion.div>

                {/* Favorite Course */}
                <motion.div
                  variants={itemVariants}
                  className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-100"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FiBookOpen className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-600">
                      Favorite Course
                    </span>
                  </div>
                  {isEditing ? (
                    <motion.input
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      type="text"
                      name="favoriteCourse"
                      value={editedData.favoriteCourse || ""}
                      onChange={handleChange}
                      className="w-full p-3 border-2 border-amber-300 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-200/50 outline-none bg-white shadow-lg font-semibold text-gray-800 transition-all duration-300 placeholder-gray-400"
                      placeholder="e.g., LIN301 - Semantics, COM215 - Digital Communication"
                    />
                  ) : (
                    <p className="text-gray-700 font-medium">
                      {student.favoriteCourse || "Not specified"}
                    </p>
                  )}
                </motion.div>

                {/* Shege Course */}
                <motion.div
                  variants={itemVariants}
                  className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-100"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FiMeh className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-600">
                      Shege Course
                    </span>
                  </div>
                  {isEditing ? (
                    <motion.input
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      type="text"
                      name="shegeCourse"
                      value={editedData.shegeCourse || ""}
                      onChange={handleChange}
                      className="w-full p-3 border-2 border-red-300 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-200/50 outline-none bg-white shadow-lg font-semibold text-gray-800 transition-all duration-300 placeholder-gray-400"
                      placeholder="The most challenging course (e.g., LIN308 - Advanced Phonetics)"
                    />
                  ) : (
                    <p className="text-gray-700 font-medium">
                      {student.shegeCourse || "Not specified"}
                    </p>
                  )}
                </motion.div>

                {/* Favorite Lecturer */}
                <motion.div
                  variants={itemVariants}
                  className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-100"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FiUsers className="w-4 h-4 text-teal-600" />
                    <span className="text-sm font-medium text-teal-600">
                      Favorite Lecturer
                    </span>
                  </div>
                  {isEditing ? (
                    <motion.input
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      type="text"
                      name="favoriteLecturer"
                      value={editedData.favoriteLecturer || ""}
                      onChange={handleChange}
                      className="w-full p-3 border-2 border-teal-300 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-200/50 outline-none bg-white shadow-lg font-semibold text-gray-800 transition-all duration-300 placeholder-gray-400"
                      placeholder="Your most inspiring lecturer (e.g., Dr. Johnson, Prof. Smith)"
                    />
                  ) : (
                    <p className="text-gray-700 font-medium">
                      {student.favoriteLecturer || "Not specified"}
                    </p>
                  )}
                </motion.div>

                {/* Favorite Level */}
                <motion.div
                  variants={itemVariants}
                  className="bg-gradient-to-br from-lime-50 to-green-50 rounded-xl p-4 border border-lime-100"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FiTrendingUp className="w-4 h-4 text-lime-600" />
                    <span className="text-sm font-medium text-lime-600">
                      Favorite Level
                    </span>
                  </div>
                  {isEditing ? (
                    <motion.select
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      name="favoriteLevel"
                      value={editedData.favoriteLevel || ""}
                      onChange={handleChange}
                      className="w-full p-3 border-2 border-lime-300 rounded-xl focus:border-lime-500 focus:ring-4 focus:ring-lime-200/50 outline-none bg-white shadow-lg font-semibold text-gray-800 transition-all duration-300"
                    >
                      <option value="">Select Your Favorite Level</option>
                      <option value="100 Level">100 Level</option>
                      <option value="200 Level">200 Level</option>
                      <option value="300 Level">300 Level</option>
                      <option value="400 Level">400 Level</option>
                      <option value="All Levels">All Levels</option>
                    </motion.select>
                  ) : (
                    <p className="text-gray-700 font-medium">
                      {student.favoriteLevel || "Not specified"}
                    </p>
                  )}
                </motion.div>

                {/* Shege Level */}
                <motion.div
                  variants={itemVariants}
                  className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FiTrendingDown className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-600">
                      Shege Level
                    </span>
                  </div>
                  {isEditing ? (
                    <motion.select
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      name="shegeLevel"
                      value={editedData.shegeLevel || ""}
                      onChange={handleChange}
                      className="w-full p-3 border-2 border-orange-300 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-200/50 outline-none bg-white shadow-lg font-semibold text-gray-800 transition-all duration-300"
                    >
                      <option value="">Select Most Challenging Level</option>
                      <option value="100 Level">100 Level</option>
                      <option value="200 Level">200 Level</option>
                      <option value="300 Level">300 Level</option>
                      <option value="400 Level">400 Level</option>
                      <option value="All Levels">All Levels</option>
                    </motion.select>
                  ) : (
                    <p className="text-gray-700 font-medium">
                      {student.shegeLevel || "Not specified"}
                    </p>
                  )}
                </motion.div>
              </div>
            </motion.div>

            {/* Memory Lane */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl p-3">
                  <FiStar className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Memory Lane
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Best Moment */}
                <motion.div
                  variants={itemVariants}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FiSmile className="w-5 h-5 text-green-600" />
                    <span className="text-lg font-semibold text-green-600">
                      Best Moment
                    </span>
                  </div>
                  {isEditing ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative"
                    >
                      <textarea
                        name="bestMoment"
                        value={editedData.bestMoment || ""}
                        onChange={handleChange}
                        rows={4}
                        className="w-full p-4 border-2 border-green-300 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-200/50 outline-none bg-white resize-none shadow-lg font-semibold text-gray-800 transition-all duration-300 placeholder-gray-400"
                        placeholder="Share your most memorable and joyful experience in the department..."
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-full">
                        {(editedData.bestMoment || "").length}/400 characters
                      </div>
                    </motion.div>
                  ) : (
                    <p className="text-gray-700 leading-relaxed">
                      {student.bestMoment || "No best moment shared yet"}
                    </p>
                  )}
                </motion.div>

                {/* Worst Moment */}
                <motion.div
                  variants={itemVariants}
                  className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FiMeh className="w-5 h-5 text-amber-600" />
                    <span className="text-lg font-semibold text-amber-600">
                      Challenging Moment
                    </span>
                  </div>
                  {isEditing ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative"
                    >
                      <textarea
                        name="worstMoment"
                        value={editedData.worstMoment || ""}
                        onChange={handleChange}
                        rows={4}
                        className="w-full p-4 border-2 border-amber-300 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-200/50 outline-none bg-white resize-none shadow-lg font-semibold text-gray-800 transition-all duration-300 placeholder-gray-400"
                        placeholder="Share a challenging moment that helped you grow..."
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-full">
                        {(editedData.worstMoment || "").length}/400 characters
                      </div>
                    </motion.div>
                  ) : (
                    <p className="text-gray-700 leading-relaxed">
                      {student.worstMoment ||
                        "No challenging moment shared yet"}
                    </p>
                  )}
                </motion.div>
              </div>
            </motion.div>

            {/* Life Reflections */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl p-3">
                  <FiFeather className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Life Reflections
                </h2>
              </motion.div>

              <div className="space-y-6">
                {/* Favorite Quote */}
                <motion.div
                  variants={itemVariants}
                  className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FiMessageCircle className="w-5 h-5 text-indigo-600" />
                    <span className="text-lg font-semibold text-indigo-600">
                      Favorite Quote
                    </span>
                  </div>
                  {isEditing ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative"
                    >
                      <textarea
                        name="quote"
                        value={editedData.quote || ""}
                        onChange={handleChange}
                        rows={3}
                        className="w-full p-4 border-2 border-indigo-300 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200/50 outline-none bg-white resize-none shadow-lg font-semibold text-gray-800 transition-all duration-300 placeholder-gray-400"
                        placeholder="Share an inspiring quote that motivates you daily..."
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-full">
                        {(editedData.quote || "").length}/200 characters
                      </div>
                    </motion.div>
                  ) : (
                    <blockquote className="text-gray-700 italic text-lg leading-relaxed">
                      "{student.quote || "No favorite quote shared yet"}"
                    </blockquote>
                  )}
                </motion.div>

                {/* If Not Linguistics */}
                <motion.div
                  variants={itemVariants}
                  className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-100"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <HiOutlineRocketLaunch className="w-5 h-5 text-rose-600" />
                    <span className="text-lg font-semibold text-rose-600">
                      Alternative Studies
                    </span>
                  </div>
                  {isEditing ? (
                    <motion.input
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      type="text"
                      name="ifNotLinguistics"
                      value={editedData.ifNotLinguistics || ""}
                      onChange={handleChange}
                      className="w-full p-3 border-2 border-rose-300 rounded-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-200/50 outline-none bg-white shadow-lg font-semibold text-gray-800 transition-all duration-300 placeholder-gray-400"
                      placeholder="If not Linguistics, what field would have captured your interest? (e.g., Medicine, Engineering)"
                    />
                  ) : (
                    <p className="text-gray-700 text-lg">
                      {student.ifNotLinguistics || "Not specified"}
                    </p>
                  )}
                </motion.div>

                {/* Advice for Juniors */}
                <motion.div
                  variants={itemVariants}
                  className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FiAward className="w-5 h-5 text-emerald-600" />
                    <span className="text-lg font-semibold text-emerald-600">
                      Advice for Juniors
                    </span>
                  </div>
                  {isEditing ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative"
                    >
                      <textarea
                        name="advice"
                        value={editedData.advice || ""}
                        onChange={handleChange}
                        rows={4}
                        className="w-full p-4 border-2 border-emerald-300 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200/50 outline-none bg-white resize-none shadow-lg font-semibold text-gray-800 transition-all duration-300 placeholder-gray-400"
                        placeholder="Share wisdom and guidance for students starting their linguistic journey..."
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-full">
                        {(editedData.advice || "").length}/500 characters
                      </div>
                    </motion.div>
                  ) : (
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {student.advice || "No advice shared yet"}
                    </p>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Contact & Security */}
          <div className="space-y-8">
            {/* Contact Information */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl p-3">
                  <FiMail className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Contact Info
                </h2>
              </motion.div>

              <div className="space-y-4">
                {/* Matric Number */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <FiActivity className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Matric Number
                    </p>
                    <p className="text-gray-700 font-medium">
                      {student.matricNumber}
                    </p>
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div variants={itemVariants}>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FiMail className="w-4 h-4 text-gray-600" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Email
                      </p>
                      {isEditing ? (
                        <motion.input
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          type="email"
                          name="email"
                          value={editedData.email || ""}
                          onChange={handleChange}
                          className="w-full mt-1 p-3 border-2 border-blue-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 outline-none bg-white text-sm shadow-lg font-semibold text-gray-800 transition-all duration-300 placeholder-gray-400"
                          placeholder="Enter your email address"
                        />
                      ) : (
                        <p className="text-gray-700 font-medium">
                          {student.email || "No email provided"}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Phone */}
                <motion.div variants={itemVariants}>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FiPhone className="w-4 h-4 text-gray-600" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Phone
                      </p>
                      {isEditing ? (
                        <motion.input
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          type="tel"
                          name="phone"
                          value={editedData.phone || ""}
                          onChange={handleChange}
                          className="w-full mt-1 p-3 border-2 border-green-300 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-200/50 outline-none bg-white text-sm shadow-lg font-semibold text-gray-800 transition-all duration-300 placeholder-gray-400"
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <p className="text-gray-700 font-medium">
                          {student.phone || "No phone provided"}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Department & Level */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <HiAcademicCap className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Academic Info
                    </p>
                    <p className="text-gray-700 font-medium">
                      {student.level} Level • {student.department}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Account Security */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-3">
                  <FiShield className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Security</h2>
              </motion.div>

              {!changePasswordMode ? (
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setChangePasswordMode(true)}
                  disabled={!canEdit}
                  className={`w-full py-3 px-4 rounded-xl border-2 border-red-200 text-red-600 font-medium flex items-center justify-center gap-2 hover:bg-red-50 transition-all ${
                    !canEdit ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FiLock className="w-4 h-4" />
                  <span>Change Password</span>
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-sm text-gray-600 block mb-2 font-medium">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full pr-10 p-3 border-2 border-gray-200 rounded-xl focus:border-red-500 outline-none bg-white"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
                          <FiEyeOff className="w-4 h-4" />
                        ) : (
                          <FiEye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-2 font-medium">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full pr-10 p-3 border-2 border-gray-200 rounded-xl focus:border-red-500 outline-none bg-white"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <FiEyeOff className="w-4 h-4" />
                        ) : (
                          <FiEye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-2 font-medium">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-red-500 outline-none bg-white"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setChangePasswordMode(false)}
                      className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleChangePassword}
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:from-red-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2"
                    >
                      <FiCheck className="w-4 h-4" />
                      <span>Update</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Floating Save Reminder */}
      <AnimatePresence>
        {hasUnsavedChanges && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ⚡
                </motion.div>
                <div>
                  <p className="font-semibold">You have unsaved changes!</p>
                  <p className="text-sm text-white/90">
                    Don't forget to save your profile updates
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveChanges}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
                  >
                    <FiSave className="w-4 h-4" />
                    Save Now
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Notice */}
      {!canEdit && (
        <div className="max-w-7xl mx-auto p-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-yellow-800">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiInfo className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm">
                  Your profile is currently featured as Personality of the Week.
                  You cannot make changes while featured.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
