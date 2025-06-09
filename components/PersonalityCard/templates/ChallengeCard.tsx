import React, { useState, useEffect } from "react";
import { transparentize, lighten, darken } from "polished";
import { motion } from "framer-motion";

type ChallengeCardProps = {
  day: number;
  challenge: string;
  logoUrl: string;
  branding?: boolean;
};

const challengeData = [
  {
    day: 0,
    text: "Welcome to the LINCSSA 30 Days Challenge! 🎉 This is your journey of reflection and celebration. Share your story, connect with fellow linguistics and communications students, and let's celebrate our amazing department together! Tag #LINCSSA30DaysChallenge and let the world see our pride!",
  },
  {
    day: 1,
    text: "If your course was a person, what would their vibe be? Chill? Dramatic? Loud? Explain!",
  },
  {
    day: 2,
    text: "What's the first thing that made you say \"I'm definitely in a communication department\"?",
  },
  {
    day: 3,
    text: "What's one communication fail that still makes you cringe or laugh?",
  },
  { day: 4, text: "A memory in school you'll never forget (good or bad)." },
  {
    day: 5,
    text: "That one lecturer class that makes you and your course mate always laugh in class",
  },
  { day: 6, text: "Exam rituals prayers, routines, or even lucky pens?" },
  {
    day: 7,
    text: 'What\'s a course or concept that made you feel like "I actually love this degree"?',
  },
  {
    day: 8,
    text: "Something you genuinely love about studying communication or linguistics.",
  },
  { day: 9, text: "One misconception people have about your course." },
  {
    day: 10,
    text: "Post you and the friend/friends you first meet in 100l then vs now",
  },
  { day: 11, text: "Post a then vs now picture (100 level vs final year)." },
  {
    day: 12,
    text: "What aspect of the university journey are you most grateful for?",
  },
  { day: 13, text: "Ever thought about changing your course? Why or why not?" },
  {
    day: 14,
    text: "What's next after graduation? Media? Research? PR? Linguistics?",
  },
  {
    day: 15,
    text: "A cherished class moment (presentation, project, or lecturer joke).",
  },
  {
    day: 16,
    text: "Ever cried or felt overwhelmed after a communication-heavy semester?",
  },
  { day: 17, text: "A shoutout to your class rep or group leader." },
  { day: 18, text: "What's your biggest fear about leaving school?" },
  {
    day: 19,
    text: "A lecturer or mentor who inspired your communication style.",
  },
  { day: 20, text: "What course did you want vs what you got any regrets?" },
  { day: 21, text: "Favourite course or topic you studied and why." },
  {
    day: 22,
    text: "A phrase or term only your department people will understand.",
  },
  {
    day: 23,
    text: "Share a voice note or reel saying your favorite linguistic concept.",
  },
  {
    day: 24,
    text: "What's one communication skill you'll take into real life like a boss?",
  },
  { day: 25, text: "How would you explain your course to a 10-year-old?" },
  { day: 26, text: "Post a screenshot of a funny class group chat moment." },
  { day: 27, text: "Describe your department in 3 emojis." },
  { day: 28, text: "One thing you'll miss about campus life." },
  {
    day: 29,
    text: "What advice would you give a 100 level Linguistics/Comms student?",
  },
  { day: 30, text: "A message to your future self 5 years from now." },
];

export default function ChallengeCard({
  day,
  challenge,
  logoUrl,
  branding = true,
}: ChallengeCardProps) {
  const [logoError, setLogoError] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mount effect for animations
  useEffect(() => {
    setMounted(true);
  }, []);

  // Premium color scheme
  const primaryColor = "#1E3A8A"; // Deep blue
  const goldColor = "#FFD700"; // Gold for premium feel
  const goldGradient = `linear-gradient(135deg, ${goldColor}, #FFC107)`;
  const darkBackground = darken(0.75, primaryColor);
  const subtleGold = transparentize(0.9, goldColor);

  // Logo error handler
  const handleLogoError = () => {
    console.warn("Logo failed to load in challenge card");
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

  // Special layout for intro card (day 0) - no extra height/width
  const isIntroCard = day === 0;

  return (
    <div
      className={`challenge-card flex flex-col relative overflow-hidden ${
        isIntroCard ? "w-auto h-auto" : "h-full w-full"
      }`}
      style={{
        background: `linear-gradient(to bottom, ${darkBackground}, ${darken(
          0.7,
          primaryColor
        )})`,
        color: "#FFFFFF",
        ...(isIntroCard
          ? {
              minWidth: "fit-content",
              minHeight: "fit-content",
              maxWidth: "800px",
            }
          : { aspectRatio: "0.5/1" }),
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
        className={`relative z-10 flex flex-col w-full ${
          isIntroCard ? "px-4 py-6 h-auto" : "px-8 py-12 h-full"
        }`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header with gold accent */}
        <motion.div
          className={isIntroCard ? "mb-4" : "mb-8"}
          variants={itemVariants}
        >
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
                LINCSSA 30 DAYS CHALLENGE
              </h2>
              <p className="text-lg text-gray-300">
                reflecting on our journey...
              </p>
            </div>
            {branding && (
              <div
                className="h-14 w-14 rounded-full bg-black/20 backdrop-blur-lg p-2 flex items-center justify-center"
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

        {/* Day number with premium styling */}
        <motion.div
          variants={itemVariants}
          className={
            isIntroCard ? "mb-3 flex items-center" : "mb-6 flex items-center"
          }
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mr-6"
            style={{
              background: goldGradient,
              boxShadow: `0 0 30px ${subtleGold}`,
            }}
          >
            {day === 0 ? (
              <span className="text-lg font-bold text-black">🎉</span>
            ) : (
              <span className="text-3xl font-bold text-black">{day}</span>
            )}
          </div>
          <div>
            <h3
              className="text-2xl uppercase tracking-wider"
              style={{ color: goldColor }}
            >
              {day === 0 ? "INTRODUCTION" : `DAY ${day}`}
            </h3>
            <div
              className="w-16 h-0.5 mt-2"
              style={{ background: goldGradient }}
            ></div>
          </div>
        </motion.div>

        {/* Challenge question in premium styling */}
        <motion.div
          variants={itemVariants}
          className="flex-1 flex items-start justify-center"
        >
          {day === 0 ? (
            /* Intro card with all 30 challenges in grid format */
            <div className="w-full px-2">
              {/* All challenges grid - 5 columns with responsive sizing */}
              <div className="grid grid-cols-5 gap-1 text-left">
                {challengeData.slice(1).map((challengeItem) => (
                  <div
                    key={challengeItem.day}
                    className="bg-black/30 backdrop-blur-sm rounded-lg p-1.5 border-2 shadow-lg"
                    style={{
                      borderColor: goldColor,
                      boxShadow: `0 0 8px ${transparentize(0.7, goldColor)}`,
                    }}
                  >
                    <div className="text-center mb-1">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mx-auto"
                        style={{
                          background: goldGradient,
                          color: "#000",
                          boxShadow: `0 0 6px ${transparentize(
                            0.8,
                            goldColor
                          )}`,
                        }}
                      >
                        {challengeItem.day}
                      </div>
                    </div>
                    <p
                      className="text-[10px] leading-tight font-medium text-center"
                      style={{ color: "rgba(255,255,255,0.95)" }}
                    >
                      {challengeItem.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Regular single challenge card */
            <div className="text-center">
              <div
                className="text-3xl font-light leading-relaxed mb-8"
                style={{ color: "rgba(255,255,255,0.95)" }}
              >
                <span
                  className="text-6xl block mb-4"
                  style={{ color: goldColor }}
                >
                  "
                </span>
                {challenge}
                <span
                  className="text-6xl block mt-4"
                  style={{ color: goldColor }}
                >
                  "
                </span>
              </div>

              {/* Decorative separator */}
              <div className="flex justify-center items-center gap-4 mb-8">
                <div
                  className="w-8 h-0.5"
                  style={{ background: goldGradient }}
                ></div>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: goldColor }}
                ></div>
                <div
                  className="w-8 h-0.5"
                  style={{ background: goldGradient }}
                ></div>
              </div>

              <p
                className="text-lg italic"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                Share your story and tag #LINCSSA30DaysChallenge
              </p>
            </div>
          )}
        </motion.div>

        {/* Footer with premium styling */}
        <motion.div
          variants={itemVariants}
          className={`flex justify-between items-center border-t border-white/10 ${
            isIntroCard ? "mt-2 pt-2" : "mt-auto pt-4"
          }`}
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

// Export the challenge data and a component that can generate all 30 cards
export { challengeData };

// Component to generate a specific day's challenge
export function generateChallengeCard(
  day: number,
  logoUrl: string,
  branding: boolean = true
) {
  const challengeItem = challengeData.find((item) => item.day === day);
  if (!challengeItem) {
    throw new Error(`Challenge for day ${day} not found`);
  }

  return (
    <ChallengeCard
      day={day}
      challenge={challengeItem.text}
      logoUrl={logoUrl}
      branding={branding}
    />
  );
}
