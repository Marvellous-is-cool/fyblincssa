import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toPng, toJpeg, toBlob } from "html-to-image";
import {
  FiDownload,
  FiShare2,
  FiImage,
  FiMaximize,
  FiEye,
} from "react-icons/fi";
import { extractColors } from "@/utils/colorExtractor";
import { templates } from "./templates";
import Modal from "@/components/Modal";
import toast from "react-hot-toast"; // Add the missing import for toast

// Define the valid template names
export type TemplateName = keyof typeof templates;

export interface Student {
  id?: string;
  fullName: string;
  matricNumber?: string;
  level?: string;
  department?: string;
  photoURL?: string;
  quote?: string;
  bio?: string;
  featured?: boolean;
  createdAt?: any;
  hobbies?: string;
  achievements?: string;
  specializationTrack?: string;
  favoriteCourse?: string;
  email?: string;
  phone?: string;
  // New field for storing the generated card URL
  cardImageURL?: string;
  [key: string]: any;
}

type PersonalityCardProps = {
  student: Student;
  template: TemplateName;
  onDownload?: (dataUrl: string) => void;
  onExport?: (blob: Blob) => void;
  logoUrl?: string;
  branding?: boolean;
  scale?: number;
  onCardGenerated?: (imageUrl: string) => void;
};

// Base64 encoded simple placeholder logo (a small "L" in a circle)
const FALLBACK_LOGO =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB+klEQVR4nO2ZP2gUQRTGf55FLKKFhVhoI4JWgoWFYGFhYSFYWIiFlSBY2FgJFjYWYmEhCBZiYSEIFmJhIVhYiIWIhYiFiIUcBzk55vKyO++yB7uZu4Vb5oNpZt++75vZ+fNmIJFIJBKJvUQNGABj4BPwDfgNLIAfwAfgPnAWaO6qigTawAhYAbaAf8BfYBlYNOND4AZweDcEdoGrjsIc14EPHIL/YkRvAi+BWaDWaqgXQrX83PzuA/AVmHOIvgK0ygq4A/wxxH0yMV0O4QdGwMrUa3G1SsElQ3Rk/G8C94BrwDHgINAAjgKngIfAotljBbhcReA145qP5vpuDK8zy4mfVwKuGuI+mbXTBfutGpeuisBH453PmLUrcS3bBLaB03kCT4zFviUmadUYiwvAYQchubjxLYG8W0Ngx1hswyhvnfcTT08RcM4YXzDP1JZEy/TkbfNn32z0ZolcKmEY7TPPXzKeXTK1VLLGXQU0zU3qs9jErH1hPBcXgGvGuC+wJ2KeRLTv45bESPi8MLDM3I1w5z0yAi8ZCx+X80S8p8K9y8aI+2DWTgFvhXueD/34fDS9iZDQVDlM0/hy0SCwJLzhMvDAeOijcDnmhzKj7LsTMhOumfBZUQQ6wsC3QtzDYYogUcMr4A1wvKoAEolEIpGon/8iy3co6UynUwAAAABJRU5ErkJggg==";

export default function PersonalityCard({
  student,
  template = "premium",
  onDownload,
  onExport,
  logoUrl = "/images/lincssa-logo.png",
  branding = true,
  scale = 1,
  onCardGenerated,
}: PersonalityCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [dominantColors, setDominantColors] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportFormat, setExportFormat] = useState<"png" | "jpeg">("png");
  const [cardRendered, setCardRendered] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [actualLogoUrl, setActualLogoUrl] = useState<string>(logoUrl);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Handle logo loading errors
  useEffect(() => {
    // Check if the provided logo URL exists
    const img = new Image();
    img.onload = () => {
      setActualLogoUrl(logoUrl);
    };
    img.onerror = () => {
      console.warn(`Logo not found at ${logoUrl}, using fallback`);
      setActualLogoUrl(FALLBACK_LOGO);
    };
    img.src = logoUrl;
  }, [logoUrl]);

  // Get the template component
  const TemplateComponent = templates[template] || templates.premium;

  // Extract colors from student photo or logo when available
  useEffect(() => {
    const extractCardColors = async () => {
      try {
        // Try to extract from student photo first, fall back to logo
        const imageUrl = student?.photoURL || actualLogoUrl;
        if (imageUrl) {
          const colors = await extractColors(imageUrl);
          setDominantColors(colors);
        }
      } catch (error) {
        console.error("Error extracting colors:", error);
        // Fallback colors if extraction fails
        setDominantColors(["#7C4DFF", "#FF4081", "#1E3A8A", "#FFD700"]);
      }
    };

    if (actualLogoUrl) {
      extractCardColors();
    }
  }, [student, actualLogoUrl]);

  // Mark card as rendered once colors are extracted
  useEffect(() => {
    if (dominantColors.length > 0) {
      // Delay slightly to ensure template has rendered
      const timer = setTimeout(() => {
        setCardRendered(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [dominantColors]);

  // Generate and download image with improved error handling
  const generateImage = async (format: "png" | "jpeg" = "png") => {
    if (!cardRef.current) {
      setDebugInfo("Card ref is not available");
      console.error("Card ref is not available");
      return null;
    }

    setIsGenerating(true);
    setDebugInfo("Starting card generation...");

    try {
      // Apply scaling for higher resolution
      const options = {
        pixelRatio: 3 * scale,
        quality: 0.95,
        backgroundColor: "#ffffff",
        fontEmbedCSS: "true", // String value instead of boolean
        cacheBust: true,
        // Add delay to ensure images load
        onclone: (clonedDoc: Document): Promise<void> => {
          return new Promise<void>((resolve) => {
            // Replace any broken image with fallback in the clone
            const images = clonedDoc.querySelectorAll("img");
            let loadedCount = 0;
            const totalImages = images.length;

            // Check if all images are loaded
            const checkAllLoaded = () => {
              loadedCount++;
              if (loadedCount >= totalImages) {
                console.log("All images processed, continuing with conversion");
                setTimeout(resolve, 500); // Additional small delay for stability
              }
            };

            // If no images present, resolve immediately
            if (totalImages === 0) {
              setTimeout(resolve, 500);
              return;
            }

            // Handle each image loading or errors
            images.forEach((img) => {
              if (img.complete) {
                checkAllLoaded();
              } else {
                img.onload = checkAllLoaded;
                img.onerror = () => {
                  console.warn(
                    "Image failed to load in clone, using fallback:",
                    img.src
                  );
                  img.src = FALLBACK_LOGO;
                  checkAllLoaded();
                };
              }
            });

            // Safety timeout in case images never load or complete
            setTimeout(() => {
              console.log("Safety timeout triggered for image loading");
              resolve();
            }, 3000);
          });
        },
      };

      setDebugInfo("Applying html-to-image conversion...");

      let dataUrl, blob;

      try {
        if (format === "png") {
          setDebugInfo("Starting PNG conversion...");
          dataUrl = await toPng(cardRef.current, options);
          setDebugInfo("PNG URL generated, creating blob...");
          blob = await toBlob(cardRef.current, options);
        } else {
          setDebugInfo("Starting JPEG conversion...");
          dataUrl = await toJpeg(cardRef.current, { ...options, quality: 0.9 });
          blob = await toBlob(cardRef.current, {
            ...options,
            type: "image/jpeg",
          });
        }

        setDebugInfo("Image generated successfully");
      } catch (conversionError: any) {
        console.error("Error during image conversion:", conversionError);
        const errorDetails =
          conversionError?.message || "Unknown conversion error";
        setDebugInfo(`Conversion error: ${errorDetails}`);
        throw conversionError;
      }

      // Notify parent if we have a callback for generated cards
      if (onCardGenerated && dataUrl) {
        setDebugInfo("Calling onCardGenerated callback");
        onCardGenerated(dataUrl);
      }

      // Call the download callback if provided
      if (onDownload && dataUrl) {
        setDebugInfo("Calling onDownload callback");
        onDownload(dataUrl);
      }

      // Call the export callback if provided
      if (onExport && blob) {
        setDebugInfo("Calling onExport callback");
        onExport(blob);
      }

      // If no callbacks, trigger download directly
      if (!onDownload && !onExport && dataUrl) {
        setDebugInfo("No callbacks provided, downloading directly");
        const link = document.createElement("a");
        link.download = `personality-card-${
          student?.fullName?.replace(/\s+/g, "-").toLowerCase() || "card"
        }.${format}`;
        link.href = dataUrl;
        document.body.appendChild(link); // This can help in some browsers
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
        }, 100);
      }

      return { dataUrl, blob };
    } catch (error: any) {
      console.error("Error generating image:", error);
      setDebugInfo(`Error: ${error.message || "Unknown error"}`);
      toast.error("There was an error generating the image. Please try again.");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="personality-card-container">
      {/* Card for export - hidden but rendered */}
      <div
        className="fixed top-0 left-0 pointer-events-none"
        style={{ opacity: 0, zIndex: -1000 }}
      >
        <div
          ref={cardRef}
          className="personality-card-export"
          style={{
            width: "1080px", // Fixed size for consistent exports
            height: "1920px",
          }}
        >
          <TemplateComponent
            student={student}
            colors={dominantColors}
            logoUrl={actualLogoUrl}
            branding={branding}
          />
        </div>
      </div>

      {/* Visual Preview (visible version of the card) */}
      <div className="flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card-preview relative overflow-hidden rounded-2xl shadow-2xl mx-auto group cursor-pointer"
          style={{
            width: "270px", // 1080px / 4 = 270px
            height: "480px", // 1920px / 4 = 480px
            backgroundColor: dominantColors[3] || "#ffffff",
            transform: "rotate(-3deg)", // Add slant effect to the card
            transformOrigin: "center center",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
          onClick={() => setShowPreviewModal(true)}
        >
          <TemplateComponent
            student={student}
            colors={dominantColors}
            logoUrl={actualLogoUrl}
            branding={branding}
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
              <FiMaximize className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Export Controls */}
      <div className="flex flex-col items-center mt-6 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowPreviewModal(true)}
            className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiEye className="w-4 h-4" />
            Preview
          </button>

          <select
            className="px-4 py-2 border rounded-lg text-gray-700 bg-white"
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as "png" | "jpeg")}
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
          </select>

          <button
            onClick={() => generateImage(exportFormat)}
            disabled={isGenerating || !cardRendered}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            id="personality-card-download-button"
          >
            {isGenerating ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                Generating...
              </>
            ) : !cardRendered ? (
              <>
                <span className="animate-pulse h-4 w-4 bg-white rounded-full mr-2"></span>
                Preparing...
              </>
            ) : (
              <>
                <FiDownload className="w-4 h-4" />
                Download Card
              </>
            )}
          </button>
        </div>
        {debugInfo && (
          <p className="text-xs text-gray-500 mt-2 max-w-md text-center">
            Status: {debugInfo}
          </p>
        )}
      </div>

      {/* Full-size preview modal */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        size="full"
      >
        <div className="flex items-center justify-center h-full p-4">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl max-h-full">
            <div
              className="flex items-center justify-center min-h-full p-4"
              style={{
                aspectRatio: "9/16",
                maxWidth: "100%",
                height: "100%",
                width: "auto",
              }}
            >
              <TemplateComponent
                student={student}
                colors={dominantColors}
                logoUrl={actualLogoUrl}
                branding={branding}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
