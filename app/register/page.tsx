"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedButton from "@/components/AnimatedButton";
import toast from "react-hot-toast";
import {
  FiCamera,
  FiCheckCircle,
  FiArrowRight,
  FiUpload,
  FiArrowLeft,
  FiInfo,
  FiUser,
  FiEye,
} from "react-icons/fi";

export default function Registration() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const matric = searchParams.get("matric");

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    matricNumber: matric || "",
    fullName: "",
    level: "400", // Pre-set to 400 level
    department: "Linguistics and Communication Studies",
    quote: "",
    bio: "",
    hobbies: "",
    email: "",
    // New fields
    birthMonth: "",
    birthDay: "",
    relationshipStatus: "",
    socials: "",
    partTrack: "Linguistics", // "Linguistics", "Communication", "Both"
    favoriteLevel: "",
    shegeLevel: "",
    favoriteCourse: "",
    shegeCourse: "",
    worstMoment: "",
    bestMoment: "",
    favoriteLecturer: "",
    ifNotLinguistics: "",
    favoriteColor: "",
    advice: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Redirect if no matric number is provided
    if (!matric) {
      toast.error("Please enter your matric number first");
      router.push("/");
    }
  }, [matric, router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPhotoURL(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.level) {
        toast.error("Please fill in all required fields");
        return;
      }
    } else if (step === 2) {
      if (!formData.quote || !formData.bio) {
        toast.error("Please provide a quote and brief bio");
        return;
      }
    } else if (step === 5) {
      if (!photoURL) {
        toast.error("Please upload your photo");
        return;
      }
    } else if (step === 6) {
      // Move to password creation step instead of submitting
      setStep(7);
      window.scrollTo(0, 0);
      return;
    }

    window.scrollTo(0, 0);
    setStep((prev) => prev + 1);
  };

  const handlePreview = () => {
    setPreviewMode(true);
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
    setPreviewMode(false);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      console.log("Starting registration process...");

      // Check if passwords match (for the new password step)
      if (step === 7 && formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match!");
        setIsSubmitting(false);
        return;
      }

      let imageUrl = "";

      // Upload photo to Cloudinary if available
      if (photoFile) {
        try {
          console.log("Uploading photo to Cloudinary...");
          const formData = new FormData();
          formData.append("file", photoFile);

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(
              `Failed to upload image: ${response.status} ${response.statusText}`
            );
          }

          const data = await response.json();
          console.log("Cloudinary upload successful:", data);
          imageUrl = data.url;
        } catch (imageError) {
          console.error("Error uploading image:", imageError);
          toast.error(
            "Image upload failed, but continuing with form submission"
          );
        }
      }

      try {
        // Create submission payload
        const submissionData = {
          ...formData,
          photoURL: imageUrl,
        };

        console.log("Submitting to registration API...");

        // Use server API endpoint instead of direct Firestore access
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Server error");
        }

        const result = await response.json();
        console.log("Registration successful:", result);

        // Show success message
        toast.success("Registration successful!");

        // Redirect to success page
        setTimeout(() => {
          router.push("/register/success");
        }, 2000);
      } catch (apiError) {
        console.error("API error:", apiError);

        // Save data to localStorage as fallback
        localStorage.setItem(
          "studentRegistration",
          JSON.stringify({
            ...formData,
            photoURL: imageUrl,
            timestamp: new Date().toISOString(),
          })
        );

        toast.success("Registration saved locally (offline mode)");
        setTimeout(() => {
          router.push("/register/success");
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3 } },
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={formVariants}
            className="space-y-6"
          >
            <h2 className="text-2xl font-display font-bold text-lincssa-blue mb-6">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Matric Number
                </label>
                <input
                  type="text"
                  name="matricNumber"
                  value={formData.matricNumber}
                  className="w-full p-3 rounded-lg border-2 border-gray-200 bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-black"
                  placeholder="Enter matric number"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-black"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={formVariants}
            className="space-y-6"
          >
            <h2 className="text-2xl font-display font-bold text-lincssa-blue mb-6 text-black">
              About You
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Favorite Quote <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="quote"
                value={formData.quote}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-black"
                placeholder="Share a quote that inspires you"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brief Bio <span className="text-red-500">*</span>
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-black"
                placeholder="Tell us about yourself (max 200 words)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hobbies & Skills
              </label>
              <input
                type="text"
                name="hobbies"
                value={formData.hobbies}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-black"
                placeholder="What do you enjoy doing?"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Birth Month
                </label>
                <select
                  name="birthMonth"
                  value={formData.birthMonth}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-black"
                >
                  <option value="">Select Month</option>
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Birth Day
                </label>
                <input
                  type="number"
                  name="birthDay"
                  min="1"
                  max="31"
                  value={formData.birthDay}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-black"
                  placeholder="Day of birth"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relationship Status
              </label>
              <select
                name="relationshipStatus"
                value={formData.relationshipStatus}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-black"
              >
                <option value="">Choose Status</option>
                <option value="Single">Single</option>
                <option value="In a Relationship">In a Relationship</option>
                <option value="Complicated">It's Complicated</option>
                <option value="Married">Married</option>
                <option value="Private">Rather Not Say</option>
                <option value="Married">Married</option>
                <option value="trying">How i wan explain bayi</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Social Media Handles
              </label>
              <input
                type="text"
                name="socials"
                value={formData.socials}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-black"
                placeholder="Share your Instagram, Twitter, or other handles"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Which do you like more?
              </label>
              <select
                name="partTrack"
                value={formData.partTrack}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-black"
              >
                <option value="Linguistics">Linguistics</option>
                <option value="Communication">Communication</option>
                <option value="Both">Both</option>
              </select>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={formVariants}
            className="space-y-6"
          >
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
              Academic Journey
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Favorite Level
                </label>
                <select
                  name="favoriteLevel"
                  value={formData.favoriteLevel}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-black"
                >
                  <option value="">Select Level</option>
                  <option value="no Level">No Level</option>
                  <option value="100 Level">100 Level</option>
                  <option value="200 Level">200 Level</option>
                  <option value="300 Level">300 Level</option>
                  <option value="400 Level">400 Level</option>
                  <option value="all Level">All Level</option>
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
                  className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-black"
                >
                  <option value="">Select Level</option>
                  <option value="no Level">No Level</option>
                  <option value="100 Level">100 Level</option>
                  <option value="200 Level">200 Level</option>
                  <option value="300 Level">300 Level</option>
                  <option value="400 Level">400 Level</option>
                  <option value="all Level">All Level</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Favorite Course
                </label>
                <input
                  type="text"
                  name="favoriteCourse"
                  value={formData.favoriteCourse}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-black"
                  placeholder="e.g., LIN301, COM215"
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
                  className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-black"
                  placeholder="The toughest course you faced"
                />
              </div>
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
                className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-black"
                placeholder="Which lecturer inspired you the most?"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Best Moment
                </label>
                <textarea
                  name="bestMoment"
                  value={formData.bestMoment}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-black"
                  placeholder="Your best memory in the department"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Worst Moment
                </label>
                <textarea
                  name="worstMoment"
                  value={formData.worstMoment}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-black"
                  placeholder="A challenging moment from your journey"
                />
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={formVariants}
            className="space-y-6"
          >
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
              Final Thoughts
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                If Not Linguistics, What Then?
              </label>
              <input
                type="text"
                name="ifNotLinguistics"
                value={formData.ifNotLinguistics}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-black"
                placeholder="What would you have studied instead?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Favorite Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  name="favoriteColor"
                  value={formData.favoriteColor}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-black"
                  placeholder="What's your favorite color?"
                />
                <input
                  type="color"
                  onChange={(e) =>
                    setFormData({ ...formData, favoriteColor: e.target.value })
                  }
                  className="h-10 w-10 rounded cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Advice for Juniors
              </label>
              <textarea
                name="advice"
                value={formData.advice}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-black"
                placeholder="What advice would you give to upcoming students?"
              />
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step5"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={formVariants}
            className="space-y-6"
          >
            <h2 className="text-2xl font-display font-bold text-lincssa-blue mb-6">
              Upload Your Photo
            </h2>

            <div className="text-center">
              <div
                className="w-64 h-64 mx-auto relative mb-6 cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt="Selected Photo"
                    className="w-full h-full object-cover rounded-lg border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary transition-colors">
                    <FiCamera className="w-16 h-16 text-gray-400 mb-2" />
                    <p className="text-gray-500 font-medium">
                      Click to upload photo
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Professional headshot recommended
                    </p>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bg-white text-primary rounded-full p-2">
                    <FiUpload className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoSelect}
                accept="image/*"
                className="hidden"
                required
              />

              <p className="text-sm text-gray-500 mt-2">
                Please upload a clear photo. This will be used for your
                personality card.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-black"
                  placeholder="Your email address"
                  required
                />
              </div>
            </div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            key="step6"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={formVariants}
            className="space-y-8"
          >
            <h2 className="text-2xl font-display font-bold text-lincssa-blue mb-6">
              {previewMode ? "Preview Your Information" : "Review & Submit"}
            </h2>

            {!previewMode ? (
              <div className="text-center py-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-primary/5 rounded-xl p-6 mb-8"
                >
                  <h3 className="text-xl font-medium text-primary mb-4">
                    Ready to Submit?
                  </h3>
                  <p className="text-gray-600">
                    Please review your information before submission. You can go
                    back to previous steps to make changes or preview your
                    profile first.
                  </p>
                </motion.div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <AnimatedButton
                    onClick={handlePreview}
                    variant="outline"
                    icon={<FiEye />}
                  >
                    Preview Profile
                  </AnimatedButton>
                  <AnimatedButton
                    onClick={handleNextStep}
                    variant="primary"
                    icon={<FiArrowRight />}
                  >
                    Continue to Set Password
                  </AnimatedButton>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3">
                    {photoURL && (
                      <img
                        src={photoURL}
                        alt="Profile Photo"
                        className="w-full h-auto rounded-lg shadow-sm"
                      />
                    )}
                  </div>

                  <div className="md:w-2/3 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-lincssa-blue">
                        {formData.fullName}
                      </h3>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700">About</h4>
                      <p className="text-gray-600">{formData.bio}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700">
                        Favorite Quote
                      </h4>
                      <p className="text-gray-600 italic">"{formData.quote}"</p>
                    </div>

                    {formData.hobbies && (
                      <div>
                        <h4 className="font-semibold text-gray-700">
                          Hobbies & Interests
                        </h4>
                        <p className="text-gray-600">{formData.hobbies}</p>
                      </div>
                    )}

                    <div className="pt-4">
                      <h4 className="font-semibold text-gray-700">
                        Contact Information
                      </h4>
                      <p className="text-gray-600">
                        Matric Number: {formData.matricNumber}
                      </p>
                      {formData.email && (
                        <p className="text-gray-600">Email: {formData.email}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <AnimatedButton
                    onClick={() => setPreviewMode(false)}
                    variant="primary"
                    icon={<FiArrowRight />}
                  >
                    Continue
                  </AnimatedButton>
                </div>
              </div>
            )}
          </motion.div>
        );

      case 7:
        return (
          <motion.div
            key="step7"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={formVariants}
            className="space-y-6"
          >
            <h2 className="text-2xl font-display font-bold text-lincssa-blue mb-6">
              Set Up Your Account Password
            </h2>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-yellow-700">
                Create a password to access and edit your details later. You'll
                log in using your email address and this password.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  className="w-full p-3 rounded-lg border-2 border-gray-200 bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-black"
                  readOnly
                />
                <p className="text-sm text-gray-500 mt-1">
                  You'll use this email to log in
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-black"
                  placeholder="Create a secure password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-black"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <AnimatedButton
                onClick={handleSubmit}
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                icon={<FiCheckCircle />}
              >
                Complete Registration
              </AnimatedButton>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navbar />

      <div className="container mx-auto py-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Progress Indicator */}
          {step <= 6 && !previewMode && (
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-full flex flex-col">
                <div className="relative mb-4">
                  <div className="w-full flex items-center justify-between relative z-10">
                    {[1, 2, 3, 4, 5, 6].map((s) => (
                      <motion.div
                        key={s}
                        initial={{ scale: 0.8 }}
                        animate={{
                          scale: s <= step ? 1 : 0.8,
                          backgroundColor: s <= step ? "#7C4DFF" : "#e5e7eb",
                          color: s <= step ? "#FFFFFF" : "#6b7280",
                        }}
                        transition={{ duration: 0.3 }}
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                      >
                        {s < step ? <FiCheckCircle className="w-5 h-5" /> : s}
                      </motion.div>
                    ))}
                  </div>

                  {/* Background line */}
                  <div className="absolute h-1 bg-gray-200 w-full top-5 transform -translate-y-1/2 z-0"></div>

                  {/* Progress line */}
                  <motion.div
                    className="absolute h-1 bg-[#7C4DFF] top-5 transform -translate-y-1/2 z-0 left-0"
                    initial={{ width: "0%" }}
                    animate={{ width: `${(step - 1) * 20}%` }}
                    transition={{ duration: 0.5 }}
                  ></motion.div>
                </div>

                <div className="flex justify-between text-sm text-gray-600 px-1">
                  <span>Personal Info</span>
                  <span>About You</span>
                  <span>Journey</span>
                  <span>Thoughts</span>
                  <span>Photo</span>
                  <span>Submit</span>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 md:p-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

            {/* Navigation Buttons */}
            {step <= 5 && (
              <motion.div
                className="mt-10 flex justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <AnimatedButton
                  onClick={handlePrevStep}
                  variant="outline"
                  disabled={step === 1}
                  icon={<FiArrowLeft />}
                >
                  Back
                </AnimatedButton>

                <AnimatedButton
                  onClick={handleNextStep}
                  variant="primary"
                  icon={<FiArrowRight />}
                >
                  {step === 5 ? "Review Application" : "Continue"}
                </AnimatedButton>
              </motion.div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            className="mt-6 text-center text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center justify-center gap-1">
              <FiInfo className="w-4 h-4" />
              <span>
                The committee decides your turn to be the Personality of the
                Week
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
