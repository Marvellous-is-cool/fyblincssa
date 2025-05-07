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

  // Use the dominant colors or fallback to defaults
  const primaryColor = colors[0] || "#7C4DFF";
  const secondaryColor = colors[1] || "#FF4081";
  const accentColor = colors[2] || "#1E3A8A";
  const energyColor = colors[3] || "#ffa726";

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

  // Create a vibrant gradient background
  const gradientBg = `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`;

  // Bubble animation for background elements
  const bubbleAnimation = {
    y: [0, -10, 0],
    scale: [1, 1.05, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "mirror" as const,
      ease: "easeInOut",
    },
  };

  return (
    <div className="vibrant-template h-full w-full flex flex-col relative overflow-hidden">
      {/* Gradient Background */}
      <div
        className="absolute inset-0"
        style={{
          background: gradientBg,
        }}
      />

      {/* Vibrant Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Circles */}
        <motion.div
          animate={mounted ? bubbleAnimation : {}}
          className="absolute -right-24 -top-24 w-64 h-64 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${transparentize(
              0.3,
              secondaryColor
            )}, ${transparentize(1, secondaryColor)})`,
            filter: "blur(30px)",
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
          className="absolute -left-32 top-1/4 w-80 h-80 rounded-full"
          style={{
            background: `radial-gradient(circle at 70% 70%, ${transparentize(
              0.4,
              energyColor
            )}, ${transparentize(1, energyColor)})`,
            filter: "blur(40px)",
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
          className="absolute right-20 bottom-32 w-96 h-96 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${transparentize(
              0.6,
              accentColor
            )}, ${transparentize(1, accentColor)})`,
            filter: "blur(60px)",
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
            className="w-[80%] h-[80%] opacity-5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.05, scale: 1 }}
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
                <span className="text-[20rem] font-bold text-white opacity-10">
                  L
                </span>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col h-full w-full px-12 py-14"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-8"
          variants={itemVariants}
        >
          <div className="bg-white/20 backdrop-blur-md rounded-full px-6 py-2.5 shadow-lg">
            <p className="text-white font-medium tracking-wider text-lg">
              PERSONALITY OF THE DAY
            </p>
          </div>

          {branding && (
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-md rounded-full px-4 py-1 shadow-lg">
                <p className="text-white text-sm">LINCSSA</p>
              </div>

              <div className="bg-white rounded-full p-1.5 shadow-lg h-10 w-10 flex items-center justify-center">
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
                      className="text-sm font-bold"
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

        {/* Student Name */}
        <motion.div variants={itemVariants} className="mb-10">
          <h1 className="text-white text-7xl font-black leading-none mb-4 drop-shadow-lg">
            {student?.fullName || "Student Name"}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mb-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/30 backdrop-blur-md rounded-full px-4 py-1 shadow-lg inline-block"
            >
              <p className="text-white text-sm font-medium">
                {student?.birthMonth && student?.birthDay
                  ? `${student.birthMonth} ${student.birthDay}`
                  : "Birth Month & Day"}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/30 backdrop-blur-md rounded-full px-4 py-1 shadow-lg inline-block"
            >
              <p className="text-white text-sm font-medium">
                {student?.relationshipStatus || "Relationship Status"}
              </p>
            </motion.div>

            {student?.specializationTrack && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/30 backdrop-blur-md rounded-full px-4 py-1 shadow-lg inline-block"
              >
                <p className="text-white text-sm font-medium">
                  {student.specializationTrack}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Main content with photo and details */}
        <div className="flex flex-1 gap-8">
          {/* Left column with dynamic photo frame */}
          <motion.div variants={itemVariants} className="w-[45%]">
            {/* Matric number and other details */}
            {student?.matricNumber && (
              <motion.div
                variants={itemVariants}
                className="mb-4 flex justify-center"
              >
                <div className="bg-white/20 backdrop-blur-md rounded-full px-6 py-2 shadow-lg">
                  <p className="text-white text-sm font-medium">
                    {student.matricNumber}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Social Connect - Now above the profile image */}
            {student?.socials && (
              <motion.div
                variants={itemVariants}
                className="mb-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-lg"
              >
                <h3 className="text-white/80 text-sm font-medium mb-2">
                  Connect With Me
                </h3>
                <p className="text-white text-sm">{student.socials}</p>
              </motion.div>
            )}

            {/* Profile Image - Fixed display issues */}
            <motion.div
              className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[3/4]"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
            >
              {/* Colorful photo frame border */}
              <div className="absolute inset-0 p-3 bg-gradient-to-br from-transparent via-white/20 to-white/40 backdrop-blur-md">
                <div className="w-full h-full rounded-2xl overflow-hidden">
                  {student?.photoURL ? (
                    <img
                      src={student.photoURL}
                      alt={student.fullName}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: "center top" }}
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
                      <span className="text-[8rem] font-bold text-white">
                        {student?.fullName?.[0]?.toUpperCase() || "?"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right column with details */}
          <div className="w-[55%] flex flex-col">
            {/* Quote in a vibrant styled box */}
            {student?.quote && (
              <motion.div
                variants={itemVariants}
                className="mb-6 bg-white/15 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/20"
              >
                <p className="text-white text-xl italic leading-relaxed">
                  "{student.quote}"
                </p>
              </motion.div>
            )}

            {/* Bio with vibrant styling */}
            {student?.bio && (
              <motion.div
                variants={itemVariants}
                className="mb-6 bg-white/15 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/20"
              >
                <h3 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: energyColor }}
                  ></div>
                  About Me
                </h3>
                <p className="text-white/90 leading-relaxed">{student.bio}</p>
              </motion.div>
            )}

            {/* Details grid with vibrant cards */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-4"
            >
              {/* Hobbies */}
              {student?.hobbies && (
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white/15 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20"
                >
                  <h3 className="text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: secondaryColor }}
                    ></div>
                    Hobbies & Interests
                  </h3>
                  <p className="text-white text-sm">{student.hobbies}</p>
                </motion.div>
              )}

              {/* Favorite Course */}
              {student?.favoriteCourse && (
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white/15 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20"
                >
                  <h3 className="text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: primaryColor }}
                    ></div>
                    Favorite Course
                  </h3>
                  <p className="text-white text-sm">{student.favoriteCourse}</p>
                </motion.div>
              )}

              {/* Shege Course */}
              {student?.shegeCourse && (
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white/15 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20"
                >
                  <h3 className="text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: primaryColor }}
                    ></div>
                    Shege Course
                  </h3>
                  <p className="text-white text-sm">{student.shegeCourse}</p>
                </motion.div>
              )}

              {/* Best Moment */}
              {student?.bestMoment && (
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white/15 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20"
                >
                  <h3 className="text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: energyColor }}
                    ></div>
                    Best Moment
                  </h3>
                  <p className="text-white text-sm">
                    {student.bestMoment.length > 100
                      ? student.bestMoment.substring(0, 100) + "..."
                      : student.bestMoment}
                  </p>
                </motion.div>
              )}

              {/* Worst Moment */}
              {student?.worstMoment && (
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white/15 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20"
                >
                  <h3 className="text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: energyColor }}
                    ></div>
                    Worst Moment
                  </h3>
                  <p className="text-white text-sm">
                    {student.worstMoment.length > 100
                      ? student.worstMoment.substring(0, 100) + "..."
                      : student.worstMoment}
                  </p>
                </motion.div>
              )}

              {/* Favorite Lecturer */}
              {student?.favoriteLecturer && (
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white/15 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20"
                >
                  <h3 className="text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    ></div>
                    Favorite Lecturer
                  </h3>
                  <p className="text-white text-sm">
                    {student.favoriteLecturer}
                  </p>
                </motion.div>
              )}

              {/* Favorite Level */}
              {student?.favoriteLevel && (
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white/15 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20"
                >
                  <h3 className="text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    ></div>
                    Favorite Level
                  </h3>
                  <p className="text-white text-sm">{student.favoriteLevel}</p>
                </motion.div>
              )}

              {/* Shege Level */}
              {student?.shegeLevel && (
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white/15 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20"
                >
                  <h3 className="text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    ></div>
                    shege Level
                  </h3>
                  <p className="text-white text-sm">{student.shegeLevel}</p>
                </motion.div>
              )}
            </motion.div>

            {/* Advice for juniors - highlight box */}
            {student?.advice && (
              <motion.div
                variants={itemVariants}
                className="mt-6 bg-white/25 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/30"
              >
                <h3 className="text-white text-lg font-bold mb-3">
                  Advice for Juniors
                </h3>
                <p className="text-white leading-relaxed italic">
                  "{student.advice}"
                </p>
              </motion.div>
            )}
            {/* If not Linguistics - highlight box */}
            {student?.ifNotLinguistics && (
              <motion.div
                variants={itemVariants}
                className="mt-6 bg-white/25 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/30"
              >
                <h3 className="text-white text-lg font-bold mb-3">
                  If not Linguistics
                </h3>
                <p className="text-white leading-relaxed italic">
                  {student.ifNotLinguistics}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer */}
        <motion.div
          variants={itemVariants}
          className="mt-8 flex justify-between items-center"
        >
          {/* Date */}
          <div className="bg-white/20 backdrop-blur-md rounded-full px-4 py-2 shadow-lg">
            <p className="text-white text-sm">
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* LINCSSA Branding */}
          {branding && (
            <div className="bg-white/20 backdrop-blur-md rounded-full px-4 py-2 shadow-lg">
              <p className="text-white text-sm">
                LINGUISTICS & COMMUNICATIONS STUDENTS' ASSOCIATION
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
