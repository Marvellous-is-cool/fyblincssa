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

export default function VibrantTemplate({
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

  // Use royal blue color scheme - flashy and vibrant
  const primaryColor = "#0052CC"; // Royal blue
  const secondaryColor = "#003D99"; // Darker royal blue
  const accentColor = "#0066FF"; // Bright royal blue
  const energyColor = "#4D79FF"; // Light royal blue

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

  // Create a more vibrant gradient background with three colors
  const gradientBg = `linear-gradient(135deg, ${primaryColor}, ${secondaryColor}, ${lighten(
    0.1,
    accentColor
  )})`;

  // Bubble animation for background elements - more dynamic
  const bubbleAnimation = {
    y: [0, -15, 0],
    scale: [1, 1.08, 1],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "mirror" as const,
      ease: "easeInOut",
    },
  };

  return (
    <div
      className="vibrant-template h-full w-full flex flex-col relative overflow-hidden"
      style={{ aspectRatio: "0.5/1" }}
    >
      {/* Custom scrollbar style */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>

      {/* Gradient Background */}
      <div
        className="absolute inset-0"
        style={{
          background: gradientBg,
        }}
      />

      {/* Vibrant Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Circles - Increased brightness and size */}
        <motion.div
          animate={mounted ? bubbleAnimation : {}}
          className="absolute -right-32 -top-32 w-96 h-96 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${transparentize(
              0.1, // Even less transparency for more vibrant color
              primaryColor
            )}, ${transparentize(1, primaryColor)})`,
            filter: "blur(15px)", // Less blur for sharper appearance
            mixBlendMode: "screen", // Add blend mode for more vibrant appearance
          }}
        />

        <motion.div
          animate={
            mounted
              ? {
                  ...bubbleAnimation,
                  transition: { ...bubbleAnimation.transition, delay: 1 },
                }
              : {}
          }
          className="absolute -left-40 top-1/4 w-96 h-96 rounded-full"
          style={{
            background: `radial-gradient(circle at 70% 70%, ${transparentize(
              0.2, // Less transparency
              accentColor
            )}, ${transparentize(1, accentColor)})`,
            filter: "blur(20px)", // Less blur
            mixBlendMode: "screen", // More vibrant appearance
          }}
        />

        <motion.div
          animate={
            mounted
              ? {
                  ...bubbleAnimation,
                  transition: { ...bubbleAnimation.transition, delay: 2 },
                }
              : {}
          }
          className="absolute right-20 bottom-32 w-[500px] h-[500px] rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${transparentize(
              0.3, // Less transparency
              energyColor
            )}, ${transparentize(1, energyColor)})`,
            filter: "blur(25px)", // Less blur
            mixBlendMode: "screen", // More vibrant appearance
          }}
        />

        {/* Geometric Shapes */}
        <svg
          className="absolute top-10 right-10 w-64 h-64 opacity-20"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="40" fill="white" />
          <circle cx="50" cy="50" r="30" fill="transparent" stroke="white" />
          <circle cx="50" cy="50" r="20" fill="transparent" stroke="white" />
        </svg>

        <svg
          className="absolute bottom-0 left-20 w-32 h-32 opacity-20"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            points="50,15 100,100 0,100"
            fill="white"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Background logo if branding enabled */}
      {branding && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-[100%] h-[100%] opacity-0"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 0.07, scale: 1.05 }}
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
                <span className="text-[40rem] font-bold text-white opacity-10">
                  L
                </span>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col h-full w-full px-2 py-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-0"
          variants={itemVariants}
        >
          <div className="mt-12 mb-12 bg-white/20 backdrop-blur-md rounded-full px-3 py-3 shadow-lg">
            <p className="text-white font-bold tracking-wider text-xl">
              PERSONALITY OF THE DAY
            </p>
          </div>

          {branding && (
            <div className="flex items-center gap-5">
              <div className="bg-white/20 backdrop-blur-md rounded-full px-5 py-2 shadow-lg">
                <p className="text-white text-lg font-bold">
                  LINCSSA Phonix'25🙃
                </p>
              </div>

              <div className="bg-white rounded-full p-1 shadow-lg h-16 w-16 flex items-center justify-center">
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="w-full h-full object-contain"
                  onError={handleLogoError}
                  style={{ display: logoError ? "none" : "block" }}
                />
                {logoError && (
                  <div className="w-full h-full flex items-center justify-center">
                    <span
                      className="text-base font-bold"
                      style={{ color: primaryColor }}
                    >
                      L
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Main content with photo and details */}
        <div className="flex flex-1 gap-2 h-[calc(100%-24px)] overflow-hidden">
          {/* Left column with dynamic photo frame */}
          <motion.div variants={itemVariants} className="w-[35%] flex flex-col">
            {/* Social Connect - Now above the profile image */}
            {student?.socials && (
              <motion.div
                variants={itemVariants}
                className="mb-3 bg-white/15 backdrop-blur-md rounded-xl p-2 shadow-lg"
              >
                <h3 className="text-white/90 text-xl font-bold mb-1">
                  Connect With Me
                </h3>
                <p className="text-white text-base font-medium">
                  {student.socials}
                </p>
              </motion.div>
            )}

            {/* Profile Image - Adjusted aspect ratio */}
            <motion.div
              className="relative rounded-2xl overflow-hidden shadow-xl aspect-[1/1.9]"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {/* Colorful photo frame border */}
              <div className="absolute inset-0 p-2 bg-gradient-to-br from-transparent via-white/20 to-white/40 backdrop-blur-md">
                <div className="w-full h-full rounded-xl overflow-hidden">
                  {student?.photoURL ? (
                    <img
                      src={student.photoURL}
                      alt={student.fullName}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: "left top" }}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(45deg, ${transparentize(
                          0.7,
                          primaryColor
                        )}, ${transparentize(0.7, secondaryColor)})`,
                      }}
                    >
                      <span className="text-[12rem] font-bold text-white">
                        {student?.fullName?.[0]?.toUpperCase() || "?"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Student Name and details below photo */}
            <motion.div variants={itemVariants} className="mt-1">
              <h1 className="text-white text-3xl sm:text-4xl font-black leading-tight mb-1 drop-shadow-lg">
                {student?.fullName || "Student Name"}
              </h1>

              <div className="flex flex-wrap items-center gap-0.5 mb-1">
                {(student?.birthMonth || student?.birthDay) && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/30 backdrop-blur-md rounded-full px-2 py-0 shadow-lg inline-block"
                  >
                    <p className="text-white text-sm font-semibold">
                      {student?.birthMonth && student?.birthDay
                        ? `${student.birthMonth} ${student.birthDay}`
                        : student?.birthMonth || "Birth Month & Day"}
                    </p>
                  </motion.div>
                )}

                {student?.relationshipStatus && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/30 backdrop-blur-md rounded-full px-2 py-0 shadow-lg inline-block"
                  >
                    <p className="text-white text-sm font-semibold">
                      {student.relationshipStatus}
                    </p>
                  </motion.div>
                )}

                {student?.specializationTrack && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/30 backdrop-blur-md rounded-full px-2 py-0 shadow-lg inline-block"
                  >
                    <p className="text-white text-sm font-semibold">
                      {student.specializationTrack}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Right column with details */}
          <div className="w-[65%] flex flex-col max-h-full overflow-y-auto pr-1 custom-scrollbar">
            {/* Quote in a vibrant styled box */}
            {student?.quote && (
              <motion.div
                variants={itemVariants}
                className="mb-6 bg-white/20 backdrop-blur-md rounded-2xl p-4 shadow-lg"
                style={{
                  border: `1px solid rgba(255,255,255,0.3)`,
                  background: `linear-gradient(135deg, ${transparentize(
                    0.85,
                    primaryColor
                  )}, ${transparentize(0.85, secondaryColor)})`,
                  boxShadow: `0 8px 20px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.3)`,
                }}
              >
                <p className="text-white text-xl italic font-xl leading-tight">
                  "{student.quote}"
                </p>
              </motion.div>
            )}

            {/* Bio with vibrant styling */}
            {student?.bio && (
              <motion.div
                variants={itemVariants}
                className="mb-3 bg-white/15 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/20"
              >
                <h3 className="text-white text-xl font-bold mb-0 flex items-center gap-0.5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: energyColor }}
                  ></div>
                  About Me
                </h3>
                <p className="text-white/90 text-xl font-medium leading-snug">
                  {student.bio}
                </p>
              </motion.div>
            )}

            {/* Details grid with vibrant cards - optimized for mobile */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 gap-0.5"
            >
              {/* Hobbies */}
              {student?.hobbies && (
                <motion.div
                  whileHover={{ y: -3 }}
                  className="mb-3 bg-white/20 backdrop-blur-md rounded-xl p-5 shadow-lg border border-white/30"
                >
                  <h3 className="text-white/90 text-xl font-semibold mb-1 flex items-center gap-0.5">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: secondaryColor }}
                    ></div>
                    Hobbies & Interests
                  </h3>
                  <p className="text-white text-lg font-medium">
                    {student.hobbies}
                  </p>
                </motion.div>
              )}

              {/* Favorite Course */}
              {student?.favoriteCourse && (
                <motion.div
                  whileHover={{ y: -2 }}
                  className="mb-3 bg-white/20 backdrop-blur-md rounded-xl p-5 shadow-lg border border-white/30"
                >
                  <h3 className="text-white/90 text-xl font-semibold mb-1 flex items-center gap-0.5">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: primaryColor }}
                    ></div>
                    Favorite Course
                  </h3>
                  <p className="text-white text-lg font-medium">
                    {student.favoriteCourse}
                  </p>
                </motion.div>
              )}

              {/* Shege Course */}
              {student?.shegeCourse && (
                <motion.div
                  whileHover={{ y: -2 }}
                  className="mb-3 bg-white/20 backdrop-blur-md rounded-xl p-5 shadow-lg border border-white/30"
                >
                  <h3 className="text-white/90 text-xl font-semibold mb-1 flex items-center gap-0.5">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: primaryColor }}
                    ></div>
                    Shege Course
                  </h3>
                  <p className="text-white text-lg font-medium">
                    {student.shegeCourse}
                  </p>
                </motion.div>
              )}

              {/* Best Moment */}
              {student?.bestMoment && (
                <motion.div
                  whileHover={{ y: -2 }}
                  className="mb-3 bg-white/20 backdrop-blur-md rounded-xl p-5 shadow-lg border border-white/30"
                >
                  <h3 className="text-white/90 text-xl font-semibold mb-1 flex items-center gap-0.5">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: energyColor }}
                    ></div>
                    Best Moment
                  </h3>
                  <p className="text-white text-lg font-medium">
                    {student.bestMoment.length > 90
                      ? student.bestMoment.substring(0, 90) + "..."
                      : student.bestMoment}
                  </p>
                </motion.div>
              )}

              {/* Worst Moment */}
              {student?.worstMoment && (
                <motion.div
                  whileHover={{ y: -2 }}
                  className="bg-white/20 backdrop-blur-md rounded-xl p-5 mb-3 shadow-lg border border-white/30"
                >
                  <h3 className="text-white/90 text-xl font-semibold mb-1 flex items-center gap-0.5">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: energyColor }}
                    ></div>
                    Worst Moment
                  </h3>
                  <p className="text-white text-lg font-medium">
                    {student.worstMoment.length > 90
                      ? student.worstMoment.substring(0, 90) + "..."
                      : student.worstMoment}
                  </p>
                </motion.div>
              )}

              {/* Favorite Lecturer */}
              {student?.favoriteLecturer && (
                <motion.div
                  whileHover={{ y: -2 }}
                  className="mb-3 bg-white/20 backdrop-blur-md rounded-xl p-5 shadow-lg border border-white/30"
                >
                  <h3 className="text-white/90 text-xl font-semibold mb-1 flex items-center gap-0.5">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    ></div>
                    Favorite Lecturer
                  </h3>
                  <p className="text-white text-lg font-medium">
                    {student.favoriteLecturer}
                  </p>
                </motion.div>
              )}

              {/* Favorite Level */}
              {student?.favoriteLevel && (
                <motion.div
                  whileHover={{ y: -2 }}
                  className="mb-3 bg-white/20 backdrop-blur-md rounded-xl p-5 shadow-lg border border-white/30"
                >
                  <h3 className="text-white/90 text-xl font-semibold mb-1 flex items-center gap-0.5">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    ></div>
                    Favorite Level
                  </h3>
                  <p className="text-white text-lg font-medium">
                    {student.favoriteLevel}
                  </p>
                </motion.div>
              )}

              {/* Shege Level */}
              {student?.shegeLevel && (
                <motion.div
                  whileHover={{ y: -2 }}
                  className="mb-3 bg-white/20 backdrop-blur-md rounded-xl p-5 shadow-lg border border-white/30"
                >
                  <h3 className="text-white/90 text-xl font-semibold mb-1 flex items-center gap-0.5">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    ></div>
                    Shege Level
                  </h3>
                  <p className="text-white text-lg font-medium">
                    {student.shegeLevel}
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Advice for juniors - highlight box */}
            {student?.advice && (
              <motion.div
                variants={itemVariants}
                className="mt-4 bg-white/30 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/40"
                style={{
                  background: `linear-gradient(135deg, ${transparentize(
                    0.8,
                    primaryColor
                  )}, ${transparentize(0.7, accentColor)})`,
                }}
              >
                <h3 className="text-white text-xl font-bold mb-1 flex items-center gap-0.5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: energyColor }}
                  ></div>
                  Advice for Juniors
                </h3>
                <p className="text-white text-xl font-medium leading-snug italic">
                  "{student.advice}"
                </p>
              </motion.div>
            )}

            {/* If not Linguistics - highlight box */}
            {student?.ifNotLinguistics && (
              <motion.div
                variants={itemVariants}
                className="mt-4 bg-white/30 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/40 mb-0"
                style={{
                  background: `linear-gradient(135deg, ${transparentize(
                    0.8,
                    secondaryColor
                  )}, ${transparentize(0.7, energyColor)})`,
                }}
              >
                <h3 className="text-white text-xl font-bold mb-1 flex items-center gap-0.5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: secondaryColor }}
                  ></div>
                  If not Linguistics
                </h3>
                <p className="text-white text-lg font-medium leading-snug">
                  {student.ifNotLinguistics}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer */}
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center mt-0"
        >
          {/* Date */}
          <div className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1 shadow-lg">
            {" "}
            <p className="text-white text-sm font-medium">
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* LINCSSA Branding */}
          {branding && (
            <div className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1 shadow-lg">
              <p className="text-white text-sm font-medium">
                LINGUISTICS & COMMUNICATIONS STUDENTS' ASSOCIATION
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
