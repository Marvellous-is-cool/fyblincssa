"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import ChallengeCard, {
  challengeData,
} from "@/components/PersonalityCard/templates/ChallengeCard";
import { toPng } from "html-to-image";

export default function ChallengePage() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const logoUrl = "/images/lincssa-logo.png";

  const handleDownload = async () => {
    if (!cardRef.current) return;

    setIsGenerating(true);
    try {
      // Wait a bit for fonts and images to load
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Generate image using html-to-image with tight dimensions
      const isIntroCard = selectedDay === 0;
      const dataUrl = await toPng(cardRef.current, {
        backgroundColor: "transparent",
        pixelRatio: 3,
        quality: 0.95,
        cacheBust: true,
        fontEmbedCSS: "true",
        // Let the card determine its own size for intro card
        ...(isIntroCard
          ? {}
          : {
              width: 800,
              height: 1600,
            }),
      });

      // Create download link
      const link = document.createElement("a");
      link.download = `LINCSSA-30Days-Challenge-${
        selectedDay === 0 ? "Introduction" : `Day${selectedDay}`
      }.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
    } catch (error) {
      console.error("Error generating challenge card:", error);
      alert("Failed to generate card. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const challengeItem = challengeData.find((item) => item.day === selectedDay);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            LINCSSA 30 Days Challenge
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Reflect on your linguistic and communication journey
          </p>

          {/* Day selector */}
          <div className="max-w-4xl mx-auto mb-8">
            <h2 className="text-2xl text-white mb-4">Select a Day</h2>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-6">
              {challengeData.map((challenge) => (
                <button
                  key={challenge.day}
                  onClick={() => setSelectedDay(challenge.day)}
                  className={`${
                    challenge.day === 0 ? "col-span-2" : ""
                  } h-12 rounded-lg font-bold transition-all duration-200 ${
                    selectedDay === challenge.day
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black scale-110 shadow-lg"
                      : "bg-white/10 text-white hover:bg-white/20 hover:scale-105"
                  }`}
                >
                  {challenge.day === 0 ? "INTRO" : challenge.day}
                </button>
              ))}
            </div>

            {/* Current challenge preview */}
            {challengeItem && (
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-yellow-400 mb-2">
                  {selectedDay === 0
                    ? "Introduction"
                    : `Day ${selectedDay} Challenge`}
                </h3>
                <p className="text-white text-lg leading-relaxed">
                  {challengeItem.text}
                </p>
              </div>
            )}

            {/* Download button */}
            <motion.button
              onClick={handleDownload}
              disabled={isGenerating}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 ${
                isGenerating
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black"
              }`}
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </div>
              ) : (
                `Download ${
                  selectedDay === 0 ? "Introduction" : `Day ${selectedDay}`
                } Challenge Card`
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Card preview */}
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={
              selectedDay === 0
                ? "shadow-2xl rounded-lg overflow-hidden"
                : "w-96 h-[768px] shadow-2xl rounded-lg overflow-hidden"
            }
          >
            <div
              ref={cardRef}
              className={selectedDay === 0 ? "inline-block" : "w-full h-full"}
            >
              <ChallengeCard
                day={selectedDay}
                challenge={challengeItem?.text || ""}
                logoUrl={logoUrl}
                branding={true}
              />
            </div>
          </motion.div>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto mt-12 text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">How to Use</h2>
          <div className="grid md:grid-cols-3 gap-6 text-gray-300">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
              <div className="text-3xl mb-3">📅</div>
              <h3 className="text-lg font-bold text-white mb-2">
                Select a Day
              </h3>
              <p>Choose from the 30 days of challenges above</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="text-lg font-bold text-white mb-2">
                Download Card
              </h3>
              <p>Get your personalized challenge card as an image</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
              <div className="text-3xl mb-3">📢</div>
              <h3 className="text-lg font-bold text-white mb-2">Share & Tag</h3>
              <p>Post your response with #LINCSSA30DaysChallenge</p>
            </div>
          </div>

          {/* All challenges list */}
          <div className="mt-12 text-left">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              All 30 Challenges
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {challengeData.map((challenge) => (
                <div
                  key={challenge.day}
                  className={`bg-white/5 backdrop-blur-md rounded-lg p-4 border transition-all duration-200 ${
                    selectedDay === challenge.day
                      ? "border-yellow-400 bg-white/10"
                      : "border-white/10 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        selectedDay === challenge.day
                          ? "bg-yellow-400 text-black"
                          : "bg-white/20 text-white"
                      }`}
                    >
                      {challenge.day === 0 ? "🎉" : challenge.day}
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {challenge.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
