import React, { useState, useEffect } from "react";
import { darken, lighten, transparentize } from "polished";
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
  const highlightColor = colors[3] || "#FFD700";

  // Generate 3D neumorphism effect colors
  const neuLight = lighten(0.2, primaryColor);
  const neuDark = darken(0.15, primaryColor);

  // Create dynamic gradient with multiple color stops
  const gradientStyle = {
    background: `linear-gradient(135deg, 
      ${darken(0.15, primaryColor)} 0%, 
      ${primaryColor} 25%, 
      ${lighten(0.1, primaryColor)} 50%, 
      ${secondaryColor} 75%, 
      ${darken(0.1, secondaryColor)} 100%)`,
  };

  const avatarSize = 480; // Large avatar size for high quality

  // Add a logo error handler
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
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const floatingAnimation = {
    y: [0, -8, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut",
    },
  };

  return (
    <div className="premium-template h-full w-full flex flex-col relative overflow-hidden">
      {/* Dynamic color & texture background */}
      <div className="absolute inset-0" style={gradientStyle}></div>

      {/* Animated geometric shapes for background interest */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large circle */}
        <motion.div
          animate={mounted ? floatingAnimation : {}}
          className="absolute -right-[30%] -top-[10%] w-[800px] h-[800px] rounded-full opacity-40"
          style={{
            background: `radial-gradient(circle at 30% 40%, ${primaryColor}, transparent 70%)`,
            filter: "blur(60px)",
          }}
        ></motion.div>

        {/* Medium circle */}
        <motion.div
          animate={
            mounted
              ? {
                  ...floatingAnimation,
                  transition: { ...floatingAnimation.transition, delay: 0.5 },
                }
              : {}
          }
          className="absolute -left-[10%] bottom-[20%] w-[600px] h-[600px] rounded-full opacity-30"
          style={{
            background: `radial-gradient(circle at 70% 30%, ${secondaryColor}, transparent 70%)`,
            filter: "blur(50px)",
          }}
        ></motion.div>

        {/* Small accent */}
        <motion.div
          animate={
            mounted
              ? {
                  ...floatingAnimation,
                  transition: { ...floatingAnimation.transition, delay: 1 },
                }
              : {}
          }
          className="absolute right-[20%] bottom-[30%] w-[300px] h-[300px] rounded-full opacity-40"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${accentColor}, transparent 70%)`,
            filter: "blur(40px)",
          }}
        ></motion.div>
      </div>

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Background logo with professional styling */}
      {branding && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="relative w-[90%] h-[90%] opacity-8"
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 0.05, scale: 1, rotate: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <img
              src={logoUrl}
              alt="Logo"
              className="w-full h-full object-contain mix-blend-overlay"
              onError={handleLogoError}
              style={{
                display: logoError ? "none" : "block",
                filter: "blur(1px)",
              }}
            />
            {logoError && (
              <div className="w-full h-full flex items-center justify-center text-white text-opacity-5">
                <span className="text-[20rem] font-bold">L</span>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Main content */}
      <motion.div
        className="flex flex-col h-full w-full p-16 z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header with 3D effect */}
        <motion.div
          className="flex flex-col items-center relative mb-10"
          variants={itemVariants}
        >
          <div
            className="text-white text-3xl font-bold mb-5 text-center px-8 py-3 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${transparentize(
                0.8,
                primaryColor
              )}, ${transparentize(0.8, secondaryColor)})`,
              backdropFilter: "blur(10px)",
              boxShadow: `0 10px 30px -10px ${transparentize(
                0.6,
                primaryColor
              )}`,
              textShadow: "0 2px 10px rgba(0,0,0,0.2)",
              letterSpacing: "0.05em",
            }}
          >
            PERSONALITY OF THE DAY
          </div>

          {branding && (
            <div className="absolute top-0 right-0 h-24 w-24 p-1">
              <div
                className="relative w-full h-full rounded-xl overflow-hidden"
                style={{
                  boxShadow: `0 8px 32px ${transparentize(
                    0.8,
                    secondaryColor
                  )}`,
                }}
              >
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="w-full h-full object-contain p-1 bg-white/30 backdrop-blur-xl"
                  onError={handleLogoError}
                  style={{ display: logoError ? "none" : "block" }}
                />
                {logoError && (
                  <div className="w-full h-full flex items-center justify-center bg-white/30 backdrop-blur-xl">
                    <span className="text-2xl font-bold text-white">L</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Student Photo with dynamic effects */}
        <motion.div
          className="flex justify-center mb-10"
          variants={itemVariants}
        >
          <div className="relative">
            {/* Photo frame with neumorphic effect */}
            <div
              className="rounded-full overflow-hidden relative"
              style={{
                width: `${avatarSize}px`,
                height: `${avatarSize}px`,
                boxShadow: `
                  0 10px 30px -5px ${transparentize(0.7, primaryColor)},
                  20px 20px 60px -12px ${transparentize(0.7, secondaryColor)},
                  inset 0 -3px 6px 0 ${transparentize(0.7, neuDark)},
                  inset 0 3px 6px 0 ${transparentize(0.7, neuLight)}
                `,
                border: `12px solid rgba(255,255,255,0.2)`,
                backdropFilter: "blur(5px)",
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
                      0.1,
                      primaryColor
                    )}, ${secondaryColor})`,
                  }}
                >
                  <span className="text-white text-9xl font-bold">
                    {student?.fullName?.[0]?.toUpperCase() || "?"}
                  </span>
                </div>
              )}
            </div>

            {/* Radial highlight circles */}
            <div
              className="absolute -top-5 -right-5 w-24 h-24 rounded-full opacity-70"
              style={{
                background: `linear-gradient(225deg, ${highlightColor}, transparent)`,
                filter: "blur(15px)",
              }}
            ></div>
            <div
              className="absolute -bottom-5 -left-5 w-20 h-20 rounded-full opacity-50"
              style={{
                background: `linear-gradient(45deg, ${accentColor}, transparent)`,
                filter: "blur(10px)",
              }}
            ></div>
          </div>
        </motion.div>

        {/* Student Info with modern glass card */}
        <motion.div
          variants={itemVariants}
          className="bg-white/70 backdrop-blur-lg rounded-3xl p-12 mb-8 relative overflow-hidden"
          style={{
            boxShadow: `
              0 10px 30px ${transparentize(0.8, primaryColor)},
              0 30px 60px -30px ${transparentize(0.5, secondaryColor)}
            `,
            borderTop: "1px solid rgba(255,255,255,0.6)",
            borderLeft: "1px solid rgba(255,255,255,0.6)",
          }}
        >
          {/* Subtle reflective highlight for glass effect */}
          <div
            className="absolute -top-[150%] -left-[150%] w-[400%] h-[400%] opacity-10"
            style={{
              background: `
                linear-gradient(
                  45deg, 
                  transparent 40%, 
                  rgba(255,255,255,0.6) 45%, 
                  rgba(255,255,255,0.8) 50%, 
                  rgba(255,255,255,0.6) 55%, 
                  transparent 60%
                )
              `,
              transform: "rotate(25deg)",
              pointerEvents: "none",
            }}
          ></div>

          <h1
            className="text-5xl font-bold mb-4 text-center relative"
            style={{
              backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor}, ${accentColor})`,
              backgroundClip: "text",
              color: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {student?.fullName || "Student Name"}
          </h1>

          <div className="flex justify-center items-center gap-4 mb-6">
            <span
              className="text-2xl font-medium px-4 py-2 rounded-full"
              style={{
                color: "white",
                background: `linear-gradient(to right, ${primaryColor}, ${darken(
                  0.1,
                  primaryColor
                )})`,
                boxShadow: `0 3px 10px ${transparentize(0.7, primaryColor)}`,
              }}
            >
              {student?.level || "400"} Level
            </span>
            <span className="text-2xl text-gray-400">•</span>
            <span
              className="text-2xl font-medium px-4 py-2 rounded-full"
              style={{
                color: "white",
                background: `linear-gradient(to right, ${secondaryColor}, ${darken(
                  0.1,
                  secondaryColor
                )})`,
                boxShadow: `0 3px 10px ${transparentize(0.7, secondaryColor)}`,
              }}
            >
              {student?.department || "Department"}
            </span>
          </div>

          {student?.matricNumber && (
            <div
              className="mb-6 text-xl text-center"
              style={{ color: transparentize(0.3, accentColor) }}
            >
              {student.matricNumber}
            </div>
          )}

          {student?.quote && (
            <div
              className="text-3xl italic text-center mb-6 px-8 relative"
              style={{ color: secondaryColor }}
            >
              <div
                className="absolute left-0 top-0 text-8xl leading-[0] opacity-10"
                style={{ color: secondaryColor }}
              >
                "
              </div>
              <div
                className="absolute right-0 bottom-0 text-8xl leading-[0] opacity-10"
                style={{ color: secondaryColor }}
              >
                "
              </div>
              <p className="relative z-10">"{student.quote}"</p>
            </div>
          )}

          {student?.bio && (
            <div className="text-xl text-gray-700 text-center mb-6 leading-relaxed">
              {student.bio}
            </div>
          )}

          {/* Display specialization track if available */}
          {student?.specializationTrack && (
            <div className="text-center mb-4">
              <span
                className="inline-block px-5 py-2 rounded-full text-white text-lg font-medium"
                style={{
                  background: `linear-gradient(to right, ${accentColor}, ${lighten(
                    0.1,
                    accentColor
                  )})`,
                  boxShadow: `0 3px 10px ${transparentize(0.7, accentColor)}`,
                }}
              >
                {student.specializationTrack} Track
              </span>
            </div>
          )}
        </motion.div>

        {/* Additional Info with modern cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 gap-6 mb-6"
        >
          {student?.hobbies && (
            <div
              className="bg-white/60 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden"
              style={{
                boxShadow: `0 10px 30px ${transparentize(0.9, primaryColor)}`,
                borderTop: "1px solid rgba(255,255,255,0.5)",
                borderLeft: "1px solid rgba(255,255,255,0.5)",
              }}
            >
              <div
                className="absolute top-0 right-0 w-16 h-16 rounded-bl-3xl"
                style={{
                  background: `linear-gradient(135deg, ${transparentize(
                    0.7,
                    primaryColor
                  )}, transparent)`,
                }}
              ></div>
              <h3
                className="text-2xl font-bold mb-3 relative"
                style={{ color: primaryColor }}
              >
                Hobbies & Skills
              </h3>
              <p className="text-xl text-gray-700">{student.hobbies}</p>
            </div>
          )}

          {student?.achievements && (
            <div
              className="bg-white/60 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden"
              style={{
                boxShadow: `0 10px 30px ${transparentize(0.9, secondaryColor)}`,
                borderTop: "1px solid rgba(255,255,255,0.5)",
                borderLeft: "1px solid rgba(255,255,255,0.5)",
              }}
            >
              <div
                className="absolute top-0 right-0 w-16 h-16 rounded-bl-3xl"
                style={{
                  background: `linear-gradient(135deg, ${transparentize(
                    0.7,
                    secondaryColor
                  )}, transparent)`,
                }}
              ></div>
              <h3
                className="text-2xl font-bold mb-3"
                style={{ color: secondaryColor }}
              >
                Achievements
              </h3>
              <p className="text-xl text-gray-700">{student.achievements}</p>
            </div>
          )}
        </motion.div>

        {/* Additional student details in a clean three-column layout */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-3 gap-4 mb-auto"
        >
          {student?.favoriteCourse && (
            <div
              className="bg-white/50 backdrop-blur-md rounded-xl p-4 relative overflow-hidden"
              style={{
                boxShadow: `0 5px 15px ${transparentize(0.9, accentColor)}`,
                borderTop: "1px solid rgba(255,255,255,0.3)",
                borderLeft: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              <div
                className="w-12 h-1 mb-3 rounded-full"
                style={{ backgroundColor: secondaryColor }}
              ></div>
              <h3
                className="text-lg font-bold mb-2"
                style={{ color: secondaryColor }}
              >
                Favorite Course
              </h3>
              <p className="text-gray-700">{student.favoriteCourse}</p>
            </div>
          )}

          {student?.favoriteLevel && (
            <div
              className="bg-white/50 backdrop-blur-md rounded-xl p-4 relative overflow-hidden"
              style={{
                boxShadow: `0 5px 15px ${transparentize(0.9, highlightColor)}`,
                borderTop: "1px solid rgba(255,255,255,0.3)",
                borderLeft: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              <div
                className="w-12 h-1 mb-3 rounded-full"
                style={{ backgroundColor: secondaryColor }}
              ></div>
              <h3
                className="text-lg font-bold mb-2"
                style={{ color: secondaryColor }}
              >
                Favorite Level
              </h3>
              <p className="text-gray-700">{student.favoriteLevel}</p>
            </div>
          )}

          {student?.bestMoment && (
            <div
              className="bg-white/50 backdrop-blur-md rounded-xl p-4 relative overflow-hidden"
              style={{
                boxShadow: `0 5px 15px ${transparentize(0.9, primaryColor)}`,
                borderTop: "1px solid rgba(255,255,255,0.3)",
                borderLeft: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              <div
                className="w-12 h-1 mb-3 rounded-full"
                style={{ backgroundColor: secondaryColor }}
              ></div>
              <h3
                className="text-lg font-bold mb-2"
                style={{ color: secondaryColor }}
              >
                Best Moment
              </h3>
              <p className="text-gray-700">{student.bestMoment}</p>
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          variants={itemVariants}
          className="mt-8 flex justify-between items-center text-white/90"
        >
          <div
            className="text-xl font-medium px-5 py-2 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${transparentize(
                0.8,
                primaryColor
              )}, ${transparentize(0.8, secondaryColor)})`,
              backdropFilter: "blur(5px)",
            }}
          >
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          {branding && (
            <div
              className="text-xl font-bold px-5 py-2 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${transparentize(
                  0.8,
                  secondaryColor
                )}, ${transparentize(0.8, primaryColor)})`,
                backdropFilter: "blur(5px)",
              }}
            >
              LINGUISTICS & COMMUNICATIONS STUDENTS' ASSOCIATION
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
