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

  // Create floating animations
  const floatingAnimation = (delay = 0) => ({
    y: [0, -15, 0],
    x: [0, 5, 0],
    transition: {
      duration: 6,
      delay,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut",
    },
  });

  // Create rotation animations
  const rotationAnimation = (delay = 0) => ({
    rotate: [0, 5, 0, -5, 0],
    transition: {
      duration: 12,
      delay,
      repeat: Infinity,
      repeatType: "loop" as const,
      ease: "easeInOut",
    },
  });

  // Create pulse animations
  const pulseAnimation = (delay = 0) => ({
    scale: [1, 1.1, 1],
    opacity: [0.6, 0.8, 0.6],
    transition: {
      duration: 8,
      delay,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut",
    },
  });

  return (
    <div className="vibrant-template h-full w-full flex flex-col relative overflow-hidden bg-black">
      {/* Dynamic gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${primaryColor}, transparent 50%), 
                       radial-gradient(circle at 70% 60%, ${secondaryColor}, transparent 50%), 
                       radial-gradient(circle at 10% 90%, ${accentColor}, transparent 40%)`,
        }}
      ></div>

      {/* Dynamic abstract shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large blob */}
        <motion.div
          animate={mounted ? floatingAnimation(0) : {}}
          className="absolute -right-[30%] -top-[20%] w-[800px] h-[800px] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] opacity-70"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${transparentize(
              0.5,
              secondaryColor
            )})`,
            filter: "blur(60px)",
          }}
        ></motion.div>

        {/* Medium blob */}
        <motion.div
          animate={mounted ? floatingAnimation(1.5) : {}}
          className="absolute -left-[20%] top-[40%] w-[600px] h-[600px] rounded-[50%_50%_40%_60%/40%_60%_60%_40%] opacity-60"
          style={{
            background: `linear-gradient(135deg, ${secondaryColor}, ${transparentize(
              0.5,
              accentColor
            )})`,
            filter: "blur(50px)",
          }}
        ></motion.div>

        {/* Small accent blob */}
        <motion.div
          animate={mounted ? floatingAnimation(3) : {}}
          className="absolute right-[30%] bottom-[20%] w-[400px] h-[400px] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] opacity-50"
          style={{
            background: `linear-gradient(135deg, ${accentColor}, ${transparentize(
              0.5,
              highlightColor
            )})`,
            filter: "blur(40px)",
          }}
        ></motion.div>

        {/* Decorative circles */}
        <motion.div
          animate={mounted ? pulseAnimation() : {}}
          className="absolute left-[10%] top-[10%] w-32 h-32 rounded-full opacity-20"
          style={{
            background: primaryColor,
            boxShadow: `0 0 80px ${primaryColor}`,
          }}
        ></motion.div>

        <motion.div
          animate={mounted ? pulseAnimation(2) : {}}
          className="absolute right-[15%] top-[30%] w-20 h-20 rounded-full opacity-30"
          style={{
            background: secondaryColor,
            boxShadow: `0 0 60px ${secondaryColor}`,
          }}
        ></motion.div>

        <motion.div
          animate={mounted ? pulseAnimation(4) : {}}
          className="absolute left-[20%] bottom-[15%] w-24 h-24 rounded-full opacity-25"
          style={{
            background: highlightColor,
            boxShadow: `0 0 70px ${highlightColor}`,
          }}
        ></motion.div>
      </div>

      {/* Geometric pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Background logo watermark */}
      {branding && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 0.05, scale: 1, rotate: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-[80%] h-[80%] opacity-5 mix-blend-overlay"
          >
            <img
              src={logoUrl}
              alt="Logo"
              className="w-full h-full object-contain"
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

      {/* Main content with layout */}
      <motion.div
        className="relative z-10 flex flex-col h-full w-full p-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-start mb-12"
        >
          <div
            className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/20"
            style={{
              boxShadow: `0 10px 30px -5px rgba(0, 0, 0, 0.3)`,
              backdropFilter: "blur(10px)",
            }}
          >
            <h2
              className="text-2xl font-bold tracking-wider"
              style={{
                color: "white",
                textShadow: `0 2px 10px ${transparentize(0.5, primaryColor)}`,
              }}
            >
              PERSONALITY OF THE DAY
            </h2>
          </div>

          {/* Logo in Glass Card */}
          {branding && (
            <div
              className="h-16 w-16 rounded-lg bg-white/10 backdrop-blur-md p-2 border border-white/20"
              style={{ boxShadow: `0 10px 30px -5px rgba(0, 0, 0, 0.3)` }}
            >
              <img
                src={logoUrl}
                alt="Logo"
                className="h-full w-full object-contain"
                onError={handleLogoError}
                style={{ display: logoError ? "none" : "block" }}
              />
              {logoError && (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xl font-bold text-white">L</span>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Student Photo and Info */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row gap-10 mb-12"
        >
          {/* Student Photo with Frame */}
          <div className="w-full md:w-1/3">
            <motion.div
              animate={mounted ? rotationAnimation(1) : {}}
              className="relative mx-auto"
              style={{
                maxWidth: "90%",
              }}
            >
              {/* Photo frame */}
              <div
                className="aspect-[3/4] rounded-2xl overflow-hidden border-4 relative"
                style={{
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  boxShadow: `
                    0 10px 30px -5px rgba(0, 0, 0, 0.3),
                    0 0 30px 5px ${transparentize(0.7, primaryColor)},
                    inset 0 0 20px rgba(255, 255, 255, 0.2)
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

                {/* Photo overlay gradient */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: `linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)`,
                  }}
                ></div>
              </div>

              {/* Decorative accents */}
              <motion.div
                animate={
                  mounted
                    ? {
                        y: [0, -5, 0],
                        rotate: [0, -3, 0],
                        transition: {
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "reverse",
                        },
                      }
                    : {}
                }
                className="absolute -top-3 -right-3 w-24 h-24 rounded-full opacity-80"
                style={{
                  background: `radial-gradient(circle at center, ${lighten(
                    0.1,
                    primaryColor
                  )}, transparent 70%)`,
                  filter: "blur(15px)",
                }}
              ></motion.div>

              <motion.div
                animate={
                  mounted
                    ? {
                        y: [0, 5, 0],
                        rotate: [0, 3, 0],
                        transition: {
                          duration: 4,
                          delay: 1,
                          repeat: Infinity,
                          repeatType: "reverse",
                        },
                      }
                    : {}
                }
                className="absolute -bottom-3 -left-3 w-20 h-20 rounded-full opacity-70"
                style={{
                  background: `radial-gradient(circle at center, ${secondaryColor}, transparent 70%)`,
                  filter: "blur(15px)",
                }}
              ></motion.div>
            </motion.div>

            {/* Matric number display */}
            {student?.matricNumber && (
              <div className="mt-4 text-center">
                <span
                  className="px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm inline-block"
                  style={{ border: "1px solid rgba(255,255,255,0.2)" }}
                >
                  {student.matricNumber}
                </span>
              </div>
            )}
          </div>

          {/* Student Details in Glass Card */}
          <div className="w-full md:w-2/3">
            <div
              className="h-full rounded-3xl p-8 backdrop-blur-md overflow-hidden relative"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                borderTop: "1px solid rgba(255, 255, 255, 0.2)",
                borderLeft: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
              }}
            >
              {/* Reflective highlight effect */}
              <div
                className="absolute -top-[150%] -left-[150%] w-[400%] h-[400%] opacity-20"
                style={{
                  background: `linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%)`,
                  transform: "rotate(25deg)",
                  pointerEvents: "none",
                }}
              ></div>

              {/* Student name with gradient text */}
              <h1
                className="text-6xl font-bold mb-6"
                style={{
                  color: "white",
                  textShadow: `0 0 20px ${transparentize(0.5, primaryColor)}`,
                }}
              >
                {student?.fullName || "Student Name"}
              </h1>

              {/* Academic details */}
              <div className="flex flex-wrap gap-3 mb-6">
                <span
                  className="px-4 py-2 rounded-full text-white inline-block"
                  style={{
                    background: `linear-gradient(to right, ${primaryColor}, ${transparentize(
                      0.7,
                      primaryColor
                    )})`,
                    boxShadow: `0 5px 15px ${transparentize(
                      0.7,
                      primaryColor
                    )}`,
                  }}
                >
                  {student?.level || "400"} Level
                </span>

                <span
                  className="px-4 py-2 rounded-full text-white inline-block"
                  style={{
                    background: `linear-gradient(to right, ${secondaryColor}, ${transparentize(
                      0.7,
                      secondaryColor
                    )})`,
                    boxShadow: `0 5px 15px ${transparentize(
                      0.7,
                      secondaryColor
                    )}`,
                  }}
                >
                  {student?.department || "Department"}
                </span>

                {student?.specializationTrack && (
                  <span
                    className="px-4 py-2 rounded-full text-white inline-block"
                    style={{
                      background: `linear-gradient(to right, ${accentColor}, ${transparentize(
                        0.7,
                        accentColor
                      )})`,
                      boxShadow: `0 5px 15px ${transparentize(
                        0.7,
                        accentColor
                      )}`,
                    }}
                  >
                    {student.specializationTrack} Track
                  </span>
                )}
              </div>

              {/* Quote */}
              {student?.quote && (
                <div className="mb-6 relative">
                  <div className="text-2xl italic mb-6 pl-8 text-white/90 relative">
                    <div
                      className="absolute left-0 top-0 text-4xl opacity-30"
                      style={{ color: highlightColor }}
                    >
                      "
                    </div>
                    {student.quote}
                    <div
                      className="absolute right-0 bottom-0 text-4xl opacity-30"
                      style={{ color: highlightColor }}
                    >
                      "
                    </div>
                  </div>
                </div>
              )}

              {/* Bio */}
              {student?.bio && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2 text-white/90">
                    About
                  </h3>
                  <p className="text-white/80 leading-relaxed">{student.bio}</p>
                </div>
              )}

              {/* Two column details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {student?.hobbies && (
                  <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
                    <h3 className="text-lg font-bold mb-2 text-white/90">
                      Hobbies & Interests
                    </h3>
                    <p className="text-white/80">{student.hobbies}</p>
                  </div>
                )}

                {student?.achievements && (
                  <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
                    <h3 className="text-lg font-bold mb-2 text-white/90">
                      Achievements
                    </h3>
                    <p className="text-white/80">{student.achievements}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Info Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-3 gap-6 mb-auto"
        >
          {student?.favoriteCourse && (
            <div
              className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10 group"
              style={{
                transition: "all 0.3s ease",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center mb-3"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${transparentize(
                    0.5,
                    primaryColor
                  )})`,
                  boxShadow: `0 5px 15px ${transparentize(0.7, primaryColor)}`,
                }}
              >
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">
                Favorite Course
              </h3>
              <p className="text-white/80">{student.favoriteCourse}</p>
            </div>
          )}

          {student?.favoriteLevel && (
            <div
              className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10 group"
              style={{
                transition: "all 0.3s ease",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center mb-3"
                style={{
                  background: `linear-gradient(135deg, ${secondaryColor}, ${transparentize(
                    0.5,
                    secondaryColor
                  )})`,
                  boxShadow: `0 5px 15px ${transparentize(
                    0.7,
                    secondaryColor
                  )}`,
                }}
              >
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">
                Favorite Level
              </h3>
              <p className="text-white/80">{student.favoriteLevel}</p>
            </div>
          )}

          {student?.bestMoment && (
            <div
              className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10 group"
              style={{
                transition: "all 0.3s ease",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center mb-3"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, ${transparentize(
                    0.5,
                    accentColor
                  )})`,
                  boxShadow: `0 5px 15px ${transparentize(0.7, accentColor)}`,
                }}
              >
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Best Moment</h3>
              <p className="text-white/80">{student.bestMoment}</p>
            </div>
          )}
        </motion.div>

        {/* Footer Section */}
        <motion.div
          variants={itemVariants}
          className="mt-auto pt-10 flex justify-between items-center"
        >
          <div
            className="px-4 py-2 rounded-full text-white backdrop-blur-md"
            style={{ background: "rgba(0, 0, 0, 0.2)" }}
          >
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          {branding && (
            <div
              className="px-5 py-2 rounded-full text-white backdrop-blur-md font-bold"
              style={{ background: "rgba(0, 0, 0, 0.2)" }}
            >
              LINGUISTICS & COMMUNICATIONS STUDENTS' ASSOCIATION
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
