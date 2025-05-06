import React, { useState, useEffect } from "react";
import { transparentize, darken, lighten } from "polished";
import { motion } from "framer-motion";
import { Student } from "../index";

type TemplateProps = {
  student: Student;
  colors: string[];
  logoUrl: string;
  branding: boolean;
};

export default function MinimalistTemplate({
  student,
  colors,
  logoUrl,
  branding,
}: TemplateProps) {
  const [logoError, setLogoError] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mount effect for animations
  useEffect(() => {
    setMounted(true);
  }, []);

  // Logo error handler
  const handleLogoError = () => {
    console.warn("Logo failed to load in template");
    setLogoError(true);
  };

  // Use the dominant colors or fallback to defaults
  const primaryColor = colors[0] || "#7C4DFF";
  const secondaryColor = colors[1] || "#FF4081";
  const accentColor = colors[2] || "#1E3A8A";
  const highlightColor = colors[3] || "#FFD700";

  // Refined color palette based on the primary color
  const subtleAccent = transparentize(0.9, primaryColor);
  const subtleText = darken(0.5, primaryColor);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="minimalist-template h-full w-full flex flex-col relative overflow-hidden bg-white">
      {/* Ultra-subtle background texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${primaryColor.replace(
            "#",
            ""
          )}' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Color accent at top */}
      <div
        className="absolute top-0 left-0 right-0 h-16"
        style={{
          background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
        }}
      ></div>

      {/* Extremely subtle vertical line for structure */}
      <div
        className="absolute top-16 bottom-0 left-[37%] w-px"
        style={{
          background: `linear-gradient(to bottom, ${transparentize(
            0.9,
            primaryColor
          )}, ${transparentize(0.98, primaryColor)})`,
        }}
      ></div>

      {/* Background logo if branding enabled - even more subtle than before */}
      {branding && (
        <div className="absolute right-0 bottom-0 opacity-[0.01] w-[140%] h-[140%] transform translate-x-[20%] translate-y-[20%]">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 0.01, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <img
              src={logoUrl}
              alt="Logo Watermark"
              className="w-full h-full object-contain"
              onError={handleLogoError}
              style={{ display: logoError ? "none" : "block" }}
            />
            {logoError && (
              <div className="w-full h-full flex items-center justify-center">
                <span
                  className="text-[30rem] font-thin"
                  style={{ color: transparentize(0.95, primaryColor) }}
                >
                  L
                </span>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Content */}
      <motion.div
        className="flex flex-col h-full w-full pt-28 px-20 pb-20 z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-20"
          variants={itemVariants}
        >
          {/* Left section with date */}
          <div className="text-xl font-light text-gray-400 tracking-wider">
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          {/* Right section with POTD text */}
          <div
            className="text-xl tracking-widest font-medium"
            style={{ color: primaryColor }}
          >
            PERSONALITY OF THE DAY
          </div>
        </motion.div>

        {/* Student Name in large display */}
        <motion.h1
          variants={itemVariants}
          className="text-8xl font-bold mb-12 tracking-tight"
          style={{ color: "#232323" }}
        >
          {student?.fullName || "Student Name"}
        </motion.h1>

        {/* Level and Department with minimalist separator */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-4 mb-28"
        >
          <span className="text-3xl font-light text-gray-500">
            {student?.level || "400"} Level
          </span>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "40px" }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-[1px]"
            style={{ backgroundColor: primaryColor }}
          ></motion.div>
          <span className="text-3xl font-light text-gray-500">
            {student?.department || "Department"}
          </span>
        </motion.div>

        {/* Main content area with photo and details */}
        <div className="flex flex-1 gap-20">
          {/* Left column with photo */}
          <motion.div variants={itemVariants} className="w-2/5">
            <motion.div
              className="w-full aspect-[4/5] overflow-hidden"
              style={{
                boxShadow: `20px 20px 0 ${transparentize(0.9, primaryColor)}`,
              }}
              whileHover={{
                boxShadow: `25px 25px 0 ${transparentize(0.85, primaryColor)}`,
                transition: { duration: 0.3 },
              }}
            >
              {student?.photoURL ? (
                <img
                  src={student.photoURL}
                  alt={student.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span
                    className="text-[10rem] font-light"
                    style={{ color: transparentize(0.5, primaryColor) }}
                  >
                    {student?.fullName?.[0]?.toUpperCase() || "?"}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Matric number with minimalist style */}
            {student?.matricNumber && (
              <motion.div
                variants={itemVariants}
                className="mt-12 flex items-center gap-3"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "32px" }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="h-[1px]"
                  style={{ backgroundColor: primaryColor }}
                ></motion.div>
                <span className="text-xl text-gray-400 tracking-wide">
                  {student.matricNumber}
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Right column with details */}
          <div className="w-3/5 flex flex-col">
            {/* Quote in large, styled format */}
            {student?.quote && (
              <motion.div variants={itemVariants} className="mb-16">
                <div
                  className="text-4xl font-light italic mb-6 leading-relaxed"
                  style={{ color: primaryColor }}
                >
                  "{student.quote}"
                </div>
              </motion.div>
            )}

            {/* Bio with minimalist styling */}
            {student?.bio && (
              <motion.div variants={itemVariants} className="mb-16">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "24px" }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className="h-[1px] mb-6"
                  style={{ backgroundColor: secondaryColor }}
                ></motion.div>
                <h3
                  className="text-xl uppercase tracking-widest mb-6 font-medium"
                  style={{ color: secondaryColor }}
                >
                  About
                </h3>
                <p className="text-2xl text-gray-600 leading-relaxed">
                  {student.bio}
                </p>
              </motion.div>
            )}

            {/* Additional section with hobbies */}
            {student?.hobbies && (
              <motion.div variants={itemVariants} className="mb-16">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "24px" }}
                  transition={{ duration: 0.8, delay: 1.1 }}
                  className="h-[1px] mb-6"
                  style={{ backgroundColor: accentColor }}
                ></motion.div>
                <h3
                  className="text-xl uppercase tracking-widest mb-6 font-medium"
                  style={{ color: accentColor }}
                >
                  Interests
                </h3>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {student.hobbies}
                </p>
              </motion.div>
            )}

            {/* Bottom section with additional details */}
            <motion.div variants={itemVariants} className="mt-auto">
              <div className="grid grid-cols-3 gap-8">
                {student?.specializationTrack && (
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-widest mb-2">
                      Track
                    </p>
                    <p className="text-lg text-gray-700">
                      {student.specializationTrack}
                    </p>
                  </div>
                )}

                {student?.favoriteCourse && (
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-widest mb-2">
                      Favorite Course
                    </p>
                    <p className="text-lg text-gray-700">
                      {student.favoriteCourse}
                    </p>
                  </div>
                )}

                {student?.bestMoment && (
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-widest mb-2">
                      Best Moment
                    </p>
                    <p className="text-lg text-gray-700">
                      {student.bestMoment.length > 40
                        ? student.bestMoment.substring(0, 40) + "..."
                        : student.bestMoment}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          variants={itemVariants}
          className="mt-16 pt-8 border-t border-gray-100 flex justify-between items-center"
        >
          {/* Left section with subtle tag */}
          <div className="text-sm text-gray-400 uppercase tracking-wider">
            FYB {new Date().getFullYear()}
          </div>

          {/* Right section with association logo */}
          {branding && (
            <div>
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 }}
                className="flex items-center gap-2"
              >
                <div
                  className="h-8 w-8 rounded-full border overflow-hidden flex-shrink-0"
                  style={{ borderColor: transparentize(0.8, primaryColor) }}
                >
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="w-full h-full object-contain"
                    onError={handleLogoError}
                    style={{ display: logoError ? "none" : "block" }}
                  />
                  {logoError && (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <span
                        className="text-sm font-bold"
                        style={{ color: primaryColor }}
                      >
                        L
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-sm text-gray-400 tracking-wider">
                  LINGUISTICS & COMMUNICATIONS STUDENTS' ASSOCIATION
                </span>
              </motion.div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
