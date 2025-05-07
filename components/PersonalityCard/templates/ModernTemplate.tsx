import React, { useState, useEffect } from "react";
import { transparentize, lighten, darken } from "polished";
import { motion } from "framer-motion";
import { Student } from "../index";

type TemplateProps = {
  student: Student;
  colors: string[];
  logoUrl: string;
  branding: boolean;
};

export default function ModernTemplate({
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

  // Use the dominant colors or fallback to defaults - ensure they're distinct
  const primaryColor = colors[0] || "#7C4DFF";
  const secondaryColor = colors[1] || "#FF4081";
  const accentColor = colors[2] || "#1E3A8A";
  const highlightColor = colors[3] || "#FFD700";

  // Validate favorite color for safe usage with transparency functions
  const favoriteColor = student?.favoriteColor || highlightColor;
  const isValidFavoriteColor = /^(#|rgb[a]?\(|hsl[a]?\()/.test(favoriteColor);
  const displayHighlightColor = isValidFavoriteColor
    ? favoriteColor
    : highlightColor;
  const safeHighlightColor = isValidFavoriteColor
    ? favoriteColor
    : highlightColor;

  // Logo error handler
  const handleLogoError = () => {
    console.warn("Logo failed to load in template");
    setLogoError(true);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    opacity: [0.5, 0.7, 0.5], // Reduced opacity range for better visibility
    transition: {
      duration: 8,
      repeat: Infinity,
      repeatType: "mirror" as const,
      ease: "easeInOut",
    },
  };

  // Helper function to ensure valid color
  const ensureSafeColor = (color: string) => {
    return /^(#|rgb[a]?\(|hsl[a]?\()/.test(color) ? color : primaryColor;
  };

  // Helper function to render a detail item if student data exists
  const renderDetailItem = (
    label: string,
    value: string | undefined,
    color: string
  ) => {
    if (!value) return null;

    // Create a safe color
    const safeColor = ensureSafeColor(color);

    return (
      <div
        className="bg-white/70 backdrop-blur-lg rounded-xl p-4 relative overflow-hidden group"
        style={{
          boxShadow: `0 10px 30px -10px ${transparentize(0.9, safeColor)}`,
          borderTop: "1px solid rgba(255,255,255,0.5)",
          borderLeft: "1px solid rgba(255,255,255,0.5)",
          transition: "all 0.3s ease",
        }}
      >
        <div
          className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-5 group-hover:opacity-10 transition-opacity"
          style={{
            background: `linear-gradient(135deg, ${safeColor}, transparent)`,
          }}
        ></div>
        <h3
          className="text-lg font-bold mb-2 relative"
          style={{ color: safeColor }}
        >
          {label}
        </h3>
        <p className="text-gray-800 relative font-medium">{value}</p>
      </div>
    );
  };

  return (
    <div className="modern-template h-full w-full flex flex-col relative overflow-hidden">
      {/* Background - Simplified split design with better contrast */}
      <div className="absolute inset-0 flex z-0">
        {/* Left split - solid color instead of gradient for better contrast */}
        <div
          className="w-2/5 h-full"
          style={{
            backgroundColor: primaryColor,
            boxShadow: "10px 0 30px rgba(0,0,0,0.2)",
          }}
        ></div>

        {/* Right split - pure white for maximum contrast */}
        <div className="w-3/5 h-full bg-white"></div>
      </div>

      {/* Content container with padding */}
      <div className="relative z-10 h-full w-full flex flex-col py-10 px-8">
        {/* Decorative elements - reduced quantity and opacity */}
        <div className="absolute inset-0 pointer-events-none z-5">
          {/* Single large circle - reduced opacity */}
          <motion.div
            animate={mounted ? pulseAnimation : {}}
            className="absolute w-[70vw] h-[70vw] rounded-full top-1/2 left-[-30vw] transform -translate-y-1/2"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${primaryColor}, rgba(0,0,0,0) 70%)`,
              mixBlendMode: "soft-light",
              opacity: 0.4, // Fixed opacity for better control
              zIndex: 1,
            }}
          ></motion.div>

          {/* Single accent circle - reduced opacity */}
          <motion.div
            animate={
              mounted
                ? {
                    ...pulseAnimation,
                    transition: { ...pulseAnimation.transition, delay: 1.5 },
                  }
                : {}
            }
            className="absolute w-[20vw] h-[20vw] rounded-full bottom-[10%] right-[15%]"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${accentColor}, rgba(0,0,0,0) 70%)`,
              mixBlendMode: "soft-light",
              opacity: 0.3, // Fixed opacity for better control
              zIndex: 1,
            }}
          ></motion.div>
        </div>

        {/* Background pattern - further reduced opacity */}
        <div
          className="absolute inset-0 opacity-[0.01] z-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Background logo watermark - reduced opacity for better content visibility */}
        {branding && (
          <div className="absolute inset-0 flex items-center justify-center z-1">
            <motion.div
              className="w-[60%] h-[60%] opacity-[0.02] z-1"
              initial={{ opacity: 0, rotate: -5 }}
              animate={{ opacity: 0.02, rotate: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <img
                src={logoUrl}
                alt="Logo Watermark"
                className="w-full h-full object-contain"
                onError={handleLogoError}
                style={{
                  display: logoError ? "none" : "block",
                }}
              />
              {logoError && (
                <div className="w-full h-full flex items-center justify-center text-primary text-opacity-5">
                  <span className="text-[20rem] font-bold">L</span>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Main content with modern layout */}
        <motion.div
          className="relative z-20 flex flex-col h-full w-full py-4 px-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header - improved contrast */}
          <motion.div
            className="flex justify-between items-center mb-6"
            variants={itemVariants}
          >
            <div
              className="bg-white shadow-lg backdrop-blur-xl rounded-full py-3 px-6"
              style={{
                boxShadow: `0 10px 30px ${transparentize(0.9, primaryColor)}`,
              }}
            >
              <h2
                className="text-xl font-bold uppercase tracking-wider"
                style={{ color: primaryColor }}
              >
                Personality of the Week
              </h2>
            </div>

            {branding && (
              <div
                className="h-14 w-14 bg-white rounded-full p-2 overflow-hidden shadow-lg"
                style={{
                  boxShadow: `0 10px 30px ${transparentize(
                    0.9,
                    secondaryColor
                  )}`,
                }}
              >
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="w-full h-full object-contain"
                  onError={handleLogoError}
                  style={{ display: logoError ? "none" : "block" }}
                />
                {logoError && (
                  <div className="w-full h-full flex items-center justify-center rounded-full">
                    <span
                      className="text-xl font-bold"
                      style={{ color: primaryColor }}
                    >
                      L
                    </span>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Student Info Section - Flowing Layout */}
          <motion.div
            className="flex flex-col h-full relative gap-6"
            variants={itemVariants}
          >
            {/* Top Section - Photo and Identity */}
            <div className="flex gap-6">
              {/* Left Section - Photo */}
              <motion.div className="w-[38%]" variants={itemVariants}>
                <div className="relative">
                  {/* Subtle decorative frame - reduced opacity */}
                  <motion.div
                    className="absolute inset-0 transform translate-x-4 translate-y-4 rounded-3xl opacity-50"
                    style={{
                      background: `linear-gradient(135deg, ${transparentize(
                        0.6,
                        primaryColor
                      )}, ${transparentize(0.8, secondaryColor)})`,
                      zIndex: 1,
                    }}
                    animate={
                      mounted
                        ? {
                            x: [4, 6, 4],
                            y: [4, 6, 4],
                            transition: {
                              duration: 4,
                              repeat: Infinity,
                              repeatType: "reverse" as const,
                              ease: "easeInOut",
                            },
                          }
                        : {}
                    }
                  ></motion.div>

                  {/* Photo container with better contrast */}
                  <div
                    className="relative z-2 rounded-3xl overflow-hidden shadow-lg"
                    style={{
                      aspectRatio: "3/4",
                      border: "6px solid rgba(255,255,255,1)", // Solid white border
                      boxShadow: `
                        0 20px 40px rgba(0,0,0,0.2),
                        0 10px 20px rgba(0,0,0,0.1)
                      `,
                    }}
                  >
                    {student?.photoURL ? (
                      <img
                        src={student.photoURL}
                        alt={student.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${lighten(
                            0.3,
                            primaryColor
                          )}, ${lighten(0.3, secondaryColor)})`,
                        }}
                      >
                        <span className="text-[8rem] font-bold text-white/90">
                          {student?.fullName?.[0]?.toUpperCase() || "?"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Basic Info Card - Improved contrast with darker text on lighter backgrounds */}
                <div
                  className="mt-4 space-y-2 bg-white shadow-lg backdrop-blur-md rounded-xl p-3"
                  style={{
                    boxShadow: `0 10px 20px ${transparentize(
                      0.9,
                      primaryColor
                    )}`,
                  }}
                >
                  {/* Matric Number */}
                  {student?.matricNumber && (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: primaryColor }}
                      ></div>
                      <p className="text-sm text-gray-800 font-medium">
                        <span className="font-bold">Matric:</span>{" "}
                        {student.matricNumber}
                      </p>
                    </div>
                  )}

                  {/* Department - Without level */}
                  {student?.department && (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: secondaryColor }}
                      ></div>
                      <p className="text-sm text-gray-800 font-medium">
                        <span className="font-bold">Department:</span>{" "}
                        {student.department}
                      </p>
                    </div>
                  )}

                  {/* Track */}
                  {student?.partTract && (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: accentColor }}
                      ></div>
                      <p className="text-sm text-gray-800 font-medium">
                        <span className="font-bold">Track:</span>{" "}
                        {student.partTract}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Right Section - Identity and Quote */}
              <motion.div className="w-[62%]" variants={itemVariants}>
                <div
                  className="bg-white shadow-lg backdrop-blur-xl rounded-2xl p-6"
                  style={{
                    boxShadow: `
                      0 20px 40px rgba(0,0,0,0.1),
                      0 10px 20px rgba(0,0,0,0.05)
                    `,
                  }}
                >
                  {/* Name Display - bolder text */}
                  <h1
                    className="text-4xl font-bold mb-4 leading-tight"
                    style={{ color: primaryColor }}
                  >
                    {student?.fullName || "Student Name"}
                  </h1>

                  {/* Quote Section - improved contrast */}
                  {student?.quote && (
                    <div className="mb-5 relative">
                      <div
                        className="absolute left-0 top-0 transform -translate-x-2 -translate-y-2 text-5xl opacity-20"
                        style={{ color: primaryColor }}
                      >
                        "
                      </div>
                      <div
                        className="text-lg italic font-medium mb-2 pl-6"
                        style={{ color: darken(0.2, primaryColor) }}
                      >
                        "{student.quote}"
                      </div>
                    </div>
                  )}

                  {/* Personal Details - improved visibility */}
                  <div className="flex flex-wrap gap-3">
                    {/* Birthday */}
                    {(student?.birthMonth || student?.birthDay) && (
                      <div className="bg-gray-100 px-3 py-1.5 rounded-full text-sm shadow-sm">
                        <span
                          className="font-bold"
                          style={{ color: secondaryColor }}
                        >
                          Birthday:
                        </span>{" "}
                        <span className="text-gray-800">
                          {student.birthMonth}
                          {student.birthDay ? ` ${student.birthDay}` : ""}
                        </span>
                      </div>
                    )}

                    {/* Relationship Status */}
                    {student?.relationshipStatus && (
                      <div className="bg-gray-100 px-3 py-1.5 rounded-full text-sm shadow-sm">
                        <span
                          className="font-bold"
                          style={{ color: primaryColor }}
                        >
                          Status:
                        </span>{" "}
                        <span className="text-gray-800">
                          {student.relationshipStatus}
                        </span>
                      </div>
                    )}

                    {/* Email */}
                    {student?.email && (
                      <div className="bg-gray-100 px-3 py-1.5 rounded-full text-sm truncate max-w-[200px] shadow-sm">
                        <span
                          className="font-bold"
                          style={{ color: accentColor }}
                        >
                          Contact:
                        </span>{" "}
                        <span className="text-gray-800">{student.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio Section - Immediately below identity card */}
                {student?.bio && (
                  <div
                    className="bg-white shadow-lg backdrop-blur-xl rounded-2xl p-6 mt-4"
                    style={{
                      boxShadow: `0 10px 30px rgba(0,0,0,0.05)`,
                    }}
                  >
                    <h3
                      className="text-lg font-bold mb-2 flex items-center"
                      style={{ color: accentColor }}
                    >
                      <div
                        className="w-3 h-3 mr-2 rounded"
                        style={{ backgroundColor: accentColor }}
                      ></div>
                      About
                    </h3>
                    <p className="text-md text-gray-800 leading-relaxed font-medium">
                      {student.bio}
                    </p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Connections & Socials - Full width card with better contrast */}
            {student?.socials && (
              <motion.div variants={itemVariants} className="w-full">
                <div
                  className="bg-white shadow-lg backdrop-blur-xl rounded-2xl p-5"
                  style={{
                    boxShadow: `0 10px 30px rgba(0,0,0,0.05)`,
                  }}
                >
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ color: secondaryColor }}
                  >
                    Connect With Me
                  </h3>
                  <p className="text-gray-800 font-medium">{student.socials}</p>
                </div>
              </motion.div>
            )}

            {/* Academic & Favorites Section - 2 columns with improved contrast */}
            <div className="grid grid-cols-2 gap-5">
              {/* Left Column - Favorites */}
              <motion.div variants={itemVariants} className="space-y-5">
                {/* Favorite Course */}
                {student?.favoriteCourse && (
                  <div
                    className="bg-white shadow-lg backdrop-blur-xl rounded-2xl p-5"
                    style={{
                      boxShadow: `0 10px 30px rgba(0,0,0,0.05)`,
                    }}
                  >
                    <h3
                      className="text-lg font-bold mb-2"
                      style={{ color: primaryColor }}
                    >
                      Favorite Course
                    </h3>
                    <p className="text-gray-800 font-medium">
                      {student.favoriteCourse}
                    </p>
                  </div>
                )}

                {/* Favorite Lecturer */}
                {student?.favoriteLecturer && (
                  <div
                    className="bg-white shadow-lg backdrop-blur-xl rounded-2xl p-5"
                    style={{
                      boxShadow: `0 10px 30px rgba(0,0,0,0.05)`,
                    }}
                  >
                    <h3
                      className="text-lg font-bold mb-2"
                      style={{ color: displayHighlightColor }}
                    >
                      Favorite Lecturer
                    </h3>
                    <p className="text-gray-800 font-medium">
                      {student.favoriteLecturer}
                    </p>
                  </div>
                )}

                {/* Favorite Level */}
                {student?.favoriteLevel && (
                  <div
                    className="bg-white shadow-lg backdrop-blur-xl rounded-2xl p-5"
                    style={{
                      boxShadow: `0 10px 30px rgba(0,0,0,0.05)`,
                    }}
                  >
                    <h3
                      className="text-lg font-bold mb-2"
                      style={{ color: accentColor }}
                    >
                      Favorite Level
                    </h3>
                    <p className="text-gray-800 font-medium">
                      {student.favoriteLevel}
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Right Column - Challenges */}
              <motion.div variants={itemVariants} className="space-y-5">
                {/* Shege Course */}
                {student?.shegeCourse && (
                  <div
                    className="bg-white shadow-lg backdrop-blur-xl rounded-2xl p-5"
                    style={{
                      boxShadow: `0 10px 30px rgba(0,0,0,0.05)`,
                    }}
                  >
                    <h3
                      className="text-lg font-bold mb-2"
                      style={{ color: secondaryColor }}
                    >
                      Shege Course
                    </h3>
                    <p className="text-gray-800 font-medium">
                      {student.shegeCourse}
                    </p>
                  </div>
                )}

                {/* Shege Level */}
                {student?.shegeLevel && (
                  <div
                    className="bg-white shadow-lg backdrop-blur-xl rounded-2xl p-5"
                    style={{
                      boxShadow: `0 10px 30px rgba(0,0,0,0.05)`,
                    }}
                  >
                    <h3
                      className="text-lg font-bold mb-2"
                      style={{ color: highlightColor }}
                    >
                      Shege Level
                    </h3>
                    <p className="text-gray-800 font-medium">
                      {student.shegeLevel}
                    </p>
                  </div>
                )}

                {/* If Not Linguistics */}
                {student?.ifNotLinguistics && (
                  <div
                    className="bg-white shadow-lg backdrop-blur-xl rounded-2xl p-5"
                    style={{
                      boxShadow: `0 10px 30px rgba(0,0,0,0.05)`,
                    }}
                  >
                    <h3
                      className="text-lg font-bold mb-2"
                      style={{ color: accentColor }}
                    >
                      If Not Linguistics
                    </h3>
                    <p className="text-gray-800 font-medium">
                      {student.ifNotLinguistics}
                    </p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Experiences Section - Full width with 2 col layout */}
            <motion.div variants={itemVariants} className="w-full">
              <div
                className="bg-white shadow-lg backdrop-blur-xl rounded-2xl p-5"
                style={{
                  boxShadow: `0 10px 30px rgba(0,0,0,0.05)`,
                }}
              >
                <h3
                  className="text-lg font-bold mb-4"
                  style={{ color: primaryColor }}
                >
                  Memorable Experiences
                </h3>

                <div className="grid grid-cols-2 gap-6">
                  {/* Best Moment */}
                  {student?.bestMoment && (
                    <div>
                      <h4
                        className="text-md font-bold mb-2 flex items-center"
                        style={{ color: primaryColor }}
                      >
                        <div
                          className="w-2 h-2 mr-2 rounded-full"
                          style={{ backgroundColor: primaryColor }}
                        ></div>
                        Best Moment
                      </h4>
                      <p className="text-gray-800 font-medium">
                        {student.bestMoment}
                      </p>
                    </div>
                  )}

                  {/* Worst Moment */}
                  {student?.worstMoment && (
                    <div>
                      <h4
                        className="text-md font-bold mb-2 flex items-center"
                        style={{ color: secondaryColor }}
                      >
                        <div
                          className="w-2 h-2 mr-2 rounded-full"
                          style={{ backgroundColor: secondaryColor }}
                        ></div>
                        Worst Moment
                      </h4>
                      <p className="text-gray-800 font-medium">
                        {student.worstMoment}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Hobbies & Interests - Full width card */}
            {student?.hobbies && (
              <motion.div variants={itemVariants} className="w-full">
                <div
                  className="bg-white shadow-lg backdrop-blur-xl rounded-2xl p-5"
                  style={{
                    boxShadow: `0 10px 30px rgba(0,0,0,0.05)`,
                  }}
                >
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ color: secondaryColor }}
                  >
                    Hobbies & Interests
                  </h3>
                  <p className="text-gray-800 font-medium">{student.hobbies}</p>
                </div>
              </motion.div>
            )}

            {/* Achievements Section - Full width card */}
            {student?.achievements && (
              <motion.div variants={itemVariants} className="w-full">
                <div
                  className="bg-white shadow-lg backdrop-blur-xl rounded-2xl p-5"
                  style={{
                    boxShadow: `0 10px 30px rgba(0,0,0,0.05)`,
                  }}
                >
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ color: primaryColor }}
                  >
                    Achievements
                  </h3>
                  <p className="text-gray-800 font-medium">
                    {student.achievements}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Parting Words - Full width card */}
            {student?.partingWords && (
              <motion.div variants={itemVariants} className="w-full">
                <div
                  className="bg-white shadow-lg backdrop-blur-xl rounded-2xl p-5"
                  style={{
                    boxShadow: `0 10px 30px rgba(0,0,0,0.05)`,
                  }}
                >
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ color: accentColor }}
                  >
                    Parting Words
                  </h3>
                  <p className="text-gray-800 font-medium">
                    {student.partingWords}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Advice for Juniors - Prominent at the end with high contrast */}
            {student?.advice && (
              <motion.div variants={itemVariants} className="w-full">
                <div
                  className="mt-2 p-5 bg-gray-50 shadow-lg backdrop-blur-md rounded-xl border-2"
                  style={{
                    boxShadow: `0 10px 30px rgba(0,0,0,0.05)`,
                    borderColor: safeHighlightColor,
                  }}
                >
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ color: displayHighlightColor }}
                  >
                    Advice for Juniors
                  </h3>
                  <p className="text-gray-800 italic text-lg font-medium">
                    "{student.advice}"
                  </p>
                </div>
              </motion.div>
            )}

            {/* Bottom bar - Date and branding with better contrast */}
            <motion.div className="mt-auto" variants={itemVariants}>
              <div
                className="flex justify-between items-center bg-white shadow-lg backdrop-blur-xl rounded-2xl p-4"
                style={{
                  boxShadow: `0 10px 30px rgba(0,0,0,0.05)`,
                }}
              >
                <div
                  className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100 shadow-inner"
                  style={{
                    color: darken(0.2, primaryColor),
                  }}
                >
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </div>

                {branding && (
                  <div
                    className="text-sm font-bold uppercase px-3 py-1 rounded-full shadow-inner"
                    style={{
                      backgroundColor: lighten(0.4, primaryColor),
                      color: darken(0.2, primaryColor),
                    }}
                  >
                    LINCSSA
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
