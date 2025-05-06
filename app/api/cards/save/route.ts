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

    // Check dataUrl size for debugging
    const approxSizeInMB = (cardDataUrl.length * 0.75) / 1024 / 1024;
    console.log(`Approximate image size: ${approxSizeInMB.toFixed(2)} MB`);

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
            cardDataUrl,
            {
              folder: "lincssa/personality-cards",
              resource_type: "image",
              public_id: `${studentId}-card-${Date.now()}`,
              // Add optimization options
              quality: "auto",
              fetch_format: "auto",
              flags: "lossy",
              // Set smaller dimensions if the image is too large
              transformation: [
                { width: 1080, crop: "limit" },
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
