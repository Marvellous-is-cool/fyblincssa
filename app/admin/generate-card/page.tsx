"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import AnimatedButton from "@/components/AnimatedButton";
import PersonalityCard, {
  TemplateName,
  Student,
} from "@/components/PersonalityCard";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiDownload,
  FiSliders,
  FiCheckCircle,
  FiShare2,
  FiEye,
  FiImage,
} from "react-icons/fi";
import Link from "next/link";

// Template options with proper type annotations
const TEMPLATE_OPTIONS = [
  {
    id: "premium" as TemplateName,
    name: "Premium",
    description: "An elegant, premium design with vibrant gradients",
  },
  {
    id: "vibrant" as TemplateName,
    name: "Vibrant",
    description: "Bold and colorful with dynamic shapes",
  },
  {
    id: "minimalist" as TemplateName,
    name: "Minimalist",
    description: "Clean, simple design with elegant typography",
  },
  {
    id: "modern" as TemplateName,
    name: "Modern",
    description: "Contemporary split design with geometric elements",
  },
];

const FALLBACK_LOGO_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB+klEQVR4nO2ZP2gUQRTGf55FLKKFhVhoI4JWgoWFYGFhYSFYWIiFlSBY2FgJFjYWYmEhCBZiYSEIFmJhIVhYiIWIhYiFiIUcBzk55vKyO++yB7uZu4Vb5oNpZt++75vZ+fNmIJFIJBKJvUQNGABj4BPwDfgNLIAfwAfgPnAWaO6qigTawAhYAbaAf8BfYBlYNOND4AZweDcEdoGrjsIc14APHIL/YkRvAi+BWaDWaqgXQrX83PzuA/AVmHOIvgK0ygq4A/wxxH0yMV0O4QdGwMrUa3G1SsElQ3Rk/G8C94BrwDHgINAAjgKngIfAotljBbhcReA145qP5vpuDK8zy4mfVwKuGuI+mbXTBfutGpeuisBH453PmLUrcS3bBLaB03kCT4zFviUmadUYiwvAYQchubjxLYG8W0Ngx1hswyhvnfcTT08RcM4YXzDP1JZEy/TkbfNn32z0ZolcKmEY7TPPXzKeXTK1VLLGXQU0zU3qs9jErH1hPBcXgGvGuC+wJ2KeRLTv45bESPi8MLDM3I1w5z0yAi8ZCx+X80S8p8K9y8aI+2DWTgFvhXueD/34fDS9iZDQVDlM0/hy0SCwJLzhMvDAeOijcDnmhzKj7LsTMhOumfBZUQQ6wsC3QtzDYYogUcMr4A1wvKoAEolEIpGon/8iy3co6UynUwAAAABJRU5ErkJggg==";

export default function GenerateCardPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateName>("premium");
  const [showBranding, setShowBranding] = useState(true);
  const [exportQuality, setExportQuality] = useState("high");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedCardUrl, setSavedCardUrl] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [logoUrl, setLogoUrl] = useState("/images/lincssa-logo.png");

  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = searchParams.get("id");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Verify if the logo exists
    const img = new Image();
    img.onload = () => {
      console.log("Logo found at expected path");
    };
    img.onerror = () => {
      console.warn("Logo not found at expected path, using fallback");
      setLogoUrl(FALLBACK_LOGO_URL);
    };
    img.src = "/images/lincssa-logo.png";
  }, []);

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      router.push("/admin/login");
      return;
    }

    // Fetch student data if ID is provided
    if (studentId) {
      fetchStudent();
    } else {
      setIsLoading(false);
      toast.error("No student ID provided");
    }
  }, [user, studentId, router]);

  const fetchStudent = async () => {
    if (!studentId) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/students/${studentId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch student data");
      }
      const data = await response.json();
      setStudent(data);
    } catch (error) {
      console.error("Error fetching student:", error);
      toast.error("Failed to load student data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (dataUrl: string) => {
    try {
      console.log("Download handler triggered with data URL");

      // Create and click link element to trigger download
      const link = document.createElement("a");
      link.download = `${student?.fullName || "personality"}-card.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Card downloaded successfully!");

      // After successful download, offer to save the card for homepage display
      if (!savedCardUrl && student?.featured) {
        toast(
          (t) => (
            <div className="flex flex-col items-center space-y-2">
              <p>Save this card for homepage display?</p>
              <div className="flex space-x-2">
                <button
                  className="px-3 py-1 bg-primary text-white rounded-md"
                  onClick={() => {
                    toast.dismiss(t.id);
                    handleSaveCard(dataUrl);
                  }}
                >
                  Yes
                </button>
                <button
                  className="px-3 py-1 bg-gray-300 rounded-md"
                  onClick={() => toast.dismiss(t.id)}
                >
                  No
                </button>
              </div>
            </div>
          ),
          { duration: 8000 }
        );
      }
    } catch (error) {
      console.error("Error downloading card:", error);
      toast.error("Failed to download card");
    }
  };

  // New function to save the card for homepage display
  const handleSaveCard = async (dataUrl: string) => {
    if (!student?.id) return;

    try {
      setIsSaving(true);
      toast.loading("Saving card for homepage display...");

      const response = await fetch("/api/cards/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: student.id,
          cardDataUrl: dataUrl,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save card");
      }

      const result = await response.json();
      setSavedCardUrl(result.cardImageURL);

      toast.dismiss();
      toast.success(
        "Card saved successfully! It will now appear on the homepage."
      );
    } catch (error: any) {
      console.error("Error saving card:", error);
      toast.dismiss();
      toast.error(error.message || "Failed to save card");
    } finally {
      setIsSaving(false);
    }
  };

  const shareCard = async () => {
    try {
      setIsGenerating(true);
      toast.loading("Preparing card for sharing...");

      // This is where you would implement sharing functionality
      // For example, upload the card to storage and generate a shareable link

      // Simulate a delay for demonstration
      setTimeout(() => {
        toast.dismiss();
        toast.success("Sharing link copied to clipboard!");
        setIsGenerating(false);
      }, 2000);
    } catch (error) {
      console.error("Error sharing card:", error);
      toast.error("Failed to share card");
      setIsGenerating(false);
    }
  };

  // Fix the DOM element click method with proper type assertion
  const handleClickDownloadButton = () => {
    if (!isMounted) {
      console.log("Component not yet mounted, waiting...");
      return;
    }

    console.log("Attempting to find and click the download button");

    // Try using the ID we added to the button
    const downloadButton = document.getElementById(
      "personality-card-download-button"
    );
    if (downloadButton) {
      console.log("Download button found by ID, clicking");
      downloadButton.click();
      return;
    }

    // Fallback to querySelector
    const cardContainer = document.querySelector(".personality-card-container");
    console.log("Card container found:", !!cardContainer);

    if (cardContainer) {
      const cardButton = cardContainer.querySelector("button");
      console.log("Card button found via container:", !!cardButton);

      if (cardButton) {
        console.log("Clicking download button");
        cardButton.click();
      } else {
        console.error("Download button not found in card container");
        toast.error("Couldn't find download button. Please try again.");
      }
    } else {
      console.error("Card container not found");
      toast.error(
        "Card component not properly loaded. Please refresh the page."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Loading student data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12 md:px-8">
        <Link
          href="/admin/featured"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Featured Students</span>
        </Link>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-purple-600 p-6 md:p-8">
            <h1 className="text-2xl font-display font-bold text-white mb-2">
              Generate Personality Card
            </h1>
            <p className="text-white/80">
              Create a beautiful shareable card featuring {student?.fullName}
            </p>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Left column - Options */}
              <div className="lg:w-1/3">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                    <FiSliders className="w-4 h-4 text-primary" />
                    Card Options
                  </h3>

                  <div className="space-y-6">
                    {/* Template Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Template
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {TEMPLATE_OPTIONS.map((template) => (
                          <button
                            key={template.id}
                            onClick={() => setSelectedTemplate(template.id)}
                            className={`p-3 text-black rounded-lg border-2 transition-all text-left ${
                              selectedTemplate === template.id
                                ? "border-primary bg-primary/5"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="font-medium mb-1">
                              {template.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {template.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Branding Option */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LINCSSA Branding
                      </label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="branding-toggle"
                          checked={showBranding}
                          onChange={() => setShowBranding(!showBranding)}
                          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <label
                          htmlFor="branding-toggle"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Include LINCSSA logo and branding
                        </label>
                      </div>
                    </div>

                    {/* Export Quality */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Export Quality
                      </label>
                      <select
                        value={exportQuality}
                        onChange={(e) => setExportQuality(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                      >
                        <option value="medium">Medium (Faster)</option>
                        <option value="high">High (Recommended)</option>
                        <option value="ultra">Ultra (Slower)</option>
                      </select>
                      <p className="mt-1 text-xs text-gray-500">
                        Higher quality may take longer to generate
                      </p>
                    </div>
                  </div>
                </div>

                {/* Student Details Preview */}
                <div className="bg-gray-50 rounded-xl p-6 mt-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                    <FiCheckCircle className="w-4 h-4 text-green-500" />
                    Student Details
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        {student?.photoURL ? (
                          <img
                            src={student.photoURL}
                            alt={student.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-300 text-white font-bold">
                            {student?.fullName?.[0] || "?"}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {student?.fullName}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {student?.level} Level • {student?.department}
                        </p>
                      </div>
                    </div>
                    {student?.quote && (
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Quote:
                        </p>
                        <p className="text-gray-700 italic">
                          "{student.quote}"
                        </p>
                      </div>
                    )}
                    {student?.matricNumber && (
                      <p className="text-sm text-gray-500">
                        Matric Number: {student.matricNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* Saved Card Status */}
                {student?.featured && (
                  <div className="bg-gray-50 rounded-xl p-6 mt-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                      <FiShare2 className="w-4 h-4 text-primary" />
                      Homepage Card Status
                    </h3>

                    {savedCardUrl || student.cardImageURL ? (
                      <div className="text-center">
                        <div className="mb-3 bg-green-100 text-green-800 text-sm font-medium px-3 py-2 rounded-lg">
                          Card is saved and will display on the homepage
                        </div>
                        <a
                          href={savedCardUrl || student.cardImageURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          View saved card
                        </a>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="mb-3 bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-2 rounded-lg">
                          Card not yet saved for homepage display
                        </div>
                        <p className="text-sm text-gray-500">
                          Generate and download a card, then save it for the
                          homepage
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right column - Card Preview */}
              <div className="lg:w-2/3">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-6 self-start">
                    Card Preview
                  </h3>

                  <div className="overflow-auto flex justify-center">
                    {student && (
                      <PersonalityCard
                        student={student}
                        template={selectedTemplate}
                        onDownload={handleDownload}
                        branding={showBranding}
                        logoUrl={logoUrl} // Use the state variable
                        scale={
                          exportQuality === "ultra"
                            ? 2
                            : exportQuality === "high"
                            ? 1.5
                            : 1
                        }
                      />
                    )}
                  </div>
                  <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center w-full">
                    {student?.featured && (
                      <button
                        onClick={handleClickDownloadButton}
                        disabled={isGenerating || isSaving}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                      >
                        {isGenerating || isSaving ? (
                          <>
                            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                            {isSaving ? "Saving..." : "Generating..."}
                          </>
                        ) : (
                          <>
                            <FiDownload className="w-4 h-4" />
                            Download & Save Card
                          </>
                        )}
                      </button>
                    )}

                    {!student?.featured && (
                      <button
                        onClick={handleClickDownloadButton}
                        disabled={isGenerating}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                      >
                        {isGenerating ? (
                          <>
                            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                            Generating...
                          </>
                        ) : (
                          <>
                            <FiDownload className="w-4 h-4" />
                            Download Card
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
