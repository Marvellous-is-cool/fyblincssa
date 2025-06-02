import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { FiSave, FiX, FiLoader } from "react-icons/fi";
import toast from "react-hot-toast";

interface EditProfileFormProps {
  studentId: string;
  studentData: any;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function EditProfileForm({
  studentId,
  studentData,
  onCancel,
  onSuccess,
}: EditProfileFormProps) {
  const [formData, setFormData] = useState({
    fullName: studentData?.fullName || "",
    email: studentData?.email || "",
    phone: studentData?.phone || "",
    bio: studentData?.bio || "",
    quote: studentData?.quote || "",
    hobbies: studentData?.hobbies || "",
    achievements: studentData?.achievements || "",
    specializationTrack: studentData?.specializationTrack || "",
    favoriteCourse: studentData?.favoriteCourse || "",
    bestMoment: studentData?.bestMoment || "",
    worstMoment: studentData?.worstMoment || "",
    favoriteLevel: studentData?.favoriteLevel || "",
    shegeLevel: studentData?.shegeLevel || "",
    birthMonth: studentData?.birthMonth || "",
    birthDay: studentData?.birthDay || "",
    relationshipStatus: studentData?.relationshipStatus || "",
    favoriteColor: studentData?.favoriteColor || "",
    favoriteLecturer: studentData?.favoriteLecturer || "",
    shegeCourse: studentData?.shegeCourse || "",
    socials: studentData?.socials || "",
    advice: studentData?.advice || "",
    ifNotLinguistics: studentData?.ifNotLinguistics || "",
    partTract: studentData?.partTract || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to update your profile");
      return;
    }

    if (!studentId) {
      toast.error("Student ID is missing");
      return;
    }

    try {
      setIsSubmitting(true);

      // Force a token refresh to ensure we have a valid token
      // This is crucial for avoiding 401 errors
      let idToken;
      try {
        idToken = await user.getIdToken(true);
        console.log("Token refreshed successfully");
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

      console.log("Submitting profile update with auth token...");

      const response = await fetch("/api/students/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          id: studentId,
          updates: formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error(
            data.error ||
              "Authentication error. Please log out and log in again."
          );
        }
        throw new Error(data.error || "Failed to update profile");
      }

      toast.success("Profile updated successfully!");
      onSuccess();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const monthOptions = [
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
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Edit Your Profile
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Relationship Status
            </label>
            <select
              name="relationshipStatus"
              value={formData.relationshipStatus}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select Status</option>
              <option value="Single">Single</option>
              <option value="In a Relationship">In a Relationship</option>
              <option value="Engaged">Engaged</option>
              <option value="Married">Married</option>
              <option value="It's Complicated">It's Complicated</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Birth Month
            </label>
            <select
              name="birthMonth"
              value={formData.birthMonth}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select Month</option>
              {monthOptions.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Birth Day
            </label>
            <input
              type="number"
              name="birthDay"
              value={formData.birthDay}
              onChange={handleChange}
              min="1"
              max="31"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Day of month (e.g., 15)"
            />
          </div>
        </div>

        {/* Bio and Quote */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Tell us about yourself..."
          ></textarea>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Favorite Quote
          </label>
          <textarea
            name="quote"
            value={formData.quote}
            onChange={handleChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Your favorite quote..."
          ></textarea>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Socials (Instagram, Twitter, etc.)
          </label>
          <textarea
            name="socials"
            value={formData.socials}
            onChange={handleChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Your social media handles..."
          ></textarea>
        </div>

        {/* Academic Information */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specialization Track
            </label>
            <select
              name="specializationTrack"
              value={formData.specializationTrack}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select Track</option>
              <option value="Linguistic Analysis">Linguistic Analysis</option>
              <option value="Communication Studies">
                Communication Studies
              </option>
              <option value="Language & Society">Language & Society</option>
              <option value="Both">Both</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Favorite Course
            </label>
            <input
              type="text"
              name="favoriteCourse"
              value={formData.favoriteCourse}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="E.g., LIN 314"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shege Course
            </label>
            <input
              type="text"
              name="shegeCourse"
              value={formData.shegeCourse}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="E.g., LIN 307"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Favorite Lecturer
            </label>
            <input
              type="text"
              name="favoriteLecturer"
              value={formData.favoriteLecturer}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Favorite Level
            </label>
            <select
              name="favoriteLevel"
              value={formData.favoriteLevel}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select Level</option>
              <option value="100">100 Level</option>
              <option value="200">200 Level</option>
              <option value="300">300 Level</option>
              <option value="400">400 Level</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shege Level
            </label>
            <select
              name="shegeLevel"
              value={formData.shegeLevel}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select Level</option>
              <option value="100">100 Level</option>
              <option value="200">200 Level</option>
              <option value="300">300 Level</option>
              <option value="400">400 Level</option>
            </select>
          </div>
        </div>

        {/* Personal Experiences */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Best Moment in LINCSSA
          </label>
          <textarea
            name="bestMoment"
            value={formData.bestMoment}
            onChange={handleChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          ></textarea>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Worst Moment in LINCSSA
          </label>
          <textarea
            name="worstMoment"
            value={formData.worstMoment}
            onChange={handleChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          ></textarea>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hobbies & Interests
          </label>
          <textarea
            name="hobbies"
            value={formData.hobbies}
            onChange={handleChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          ></textarea>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            If not Linguistics, what would you have studied?
          </label>
          <input
            type="text"
            name="ifNotLinguistics"
            value={formData.ifNotLinguistics}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Advice for Juniors
          </label>
          <textarea
            name="advice"
            value={formData.advice}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="What advice would you give to incoming students?"
          ></textarea>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
          disabled={isSubmitting}
        >
          <FiX className="w-4 h-4" />
          Cancel
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <FiLoader className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <FiSave className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}
