import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with explicit values and increased timeout
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  timeout: 120000, // Increase timeout to 120 seconds (2 minutes)
});

// Load sharp conditionally to avoid runtime errors
let sharpModule: any = null;
try {
  sharpModule = require("sharp");
  console.log("Sharp module loaded successfully");
} catch (err) {
  console.warn(
    "Sharp module failed to load:",
    err instanceof Error ? err.message : String(err)
  );
  console.warn("Image optimization will be disabled");
}

export async function POST(request: Request) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get("authorization");

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split("Bearer ")[1];
      const decodedToken = await adminAuth.verifyIdToken(token);

      // Check if user has admin claim
      const isAdmin = decodedToken.admin === true;

      if (!isAdmin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    } else {
      // Only allow in development, require auth in production
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const { studentId, cardDataUrl } = await request.json();

    if (!studentId || !cardDataUrl) {
      return NextResponse.json(
        { error: "Student ID and card image data are required" },
        { status: 400 }
      );
    }

    // Verify Cloudinary configuration - log values for debugging
    console.log("Cloudinary Configuration:", {
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key_exists: !!process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      api_secret_exists: !!process.env.CLOUDINARY_API_SECRET,
      timeout: cloudinary.config().timeout || "default",
    });

    // Get student document to check if exists and is featured
    const studentRef = adminDb.collection("students").doc(studentId);
    const studentDoc = await studentRef.get();

    if (!studentDoc.exists) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const studentData = studentDoc.data();
    if (!studentData?.featured) {
      return NextResponse.json(
        {
          error: "Card can only be saved for featured students",
        },
        { status: 400 }
      );
    }

    // Prepare the image for upload
    let optimizedDataUrl = cardDataUrl;

    // Only use Sharp for optimization if it's available and the image is large
    if (sharpModule && cardDataUrl.length > 1000000) {
      try {
        // Extract base64 data from data URL
        const base64Data = cardDataUrl.split(",")[1];
        const buffer = Buffer.from(base64Data, "base64");

        // Optimize with sharp - preserve aspect ratio
        const optimizedBuffer = await sharpModule(buffer)
          .resize({
            width: 1080,
            height: 1920,
            fit: "contain",
            background: { r: 255, g: 255, b: 255, alpha: 1 },
            withoutEnlargement: true,
          })
          .jpeg({ quality: 85, progressive: true })
          .toBuffer();

        // Reconstruct data URL with optimized image
        const optimizedBase64 = optimizedBuffer.toString("base64");
        optimizedDataUrl = `data:image/jpeg;base64,${optimizedBase64}`;
        console.log("Image optimized with Sharp");
      } catch (optimizeError) {
        console.error("Card optimization error with Sharp:", optimizeError);
        // Keep the original data URL if optimization fails
      }
    } else {
      console.log(
        "Using original image (Sharp not available or image small enough)"
      );
    }

    // Implement upload with retry logic and better error handling
    let uploadResult;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`Upload attempt ${attempts} of ${maxAttempts}...`);

      try {
        // Upload the card image to Cloudinary with optimizations
        uploadResult = await new Promise((resolve, reject) => {
          // Set a timeout to handle hanging requests
          const uploadTimeout = setTimeout(() => {
            reject(new Error("Upload timed out after 60 seconds"));
          }, 60000);

          cloudinary.uploader.upload(
            optimizedDataUrl,
            {
              folder: "lincssa/personality-cards",
              resource_type: "image",
              public_id: `${studentId}-card-${Date.now()}`,
              // Add optimization options for Cloudinary to handle
              quality: "auto",
              fetch_format: "auto",
              flags: "lossy",
              // Ensure proper aspect ratio scaling
              transformation: [
                { width: 1080, height: 1920, crop: "fit" },
                { quality: "auto" },
              ],
            },
            (error, result) => {
              clearTimeout(uploadTimeout);
              if (error) {
                console.error(`Attempt ${attempts} error:`, error);
                reject(error);
              } else {
                console.log(`Upload successful on attempt ${attempts}`);
                resolve(result);
              }
            }
          );
        });

        // If we get here, upload succeeded, break the loop
        break;
      } catch (uploadError: any) {
        console.error(`Upload attempt ${attempts} failed:`, uploadError);

        // If this was the last attempt, throw the error
        if (attempts >= maxAttempts) {
          throw uploadError;
        }

        // Otherwise wait before retrying
        await new Promise((resolve) => setTimeout(resolve, 2000 * attempts));
      }
    }

    if (!uploadResult) {
      throw new Error("Failed to upload image after multiple attempts");
    }

    // Update the student document with the card image URL
    await studentRef.update({
      cardImageURL: (uploadResult as any).secure_url,
      cardUpdatedAt: new Date(),
    });

    console.log(
      "Card URL saved to database:",
      (uploadResult as any).secure_url
    );

    return NextResponse.json({
      success: true,
      cardImageURL: (uploadResult as any).secure_url,
      message: "Card saved successfully",
    });
  } catch (error: any) {
    console.error("Error saving card:", error);

    // Create a more detailed error response
    return NextResponse.json(
      {
        error: error.message || "Error saving card",
        code: error.http_code || error.code || 500,
        name: error.name || "Unknown",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
