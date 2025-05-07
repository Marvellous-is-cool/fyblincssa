"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import AnimatedButton from "@/components/AnimatedButton";
import toast from "react-hot-toast";
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
} from "react-icons/fi";
import Link from "next/link";

export default function StudentProfile() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  const [studentData, setStudentData] = useState<any>(null);
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
    // Redirect if not logged in
    if (!loading && !user) {
      router.push("/student/login");
      return;
    }

    if (user) {
      fetchStudentData();
    }
  }, [user, loading, router]);

  const fetchStudentData = async () => {
    try {
      setIsLoading(true);

      // Fetch the student's data from the API
      const response = await fetch(`/api/students/user/${user?.uid}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch student data: ${response.statusText}`);
      }

      const data = await response.json();
      setStudentData(data);
      setEditedData(data);
    } catch (error) {
      console.error("Error fetching student data:", error);
      toast.error("Failed to load your profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset to original data
      setEditedData(studentData);
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
        // Create form data for upload
        const formData = new FormData();
        formData.append("file", file);

        // Upload to Cloudinary through our API
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image");
        }

        const uploadData = await uploadResponse.json();

        // Update local state
        setEditedData((prev: any) => ({
          ...prev,
          photoURL: uploadData.url,
        }));

        toast.success("Photo uploaded successfully!");
      } catch (error) {
        console.error("Error uploading photo:", error);
        toast.error("Failed to upload photo");
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

      const response = await fetch(`/api/students/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
      setStudentData(updatedData);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    try {
      // Validate passwords
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

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiX className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-medium text-gray-700 mb-2">
            Profile Not Found
          </h2>
          <p className="text-gray-500 mb-6">
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
        </div>
      </div>
    );
  }

  // Check if student can't edit their profile (because they're featured)
  const canEdit = studentData.canEdit !== false;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-4 py-12 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/"
            className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2"
          >
            <FiArrowLeft className="w-4 h-4" />
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

        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header/Cover Image */}
          <div className="h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
            {!isEditing && canEdit && (
              <button
                onClick={handleEditToggle}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/30 transition-colors"
              >
                <FiEdit2 className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Profile Content */}
          <div className="px-6 pb-8 md:px-10 -mt-20 relative">
            {/* Profile Picture */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-10">
              <div className="relative mx-auto md:mx-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl border-4 border-white overflow-hidden shadow-lg bg-white">
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
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <FiCamera className="w-8 h-8 text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                          <FiCamera className="w-10 h-10 text-gray-400 mb-2" />
                          <span className="text-xs text-gray-500">
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
                      {studentData.photoURL ? (
                        <img
                          src={studentData.photoURL}
                          alt={studentData.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                          <FiUser className="w-16 h-16" />
                        </div>
                      )}
                    </>
                  )}
                </div>
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl">
                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Basic Information */}
              <div className="flex-1 text-center md:text-left mt-4 md:mt-16">
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="fullName"
                      value={editedData.fullName}
                      onChange={handleChange}
                      className="text-2xl font-bold text-gray-900 w-full border-b-2 border-gray-200 focus:border-primary px-2 py-1 outline-none text-black"
                      placeholder="Your Name"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {studentData.fullName}
                    </h1>
                  </>
                )}

                {/* Edit/Save Buttons - Mobile */}
                <div className="flex justify-center md:hidden mt-4 space-x-2">
                  {isEditing && (
                    <>
                      <AnimatedButton
                        onClick={handleEditToggle}
                        variant="outline"
                        size="sm"
                        icon={<FiX />}
                      >
                        Cancel
                      </AnimatedButton>
                      <AnimatedButton
                        onClick={handleSaveChanges}
                        variant="primary"
                        size="sm"
                        icon={<FiSave />}
                      >
                        Save Changes
                      </AnimatedButton>
                    </>
                  )}
                </div>
              </div>

              {/* Edit/Save Buttons - Desktop */}
              {isEditing && (
                <div className="hidden md:flex items-start space-x-2 mt-16">
                  <AnimatedButton
                    onClick={handleEditToggle}
                    variant="outline"
                    size="sm"
                    icon={<FiX />}
                  >
                    Cancel
                  </AnimatedButton>
                  <AnimatedButton
                    onClick={handleSaveChanges}
                    variant="primary"
                    size="sm"
                    icon={<FiSave />}
                  >
                    Save Changes
                  </AnimatedButton>
                </div>
              )}
            </div>

            {/* Main Profile Sections */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-8 space-y-6">
                {/* About Section */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    About Me
                  </h2>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={editedData.bio || ""}
                      onChange={handleChange}
                      rows={4}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none text-black"
                      placeholder="Tell us about yourself"
                    />
                  ) : (
                    <p className="text-gray-700">
                      {studentData.bio || "No bio provided"}
                    </p>
                  )}
                </div>

                {/* Quote Section */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Favorite Quote
                  </h2>
                  {isEditing ? (
                    <input
                      type="text"
                      name="quote"
                      value={editedData.quote || ""}
                      onChange={handleChange}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none text-black"
                      placeholder="Your favorite quote"
                    />
                  ) : (
                    <p className="text-gray-700 italic">
                      "{studentData.quote || "No quote provided"}"
                    </p>
                  )}
                </div>

                {/* Hobbies Section */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Hobbies & Interests
                  </h2>
                  {isEditing ? (
                    <input
                      type="text"
                      name="hobbies"
                      value={editedData.hobbies || ""}
                      onChange={handleChange}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none text-black"
                      placeholder="Your hobbies & interests"
                    />
                  ) : (
                    <p className="text-gray-700">
                      {studentData.hobbies || "No hobbies provided"}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-4 space-y-6">
                {/* Contact Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Contact Information
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Matric Number</p>
                      <p className="text-gray-700">
                        {studentData.matricNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={editedData.email || ""}
                          onChange={handleChange}
                          className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none text-black"
                          placeholder="Your email"
                        />
                      ) : (
                        <p className="text-gray-700">
                          {studentData.email || "No email provided"}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={editedData.phone || ""}
                          onChange={handleChange}
                          className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none text-black"
                          placeholder="Your phone number"
                        />
                      ) : (
                        <p className="text-gray-700">
                          {studentData.phone || "No phone provided"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Academic Details */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Academic Details
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Loved Part</p>
                      {isEditing ? (
                        <select
                          name="partTrack"
                          value={editedData.partTrack || ""}
                          onChange={handleChange}
                          className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none text-black"
                        >
                          <option value="Linguistics">Linguistics</option>
                          <option value="Communication">Communication</option>
                          <option value="Both">Both</option>
                        </select>
                      ) : (
                        <p className="text-gray-700">
                          {studentData.partTrack || "Not specified"}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Favorite Course</p>
                      {isEditing ? (
                        <input
                          type="text"
                          name="favoriteCourse"
                          value={editedData.favoriteCourse || ""}
                          onChange={handleChange}
                          className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none text-black"
                          placeholder="e.g., LIN301"
                        />
                      ) : (
                        <p className="text-gray-700">
                          {studentData.favoriteCourse || "Not specified"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Account Security */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Account Security
                  </h2>
                  {!changePasswordMode ? (
                    <button
                      onClick={() => setChangePasswordMode(true)}
                      disabled={!canEdit}
                      className={`w-full py-2 px-4 rounded-lg border-2 border-primary text-primary font-medium flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors ${
                        !canEdit ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <FiLock className="w-4 h-4" />
                      <span>Change Password</span>
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-500 block mb-1">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full pr-10 p-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none text-black"
                            placeholder="Current password"
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
                        <label className="text-sm text-gray-500 block mb-1">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full pr-10 p-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none text-black"
                            placeholder="New password"
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
                        <label className="text-sm text-gray-500 block mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none text-black"
                          placeholder="Confirm new password"
                        />
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <button
                          onClick={() => setChangePasswordMode(false)}
                          className="flex-1 py-2 px-4 rounded-lg border-2 border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleChangePassword}
                          className="flex-1 py-2 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                        >
                          <FiCheck className="w-4 h-4" />
                          <span>Update</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Edit Notice */}
            {!canEdit && (
              <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 text-yellow-800">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiInfo className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">
                      Your profile is currently featured as Personality of the
                      Week. You cannot make changes while featured.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
