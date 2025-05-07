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

export default function PremiumTemplate({
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
  const goldColor = "#FFD700"; // Gold for premium feel

  // Refined color palette for premium look
  const goldGradient = `linear-gradient(135deg, ${goldColor}, #FFC107)`;
  const darkBackground = darken(0.75, primaryColor);
  const subtleGold = transparentize(0.9, goldColor);

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

  // Helper function to render details if they exist
  const renderDetailItem = (label: string, value: string | undefined) => {
    if (!value) return null;
    return (
      <div className="mb-4">
        <h3 className="text-gold text-sm uppercase tracking-widest mb-1">
          {label}
        </h3>
        <p className="text-white text-lg">{value}</p>
      </div>
    );
  };

  return (
    <div
      className="premium-template h-full w-full flex flex-col relative overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, ${darkBackground}, ${darken(
          0.7,
          primaryColor
        )})`,
        color: "#FFFFFF",
      }}
    >
      {/* Gold accents and patterns */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top luxury pattern */}
        <div
          className="absolute top-0 left-0 right-0 h-40 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${goldColor.replace(
              "#",
              ""
            )}' fill-opacity='0.6'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Corner gold embellishment */}
        <motion.div
          className="absolute top-0 right-0 w-40 h-40"
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 0.3, scale: 1, rotate: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <svg
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            fill={goldColor}
          >
            <path d="M0,0 L100,0 L100,100 C70,90 50,70 0,0 Z" />
          </svg>
        </motion.div>

        {/* Bottom gold embellishment */}
        <motion.div
          className="absolute bottom-0 left-0 w-full h-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          <svg
            viewBox="0 0 100 20"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            fill={goldColor}
          >
            <path d="M0,20 L100,20 L100,15 C85,5 70,15 55,10 C40,5 20,15 0,5 L0,20 Z" />
          </svg>
        </motion.div>
      </div>

      {/* Background logo watermark */}
      {branding && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-[80%] h-[80%] opacity-5"
            initial={{ opacity: 0, rotate: -5 }}
            animate={{ opacity: 0.05, rotate: 0 }}
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
                <span className="text-[20rem] font-thin text-white opacity-10">
                  L
                </span>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col h-full w-full px-16 py-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header with gold accent */}
        <motion.div className="mb-10" variants={itemVariants}>
          <div
            className="w-40 h-1 mb-3"
            style={{ background: goldGradient }}
          ></div>
          <div className="flex justify-between items-center">
            <div>
              <h2
                className="text-xl uppercase tracking-widest"
                style={{ color: goldColor }}
              >
                Personality of the Week
              </h2>
              <p className="text-sm text-gray-300">
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            </div>
            {branding && (
              <div
                className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-lg p-2 flex items-center justify-center"
                style={{ border: `1px solid ${goldColor}` }}
              >
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
                      className="text-xl font-bold"
                      style={{ color: goldColor }}
                    >
                      L
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Student Name in premium styling */}
        <motion.h1
          variants={itemVariants}
          className="text-7xl font-bold mb-8 leading-tight"
          style={{
            background: goldGradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: `0 5px 30px ${subtleGold}`,
          }}
        >
          {student?.fullName || "Student Name"}
        </motion.h1>

        {/* Main content area with photo and details */}
        <div className="flex flex-1 gap-16 mb-10">
          {/* Left column with decorated photo */}
          <motion.div variants={itemVariants} className="w-2/5">
            <div className="relative">
              {/* Gold frame */}
              <div
                className="absolute -inset-2 rounded-lg"
                style={{
                  background: goldGradient,
                  opacity: 0.7,
                  boxShadow: `0 0 30px ${subtleGold}`,
                }}
              ></div>

              {/* Inner border */}
              <div
                className="absolute -inset-1 rounded-lg"
                style={{
                  background: darkBackground,
                  borderRadius: "0.5rem",
                }}
              ></div>

              {/* Photo */}
              <div className="relative rounded-lg overflow-hidden aspect-[3/4] shadow-2xl">
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
                      background: `linear-gradient(135deg, ${transparentize(
                        0.8,
                        primaryColor
                      )}, ${transparentize(0.8, secondaryColor)})`,
                    }}
                  >
                    <span
                      className="text-[8rem] font-light"
                      style={{ color: goldColor }}
                    >
                      {student?.fullName?.[0]?.toUpperCase() || "?"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Program and level with premium styling */}
            <div className="mt-8 space-y-2">
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-3"
              >
                <div
                  className="w-10 h-0.5"
                  style={{ background: goldGradient }}
                ></div>
                <span
                  className="text-lg font-medium"
                  style={{ color: goldColor }}
                >
                  {student?.birthMonth && student?.birthDay
                    ? `${student.birthMonth} ${student.birthDay}`
                    : "Birth Month & Day"}
                </span>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex items-center gap-3"
              >
                <div
                  className="w-10 h-0.5"
                  style={{ background: goldGradient }}
                ></div>
                <span className="text-lg text-gray-300">
                  {" "}
                  Relationship Status: {student?.relationshipStatus || "Status"}
                </span>
              </motion.div>

              {student?.matricNumber && (
                <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-3 mt-4"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{
                      background: goldGradient,
                      boxShadow: `0 0 10px ${subtleGold}`,
                    }}
                  >
                    <span className="text-xs">#</span>
                  </div>
                  <span className="text-gray-300">{student.matricNumber}</span>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Right column with details */}
          <div className="w-3/5 flex flex-col">
            {/* Quote styled as premium */}
            {student?.quote && (
              <motion.div variants={itemVariants} className="mb-8">
                <div
                  className="text-2xl italic font-light leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.9)" }}
                >
                  <span
                    className="text-4xl block mb-2"
                    style={{ color: goldColor }}
                  >
                    "
                  </span>
                  {student.quote}
                  <span
                    className="text-4xl block mt-2"
                    style={{ color: goldColor }}
                  >
                    "
                  </span>
                </div>
              </motion.div>
            )}

            {/* Bio section */}
            {student?.bio && (
              <motion.div variants={itemVariants} className="mb-8">
                <div
                  className="w-16 h-0.5 mb-4"
                  style={{ background: goldGradient }}
                ></div>
                <h3
                  className="text-xl uppercase tracking-widest mb-3"
                  style={{ color: goldColor }}
                >
                  About
                </h3>
                <p className="text-gray-300 leading-relaxed">{student.bio}</p>
              </motion.div>
            )}

            {/* Grid for additional details */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-x-8 gap-y-4"
            >
              {renderDetailItem("Hobbies & Interests", student?.hobbies)}
              {renderDetailItem("Favorite Course(s)", student?.favoriteCourse)}
              {renderDetailItem("Shege Course(s)", student?.shegeCourse)}
              {renderDetailItem("Social(s)", student?.socials)}
              {renderDetailItem("Best Moment", student?.bestMoment)}
              {renderDetailItem("Worst Moment", student?.worstMoment)}
              {renderDetailItem(
                "I think i am better in",
                student?.specializationTrack
              )}
              {renderDetailItem(
                "If not Linguistics, I would have studied",
                student?.ifNotLinguistics
              )}
            </motion.div>

            {/* Student advice or parting words */}
            {student?.advice && (
              <motion.div
                variants={itemVariants}
                className="mt-auto pt-6 border-t border-white/10"
              >
                <p
                  className="text-lg italic leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.8)" }}
                >
                  "{student.advice}"
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer with premium styling */}
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center mt-auto pt-4 border-t border-white/10"
        >
          <div className="text-sm text-gray-400">
            {new Date().getFullYear()} © LINCSSA
          </div>

          {branding && (
            <div className="flex items-center gap-2">
              <span
                className="text-xs uppercase tracking-widest"
                style={{ color: goldColor }}
              >
                LINGUISTICS & COMMUNICATIONS STUDENTS' ASSOCIATION
              </span>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
