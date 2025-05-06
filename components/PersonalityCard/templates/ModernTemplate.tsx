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

  // Use the dominant colors or fallback to defaults
  const primaryColor = colors[0] || "#7C4DFF";
  const secondaryColor = colors[1] || "#FF4081";
  const accentColor = colors[2] || "#1E3A8A";
  const highlightColor = colors[3] || "#FFD700";

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
    opacity: [0.7, 0.9, 0.7],
    transition: {
      duration: 8,
      repeat: Infinity,
      repeatType: "mirror" as const,
      ease: "easeInOut",
    },
  };

  return (
    <div className="modern-template h-full w-full flex flex-col relative overflow-hidden">
      {/* Dynamic split design background */}
      <div className="absolute inset-0 flex">
        {/* Left split - gradient color */}
        <div
          className="w-[45%] h-full"
          style={{
            background: `linear-gradient(135deg, ${darken(
              0.1,
              primaryColor
            )}, ${primaryColor} 70%, ${lighten(0.1, primaryColor)})`,
            boxShadow: `10px 0 30px ${transparentize(0.7, primaryColor)}`,
          }}
        ></div>

        {/* Right split - white */}
        <div className="w-[55%] h-full bg-white"></div>
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large circle shape */}
        <motion.div
          animate={mounted ? pulseAnimation : {}}
          className="absolute w-[90vw] h-[90vw] rounded-full top-1/2 left-[-45vw] transform -translate-y-1/2"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${primaryColor}, ${transparentize(
              1,
              primaryColor
            )} 70%)`,
            mixBlendMode: "soft-light",
          }}
        ></motion.div>

        {/* Medium circle shape */}
        <motion.div
          animate={
            mounted
              ? {
                  ...pulseAnimation,
                  transition: { ...pulseAnimation.transition, delay: 1.5 },
                }
              : {}
          }
          className="absolute w-[40vw] h-[40vw] rounded-full bottom-[10%] right-[5%] mix-blend-multiply"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${accentColor}, ${transparentize(
              1,
              accentColor
            )} 70%)`,
            mixBlendMode: "soft-light",
          }}
        ></motion.div>

        {/* Small circle accent */}
        <motion.div
          animate={
            mounted
              ? {
                  ...pulseAnimation,
                  transition: { ...pulseAnimation.transition, delay: 3 },
                }
              : {}
          }
          className="absolute w-[20vw] h-[20vw] rounded-full top-[10%] right-[15%]"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${highlightColor}, ${transparentize(
              1,
              highlightColor
            )} 70%)`,
            mixBlendMode: "soft-light",
          }}
        ></motion.div>
      </div>

      {/* Background pattern for texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Background logo watermark with improved styling */}
      {branding && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-[70%] h-[70%] opacity-5 mix-blend-overlay"
            initial={{ opacity: 0, rotate: -5 }}
            animate={{ opacity: 0.05, rotate: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <img
              src={logoUrl}
              alt="Logo Watermark"
              className="w-full h-full object-contain"
              onError={handleLogoError}
              style={{
                display: logoError ? "none" : "block",
                filter: "blur(1px)",
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
        className="relative z-10 flex flex-col h-full w-full p-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-12"
          variants={itemVariants}
        >
          <div
            className="bg-white/90 backdrop-blur-xl rounded-full py-3 px-6"
            style={{
              boxShadow: `0 10px 30px ${transparentize(0.9, primaryColor)}`,
              borderTop: "1px solid rgba(255,255,255,0.6)",
              borderLeft: "1px solid rgba(255,255,255,0.6)",
            }}
          >
            <h2
              className="text-2xl font-bold uppercase tracking-wider"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Personality of the Day
            </h2>
          </div>

          {branding && (
            <div
              className="h-16 w-16 bg-white rounded-full p-2 overflow-hidden"
              style={{
                boxShadow: `0 10px 30px ${transparentize(0.9, secondaryColor)}`,
                borderTop: "1px solid rgba(255,255,255,0.6)",
                borderLeft: "1px solid rgba(255,255,255,0.6)",
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
                    className="text-2xl font-bold"
                    style={{ color: primaryColor }}
                  >
                    L
                  </span>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Student Info Section */}
        <motion.div className="flex flex-col h-full" variants={itemVariants}>
          <div className="flex gap-8 mb-10">
            {/* Left Section - Photo */}
            <motion.div className="w-[40%]" variants={itemVariants}>
              <div className="relative">
                {/* Decorative frame */}
                <motion.div
                  className="absolute inset-0 transform translate-x-6 translate-y-6 rounded-3xl opacity-80"
                  style={{
                    background: `linear-gradient(135deg, ${transparentize(
                      0.8,
                      primaryColor
                    )}, ${transparentize(0.8, secondaryColor)})`,
                  }}
                  animate={
                    mounted
                      ? {
                          x: [6, 8, 6],
                          y: [6, 8, 6],
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

                {/* Photo container */}
                <div
                  className="relative z-10 rounded-3xl overflow-hidden shadow-2xl"
                  style={{
                    aspectRatio: "3/4",
                    border: "8px solid rgba(255,255,255,0.8)",
                    boxShadow: `
                      0 20px 70px ${transparentize(0.8, primaryColor)},
                      0 10px 30px ${transparentize(0.7, secondaryColor)}
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
                      className="w-full h-full flex items-center justify-center bg-gray-100"
                      style={{
                        background: `linear-gradient(135deg, ${lighten(
                          0.3,
                          primaryColor
                        )}, ${lighten(0.3, secondaryColor)})`,
                      }}
                    >
                      <span className="text-[10rem] font-bold text-white/80">
                        {student?.fullName?.[0]?.toUpperCase() || "?"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Decorative bar */}
              <div
                className="mt-6 h-2 w-[70%] rounded-full mx-auto"
                style={{
                  background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                  boxShadow: `0 3px 10px ${transparentize(0.7, primaryColor)}`,
                }}
              ></div>

              {/* Display Matric Number */}
              {student?.matricNumber && (
                <div className="mt-4 text-center">
                  <p
                    style={{ color: "white" }}
                    className="text-sm font-medium bg-black/20 backdrop-blur-md inline-block px-4 py-1 rounded-full"
                  >
                    {student.matricNumber}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Right Section - Content */}
            <motion.div
              className="w-[60%] bg-white/80 backdrop-blur-xl rounded-3xl p-10"
              style={{
                boxShadow: `
                  0 20px 70px ${transparentize(0.9, secondaryColor)},
                  0 10px 30px ${transparentize(0.9, accentColor)}
                `,
                borderTop: "1px solid rgba(255,255,255,0.6)",
                borderLeft: "1px solid rgba(255,255,255,0.6)",
              }}
              variants={itemVariants}
            >
              <h1
                className="text-6xl font-black mb-6 leading-tight"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {student?.fullName || "Student Name"}
              </h1>

              <div className="flex flex-wrap gap-3 mb-6">
                <div
                  className="px-4 py-2 rounded-full text-white text-lg"
                  style={{
                    background: `linear-gradient(to right, ${primaryColor}, ${darken(
                      0.1,
                      primaryColor
                    )})`,
                    boxShadow: `0 3px 10px ${transparentize(
                      0.8,
                      primaryColor
                    )}`,
                  }}
                >
                  {student?.level || "400"} Level
                </div>

                <div
                  className="px-4 py-2 rounded-full text-white text-lg"
                  style={{
                    background: `linear-gradient(to right, ${secondaryColor}, ${darken(
                      0.1,
                      secondaryColor
                    )})`,
                    boxShadow: `0 3px 10px ${transparentize(
                      0.8,
                      secondaryColor
                    )}`,
                  }}
                >
                  {student?.department || "Department"}
                </div>
              </div>

              {student?.specializationTrack && (
                <div
                  className="px-4 py-2 inline-block rounded-full text-white text-lg mb-6"
                  style={{
                    background: `linear-gradient(to right, ${highlightColor}, ${darken(
                      0.1,
                      highlightColor
                    )})`,
                    boxShadow: `0 3px 10px ${transparentize(
                      0.8,
                      highlightColor
                    )}`,
                  }}
                >
                  {student.specializationTrack} Track
                </div>
              )}

              {student?.quote && (
                <div className="mb-6 relative">
                  <div
                    className="absolute left-0 top-0 transform -translate-x-2 -translate-y-2 text-6xl opacity-10"
                    style={{ color: primaryColor }}
                  >
                    "
                  </div>
                  <div
                    className="text-3xl italic font-light mb-2 pl-6"
                    style={{ color: primaryColor }}
                  >
                    "{student.quote}"
                  </div>
                </div>
              )}

              {student?.bio && (
                <div className="mb-6">
                  <h3
                    className="text-xl font-bold mb-3 flex items-center"
                    style={{ color: accentColor }}
                  >
                    <div
                      className="w-4 h-4 mr-2 rounded"
                      style={{ backgroundColor: accentColor }}
                    ></div>
                    About
                  </h3>
                  <p className="text-xl text-gray-700 leading-relaxed">
                    {student.bio}
                  </p>
                </div>
              )}

              {/* Additional details in columns */}
              <div className="grid grid-cols-2 gap-6 mt-auto">
                {student?.hobbies && (
                  <div>
                    <h3
                      className="text-lg font-bold mb-2 flex items-center"
                      style={{ color: accentColor }}
                    >
                      <div
                        className="w-3 h-3 mr-2 rounded-full"
                        style={{ backgroundColor: accentColor }}
                      ></div>
                      Hobbies
                    </h3>
                    <p className="text-gray-700">{student.hobbies}</p>
                  </div>
                )}

                {student?.achievements && (
                  <div>
                    <h3
                      className="text-lg font-bold mb-2 flex items-center"
                      style={{ color: secondaryColor }}
                    >
                      <div
                        className="w-3 h-3 mr-2 rounded-full"
                        style={{ backgroundColor: secondaryColor }}
                      ></div>
                      Achievements
                    </h3>
                    <p className="text-gray-700">{student.achievements}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Additional details section with glassmorphism */}
          <motion.div
            className="grid grid-cols-3 gap-4 mb-auto"
            variants={itemVariants}
          >
            {student?.favoriteCourse && (
              <div
                className="bg-white/40 backdrop-blur-lg rounded-xl p-4 relative overflow-hidden group"
                style={{
                  boxShadow: `0 10px 30px -10px ${transparentize(
                    0.9,
                    primaryColor
                  )}`,
                  borderTop: "1px solid rgba(255,255,255,0.5)",
                  borderLeft: "1px solid rgba(255,255,255,0.5)",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, transparent)`,
                  }}
                ></div>
                <h3
                  className="text-lg font-bold mb-2 relative"
                  style={{ color: primaryColor }}
                >
                  Favorite Course
                </h3>
                <p className="text-gray-700 relative">
                  {student.favoriteCourse}
                </p>
              </div>
            )}

            {student?.favoriteLevel && (
              <div
                className="bg-white/40 backdrop-blur-lg rounded-xl p-4 relative overflow-hidden group"
                style={{
                  boxShadow: `0 10px 30px -10px ${transparentize(
                    0.9,
                    secondaryColor
                  )}`,
                  borderTop: "1px solid rgba(255,255,255,0.5)",
                  borderLeft: "1px solid rgba(255,255,255,0.5)",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, ${secondaryColor}, transparent)`,
                  }}
                ></div>
                <h3
                  className="text-lg font-bold mb-2 relative"
                  style={{ color: secondaryColor }}
                >
                  Favorite Level
                </h3>
                <p className="text-gray-700 relative">
                  {student.favoriteLevel}
                </p>
              </div>
            )}

            {student?.bestMoment && (
              <div
                className="bg-white/40 backdrop-blur-lg rounded-xl p-4 relative overflow-hidden group"
                style={{
                  boxShadow: `0 10px 30px -10px ${transparentize(
                    0.9,
                    accentColor
                  )}`,
                  borderTop: "1px solid rgba(255,255,255,0.5)",
                  borderLeft: "1px solid rgba(255,255,255,0.5)",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}, transparent)`,
                  }}
                ></div>
                <h3
                  className="text-lg font-bold mb-2 relative"
                  style={{ color: accentColor }}
                >
                  Best Moment
                </h3>
                <p className="text-gray-700 relative">{student.bestMoment}</p>
              </div>
            )}
          </motion.div>

          {/* Bottom bar */}
          <motion.div className="mt-auto" variants={itemVariants}>
            <div
              className="flex justify-between items-center bg-white/60 backdrop-blur-xl rounded-2xl p-5"
              style={{
                boxShadow: `0 10px 30px ${transparentize(0.9, primaryColor)}`,
                borderTop: "1px solid rgba(255,255,255,0.6)",
                borderLeft: "1px solid rgba(255,255,255,0.6)",
              }}
            >
              <div
                className="text-lg font-medium px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm"
                style={{
                  color: darken(0.1, primaryColor),
                  boxShadow: `0 3px 10px ${transparentize(0.9, primaryColor)}`,
                }}
              >
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              {student?.advice && (
                <div
                  className="text-lg italic max-w-[30ch] truncate text-center"
                  style={{ color: accentColor }}
                >
                  "
                  {student.advice.length > 50
                    ? student.advice.substring(0, 50) + "..."
                    : student.advice}
                  "
                </div>
              )}

              {branding && (
                <div
                  className="text-lg font-bold uppercase px-3 py-1 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10"
                  style={{
                    color: primaryColor,
                    backdropFilter: "blur(4px)",
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
  );
}
