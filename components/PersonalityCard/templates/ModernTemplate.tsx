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

  // Use the dominant colors or fallback to defaults with dark theme colors
  const primaryColor = colors[0] || "#7C4DFF";
  const secondaryColor = colors[1] || "#00BFFF"; // Brighter blue for dark theme contrast
  const accentColor = colors[2] || "#FF4081"; // Vibrant pink for accents
  const highlightColor = colors[3] || "#FFD700"; // Gold highlight for contrast

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
    scale: [1, 1.08, 1], // Increased scale range for more dynamic effect
    opacity: [0.4, 0.7, 0.4], // Higher opacity values for more vibrant appearance
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
        className="bg-gray-900/70 backdrop-blur-lg rounded-xl p-4 relative overflow-hidden group"
        style={{
          boxShadow: `0 10px 30px -10px ${transparentize(0.8, safeColor)}`,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          borderLeft: "1px solid rgba(255,255,255,0.1)",
          transition: "all 0.3s ease",
        }}
      >
        <div
          className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 group-hover:opacity-15 transition-opacity"
          style={{
            background: `linear-gradient(135deg, ${safeColor}, transparent)`,
          }}
        ></div>
        <h3
          className="text-xl font-bold mb-2 relative" // Increased font size
          style={{ color: safeColor }}
        >
          {label}
        </h3>
        <p className="text-gray-200 relative font-medium text-lg">{value}</p>{" "}
        {/* Increased font size */}
      </div>
    );
  };

  return (
    <div className="modern-template h-full w-full flex flex-col relative overflow-hidden">
      {/* Background - Dark themed split design */}
      <div className="absolute inset-0 flex z-0">
        {/* Left split - dark color with accent */}
        <div
          className="w-2/5 h-full"
          style={{
            backgroundColor: "#0d0d35", // Deeper, more vibrant blue-black
            boxShadow: `5px 0 20px rgba(0,0,0,0.6), inset -2px 0 15px ${transparentize(
              0.3, // Less transparency for more vibrant glow
              primaryColor
            )}`,
            borderRight: `1px solid ${transparentize(0.2, primaryColor)}`, // More visible border
          }}
        ></div>

        {/* Right split - slightly lighter black for contrast */}
        <div
          className="w-3/5 h-full"
          style={{
            backgroundColor: "#1a1a40", // More saturated deep purple-blue
          }}
        ></div>
      </div>

      {/* Content container with padding */}
      <div className="relative z-10 h-full w-full flex flex-col py-10 px-4 sm:px-8">
        {/* Decorative elements - reduced quantity and opacity */}
        <div className="absolute inset-0 pointer-events-none z-5">
          {/* Single large circle - reduced opacity */}
          <motion.div
            animate={mounted ? pulseAnimation : {}}
            className="absolute w-[70vw] h-[70vw] rounded-full top-1/2 left-[-30vw] transform -translate-y-1/2"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${lighten(
                0.4, // Higher lightening for more vibrant color
                primaryColor
              )}, rgba(0,0,0,0) 70%)`,
              mixBlendMode: "screen", // Better for dark themes
              opacity: 0.5, // Increased opacity for significantly more vibrancy
              filter: "blur(8px)", // Sharper glow effect
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
            className="absolute w-[35vw] h-[35vw] rounded-full bottom-[5%] right-[10%]" // Larger circle
            style={{
              background: `radial-gradient(circle at 30% 30%, ${lighten(
                0.35, // Higher lightening for more vibrant color
                accentColor
              )}, rgba(0,0,0,0) 70%)`,
              mixBlendMode: "screen", // Better for dark themes
              opacity: 0.6, // Higher opacity for more vibrant look
              filter: "blur(10px)", // Add glow effect
              zIndex: 1,
            }}
          ></motion.div>
        </div>

        {/* Background pattern - further reduced opacity */}
        <div
          className="absolute inset-0 opacity-[0.03] z-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Background logo watermark - adjusted opacity for dark theme */}
        {branding && (
          <div className="absolute inset-0 flex items-center justify-center z-1">
            <motion.div
              className="w-[60%] h-[60%] opacity-[0.04] z-1" // Slightly increased opacity for dark theme
              initial={{ opacity: 0, rotate: -5 }}
              animate={{ opacity: 0.04, rotate: 0 }}
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
                  <span className="text-[22rem] font-black text-white/20">
                    L
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Main content with modern layout */}
        <motion.div
          className="relative z-20 flex flex-col h-full w-full py-4 px-4 sm:px-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header - dark theme version */}
          <motion.div
            className="flex justify-between items-center mb-6"
            variants={itemVariants}
          >
            <div
              className="bg-gray-900 shadow-lg backdrop-blur-xl rounded-full py-3 px-6"
              style={{
                boxShadow: `0 10px 30px ${transparentize(0.7, primaryColor)}`,
                borderTop: "1px solid rgba(255,255,255,0.1)",
                borderLeft: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {" "}
              <h2
                className="text-3xl sm:text-4xl font-black uppercase tracking-wider"
                style={{
                  color: lighten(0.5, primaryColor),
                  background: `linear-gradient(135deg, ${lighten(
                    0.5, // Even brighter gradient start
                    primaryColor
                  )}, ${lighten(
                    0.6, // Even brighter gradient end
                    secondaryColor
                  )})`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow:
                    "0 2px 4px rgba(0,0,0,0.6), 0 0 20px rgba(255,255,255,0.3)", // Enhanced glow
                }}
              >
                Personality of the Week
              </h2>
            </div>

            {branding && (
              <div
                className="h-32 w-32 bg-gray-900 rounded-full p-2 overflow-hidden shadow-lg" // Even larger size for significant prominence
                style={{
                  boxShadow: `0 10px 30px ${transparentize(
                    0.7,
                    secondaryColor
                  )}`,
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  borderLeft: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="w-full h-full object-contain"
                  onError={handleLogoError}
                  style={{
                    display: logoError ? "none" : "block",
                  }}
                />
                {logoError && (
                  <div className="w-full h-full flex items-center justify-center rounded-full">
                    <span
                      className="text-4xl font-black" // Further increased font size and weight
                      style={{
                        color: lighten(0.3, primaryColor),
                        textShadow: "0 2px 4px rgba(0,0,0,0.7)",
                      }}
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
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Left Section - Photo */}
              <motion.div className="w-full sm:w-[38%]" variants={itemVariants}>
                <div className="relative">
                  {/* Subtle decorative frame - reduced opacity */}
                  <motion.div
                    className="absolute inset-0 transform translate-x-4 translate-y-4 rounded-3xl opacity-60"
                    style={{
                      background: `linear-gradient(135deg, ${transparentize(
                        0.5, // Less transparency for more vibrant color
                        primaryColor
                      )}, ${transparentize(0.6, secondaryColor)})`,
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

                  {/* Photo container with dark theme styling */}
                  <div
                    className="relative z-2 rounded-3xl overflow-hidden shadow-lg"
                    style={{
                      aspectRatio: "3/4",
                      border: `6px solid rgba(40,40,60,1)`, // Richer border with blue undertone
                      boxShadow: `
                        0 20px 40px rgba(0,0,0,0.5),
                        0 10px 20px rgba(0,0,0,0.4),
                        inset 0 0 0 1px rgba(255,255,255,0.15),
                        0 0 30px ${transparentize(
                          0.5,
                          primaryColor
                        )}, // More vibrant glow
                        0 0 60px ${transparentize(
                          0.8,
                          accentColor
                        )} // Additional colorful glow
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
                          background: `linear-gradient(135deg, ${darken(
                            0.3,
                            primaryColor
                          )}, ${darken(0.3, secondaryColor)})`,
                        }}
                      >
                        <span className="text-[10rem] sm:text-[12rem] font-black text-white/90">
                          {" "}
                          {/* Further increased font size and weight for mobile visibility */}
                          {student?.fullName?.[0]?.toUpperCase() || "?"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Name and Personal Info Section - Below Photo */}
                <div
                  className="mt-4 space-y-4 bg-gray-900 shadow-lg backdrop-blur-md rounded-xl p-4" // Increased padding
                  style={{
                    boxShadow: `0 10px 20px ${transparentize(
                      0.8,
                      primaryColor
                    )}`,
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    borderLeft: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  {/* Name Display - bolder text with vibrant gradient */}
                  <h1
                    className="text-4xl sm:text-5xl font-black mb-2 leading-tight text-center"
                    style={{
                      background: `linear-gradient(135deg, ${lighten(
                        0.6, // Much brighter gradient start
                        primaryColor
                      )}, ${lighten(0.5, secondaryColor)}, ${lighten(
                        0.6,
                        accentColor
                      )})`, // Add third color for more vibrant gradient
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      textShadow:
                        "0 2px 8px rgba(0,0,0,0.6), 0 0 25px rgba(255,255,255,0.3)", // Enhanced glow
                    }}
                  >
                    {student?.fullName || "Student Name"}
                  </h1>

                  {/* Personal Details - dark theme styling */}
                  <div className="flex flex-wrap justify-center gap-3 mt-3 mb-2">
                    {/* Birthday */}
                    {(student?.birthMonth || student?.birthDay) && (
                      <div className="bg-gray-800 px-4 py-2 rounded-full text-lg shadow-sm">
                        <span
                          className="font-bold"
                          style={{ color: lighten(0.3, secondaryColor) }}
                        >
                          Birthday:
                        </span>{" "}
                        <span className="text-white">
                          {student.birthMonth}
                          {student.birthDay ? ` ${student.birthDay}` : ""}
                        </span>
                      </div>
                    )}

                    {/* Relationship Status */}
                    {student?.relationshipStatus && (
                      <div className="bg-gray-800 px-4 py-2 rounded-full text-lg shadow-sm">
                        <span
                          className="font-bold"
                          style={{ color: lighten(0.3, primaryColor) }}
                        >
                          Status:
                        </span>{" "}
                        <span className="text-white">
                          {student.relationshipStatus}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Department - Without level */}
                  {student?.department && (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: secondaryColor }}
                      ></div>
                      <p className="text-lg text-white font-semibold">
                        <span
                          className="font-bold"
                          style={{ color: lighten(0.3, secondaryColor) }}
                        >
                          Department:
                        </span>{" "}
                        {student.department}
                      </p>
                    </div>
                  )}

                  {/* Track */}
                  {student?.partTract && (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: accentColor }}
                      ></div>
                      <p className="text-lg text-white font-semibold">
                        <span
                          className="font-bold"
                          style={{ color: lighten(0.3, accentColor) }}
                        >
                          Track:
                        </span>{" "}
                        {student.partTract}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Right Section - Identity and Quote */}
              <motion.div className="w-full sm:w-[62%]" variants={itemVariants}>
                <div
                  className="bg-gray-900 shadow-lg backdrop-blur-xl rounded-2xl p-6"
                  style={{
                    background: `linear-gradient(135deg, rgba(25,25,35,0.95), rgba(20,20,30,0.95))`,
                    boxShadow: `
                      0 20px 40px rgba(0,0,0,0.3),
                      0 10px 20px rgba(0,0,0,0.2),
                      inset 0 0 0 1px rgba(255,255,255,0.1),
                      0 0 15px ${transparentize(0.7, primaryColor)}
                    `,
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                    borderLeft: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {/* Quote Section - improved contrast */}
                  {student?.quote && (
                    <div className="mb-5 relative">
                      <div
                        className="absolute left-0 top-0 transform -translate-x-2 -translate-y-2 text-6xl opacity-20" // Increased font size
                        style={{ color: primaryColor }}
                      >
                        "
                      </div>
                      <div
                        className="text-xl sm:text-2xl italic font-medium mb-2 pl-6"
                        style={{
                          color: lighten(0.5, primaryColor),
                          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                        }}
                      >
                        "{student.quote}"
                      </div>
                    </div>
                  )}

                  {/* Other Contact Info - dark theme styling */}
                  <div className="flex flex-wrap gap-3">
                    {/* Email */}
                    {student?.email && (
                      <div className="bg-gray-800 px-4 py-2 rounded-full text-lg truncate max-w-[200px] shadow-sm">
                        <span
                          className="font-bold"
                          style={{ color: lighten(0.3, accentColor) }}
                        >
                          Contact:
                        </span>{" "}
                        <span className="text-white">{student.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio Section - Dark theme styling */}
                {student?.bio && (
                  <div
                    className="bg-gray-900 shadow-lg backdrop-blur-xl rounded-2xl p-6 mt-4"
                    style={{
                      boxShadow: `0 10px 30px rgba(0,0,0,0.2)`,
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                      borderLeft: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <h3
                      className="text-2xl font-extrabold mb-3 flex items-center"
                      style={{
                        color: lighten(0.3, accentColor),
                        textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                      }}
                    >
                      <div
                        className="w-3 h-3 mr-2 rounded"
                        style={{ backgroundColor: accentColor }}
                      ></div>
                      About
                    </h3>
                    <p className="text-lg text-white leading-relaxed font-medium">
                      {student.bio}
                    </p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Connections & Socials - Full width card */}
            {student?.socials && (
              <motion.div variants={itemVariants} className="w-full">
                <div
                  className="bg-gray-900 shadow-lg backdrop-blur-xl rounded-2xl p-5"
                  style={{
                    boxShadow: `0 10px 30px rgba(0,0,0,0.2)`,
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    borderLeft: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <h3
                    className="text-2xl font-extrabold mb-3"
                    style={{
                      color: lighten(0.5, secondaryColor),
                      textShadow:
                        "0 1px 3px rgba(0,0,0,0.5), 0 0 10px rgba(255,255,255,0.1)",
                    }}
                  >
                    Connect With Me
                  </h3>
                  <p className="text-lg text-white font-medium">
                    {student.socials}
                  </p>{" "}
                  {/* Increased font size */}
                </div>
              </motion.div>
            )}

            {/* Academic & Favorites Section - 2 columns with dark theme styling */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left Column - Favorites */}
              <motion.div variants={itemVariants} className="space-y-5">
                {/* Favorite Course */}
                {student?.favoriteCourse && (
                  <div
                    className="bg-gray-900 shadow-lg backdrop-blur-xl rounded-2xl p-5"
                    style={{
                      boxShadow: `0 10px 30px rgba(0,0,0,0.2)`,
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                      borderLeft: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <h3
                      className="text-2xl font-extrabold mb-3"
                      style={{
                        color: lighten(0.3, primaryColor),
                        textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                      }}
                    >
                      Favorite Course
                    </h3>
                    <p className="text-lg text-white font-medium">
                      {student.favoriteCourse}
                    </p>{" "}
                    {/* Increased font size */}
                  </div>
                )}

                {/* Favorite Lecturer */}
                {student?.favoriteLecturer && (
                  <div
                    className="bg-gray-900 shadow-lg backdrop-blur-xl rounded-2xl p-5"
                    style={{
                      boxShadow: `0 10px 30px rgba(0,0,0,0.2)`,
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                      borderLeft: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <h3
                      className="text-2xl font-extrabold mb-3"
                      style={{
                        color: lighten(0.1, displayHighlightColor),
                        textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                      }}
                    >
                      Favorite Lecturer
                    </h3>
                    <p className="text-lg text-white font-medium">
                      {student.favoriteLecturer}
                    </p>{" "}
                    {/* Increased font size */}
                  </div>
                )}

                {/* Favorite Level */}
                {student?.favoriteLevel && (
                  <div
                    className="bg-gray-900 shadow-lg backdrop-blur-xl rounded-2xl p-5"
                    style={{
                      boxShadow: `0 10px 30px rgba(0,0,0,0.2)`,
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                      borderLeft: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <h3
                      className="text-2xl font-extrabold mb-3"
                      style={{
                        color: lighten(0.3, accentColor),
                        textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                      }}
                    >
                      Favorite Level
                    </h3>
                    <p className="text-lg text-white font-medium">
                      {student.favoriteLevel}
                    </p>{" "}
                    {/* Increased font size */}
                  </div>
                )}
              </motion.div>

              {/* Right Column - Challenges */}
              <motion.div variants={itemVariants} className="space-y-5">
                {/* Shege Course */}
                {student?.shegeCourse && (
                  <div
                    className="bg-gray-900 shadow-lg backdrop-blur-xl rounded-2xl p-5"
                    style={{
                      boxShadow: `0 10px 30px rgba(0,0,0,0.2)`,
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                      borderLeft: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <h3
                      className="text-2xl font-extrabold mb-3"
                      style={{
                        color: lighten(0.3, secondaryColor),
                        textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                      }}
                    >
                      Shege Course
                    </h3>
                    <p className="text-lg text-white font-medium">
                      {student.shegeCourse}
                    </p>{" "}
                    {/* Increased font size */}
                  </div>
                )}

                {/* Shege Level */}
                {student?.shegeLevel && (
                  <div
                    className="bg-gray-900 shadow-lg backdrop-blur-xl rounded-2xl p-5"
                    style={{
                      boxShadow: `0 10px 30px rgba(0,0,0,0.2)`,
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                      borderLeft: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <h3
                      className="text-2xl font-extrabold mb-3"
                      style={{
                        color: lighten(0.1, highlightColor),
                        textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                      }}
                    >
                      Shege Level
                    </h3>
                    <p className="text-lg text-white font-medium">
                      {student.shegeLevel}
                    </p>{" "}
                    {/* Increased font size */}
                  </div>
                )}

                {/* If Not Linguistics */}
                {student?.ifNotLinguistics && (
                  <div
                    className="bg-gray-900 shadow-lg backdrop-blur-xl rounded-2xl p-5"
                    style={{
                      boxShadow: `0 10px 30px rgba(0,0,0,0.2)`,
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                      borderLeft: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <h3
                      className="text-2xl font-extrabold mb-3"
                      style={{
                        color: lighten(0.3, accentColor),
                        textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                      }}
                    >
                      If Not Linguistics
                    </h3>
                    <p className="text-lg text-white font-medium">
                      {student.ifNotLinguistics}
                    </p>{" "}
                    {/* Increased font size */}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Experiences Section - Full width with 2 col layout */}
            <motion.div variants={itemVariants} className="w-full">
              {" "}
              <div
                className="bg-gray-900 shadow-lg backdrop-blur-xl rounded-2xl p-5 sm:p-6" // Responsive padding
                style={{
                  boxShadow: `0 10px 30px rgba(0,0,0,0.2)`,
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  borderLeft: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <h3
                  className="text-2xl font-extrabold mb-4"
                  style={{
                    color: lighten(0.3, primaryColor),
                    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                  }}
                >
                  Memorable Experiences
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Best Moment */}
                  {student?.bestMoment && (
                    <div>
                      <h4
                        className="text-xl font-bold mb-3 flex items-center"
                        style={{
                          color: lighten(0.3, primaryColor),
                          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                        }}
                      >
                        <div
                          className="w-3 h-3 mr-2 rounded-full"
                          style={{ backgroundColor: primaryColor }}
                        ></div>
                        Best Moment
                      </h4>
                      <p className="text-lg text-white font-medium">
                        {student.bestMoment}
                      </p>{" "}
                      {/* Increased font size */}
                    </div>
                  )}

                  {/* Worst Moment */}
                  {student?.worstMoment && (
                    <div>
                      <h4
                        className="text-xl font-bold mb-3 flex items-center"
                        style={{
                          color: lighten(0.3, secondaryColor),
                          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                        }}
                      >
                        <div
                          className="w-3 h-3 mr-2 rounded-full"
                          style={{ backgroundColor: secondaryColor }}
                        ></div>
                        Worst Moment
                      </h4>
                      <p className="text-lg text-white font-medium">
                        {student.worstMoment}
                      </p>{" "}
                      {/* Increased font size */}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Hobbies & Interests - Full width card */}
            {student?.hobbies && (
              <motion.div variants={itemVariants} className="w-full">
                <div
                  className="bg-gray-900 shadow-lg backdrop-blur-xl rounded-2xl p-6" // Increased padding
                  style={{
                    boxShadow: `0 10px 30px rgba(0,0,0,0.2)`,
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    borderLeft: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <h3
                    className="text-2xl font-extrabold mb-3"
                    style={{
                      color: lighten(0.3, secondaryColor),
                      textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                    }}
                  >
                    Hobbies & Interests
                  </h3>
                  <p className="text-lg text-white font-medium">
                    {student.hobbies}
                  </p>{" "}
                  {/* Increased font size */}
                </div>
              </motion.div>
            )}

            {/* Achievements Section - Full width card */}
            {student?.achievements && (
              <motion.div variants={itemVariants} className="w-full">
                <div
                  className="bg-gray-900 shadow-lg backdrop-blur-xl rounded-2xl p-6" // Increased padding
                  style={{
                    boxShadow: `0 10px 30px rgba(0,0,0,0.2)`,
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    borderLeft: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <h3
                    className="text-2xl font-extrabold mb-3"
                    style={{
                      color: lighten(0.3, primaryColor),
                      textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                    }}
                  >
                    Achievements
                  </h3>
                  <p className="text-lg text-white font-medium">
                    {student.achievements}
                  </p>{" "}
                  {/* Increased font size */}
                </div>
              </motion.div>
            )}

            {/* Parting Words - Full width card */}
            {student?.partingWords && (
              <motion.div variants={itemVariants} className="w-full">
                <div
                  className="bg-gray-900 shadow-lg backdrop-blur-xl rounded-2xl p-6" // Increased padding
                  style={{
                    boxShadow: `0 10px 30px rgba(0,0,0,0.2)`,
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    borderLeft: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <h3
                    className="text-2xl font-extrabold mb-3"
                    style={{
                      color: lighten(0.3, accentColor),
                      textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                    }}
                  >
                    Parting Words
                  </h3>
                  <p className="text-lg text-white font-medium">
                    {student.partingWords}
                  </p>{" "}
                  {/* Increased font size */}
                </div>
              </motion.div>
            )}

            {/* Advice for Juniors - Prominent at the end with high contrast */}
            {student?.advice && (
              <motion.div variants={itemVariants} className="w-full">
                <div
                  className="mt-2 p-6 bg-gray-800 shadow-lg backdrop-blur-md rounded-xl border-2" // Increased padding
                  style={{
                    background: `linear-gradient(135deg, rgba(30,30,40,0.95), rgba(20,20,35,0.95))`,
                    boxShadow: `0 10px 30px rgba(0,0,0,0.3), 0 0 20px ${transparentize(
                      0.7,
                      safeHighlightColor
                    )}`,
                    borderColor: safeHighlightColor,
                    borderWidth: "2px",
                  }}
                >
                  <h3
                    className="text-2xl font-extrabold mb-3"
                    style={{
                      color: lighten(0.1, displayHighlightColor),
                      textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                    }}
                  >
                    Advice for Juniors
                  </h3>
                  <p className="text-xl text-white italic font-medium">
                    "{student.advice}"
                  </p>{" "}
                  {/* Increased font size */}
                </div>
              </motion.div>
            )}

            {/* Bottom bar - Date and branding with dark theme styling */}
            <motion.div className="mt-auto" variants={itemVariants}>
              <div
                className="flex justify-between items-center bg-gray-900 shadow-lg backdrop-blur-xl rounded-2xl p-4"
                style={{
                  boxShadow: `0 10px 30px rgba(0,0,0,0.2)`,
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  borderLeft: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div
                  className="text-lg font-semibold px-3 py-1.5 rounded-full bg-gray-800 shadow-inner"
                  style={{
                    color: lighten(0.4, primaryColor),
                    border: "1px solid rgba(255,255,255,0.1)",
                    textShadow: "0 1px 1px rgba(0,0,0,0.3)",
                  }}
                >
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </div>

                {branding && (
                  <div
                    className="text-xl font-black uppercase px-4 py-1.5 rounded-full shadow-inner" // Larger text and enhanced boldness
                    style={{
                      background: `linear-gradient(135deg, ${darken(
                        0.2,
                        primaryColor
                      )}, ${darken(0.1, secondaryColor)})`,
                      color: lighten(0.6, primaryColor), // Even brighter text
                      border: "1px solid rgba(255,255,255,0.2)",
                      textShadow:
                        "0 2px 4px rgba(0,0,0,0.7), 0 0 10px rgba(255,255,255,0.3)", // Enhanced glow
                      letterSpacing: "1px", // Add letter spacing for better readability
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
