import { v2 as cloudinaryServer } from "cloudinary";
import { NextResponse } from "next/server";

// Configure Cloudinary with environment variables
cloudinaryServer.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Use the new route segment config format instead of the deprecated export const config
export const runtime = "nodejs";

// Load sharp conditionally to avoid runtime errors
let sharpModule: any = null;
try {
  sharpModule = require("sharp");
  console.log("Sharp module loaded successfully");
} catch (err) {
  const errorMessage = err instanceof Error ? err.message : String(err);
  console.warn("Sharp module failed to load:", errorMessage);
  console.warn("Image optimization will be disabled");
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer
    const originalBuffer = Buffer.from(await file.arrayBuffer());
    let uploadBuffer = originalBuffer;

    // Only use sharp if it loaded successfully
    if (sharpModule) {
      try {
        // Process with sharp - resize to reasonable dimensions and compress
        const optimizedBuffer = await sharpModule(originalBuffer)
          .resize({
            width: 1200,
            height: 1200,
            fit: "inside",
            withoutEnlargement: true,
          })
          .jpeg({ quality: 80, progressive: true })
          .toBuffer();

        // If optimization reduced size significantly, use the optimized version
        if (optimizedBuffer.length < originalBuffer.length) {
          console.log(
            `Image optimized: ${originalBuffer.length} → ${optimizedBuffer.length} bytes`
          );
          uploadBuffer = optimizedBuffer;
        } else {
          // If optimization didn't help, try more aggressive compression
          const moreOptimizedBuffer = await sharpModule(originalBuffer)
            .resize({
              width: 800,
              height: 800,
              fit: "inside",
              withoutEnlargement: true,
            })
            .jpeg({ quality: 70, progressive: true })
            .toBuffer();

          uploadBuffer = moreOptimizedBuffer;
        }
      } catch (sharpError) {
        console.error("Image optimization failed:", sharpError);
        // If sharp fails, continue with original buffer
        uploadBuffer = originalBuffer;
      }
    } else {
      console.log(
        "Using original image (Sharp not available for optimization)"
      );
    }

    // Handle Upload - rely on Cloudinary's built-in optimization when Sharp isn't available
    const uploadResponse = await new Promise((resolve, reject) => {
      // Create upload stream using buffer
      const uploadStream = cloudinaryServer.uploader.upload_stream(
        {
          folder: "fyb_students",
          resource_type: "auto",
          secure: true,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      // Convert buffer to stream and pipe to uploadStream
      const Readable = require("stream").Readable;
      const readableStream = new Readable();
      readableStream.push(uploadBuffer);
      readableStream.push(null);
      readableStream.pipe(uploadStream);
    });

    // Ensure HTTPS URL is returned
    return NextResponse.json({
      url: (uploadResponse as any).secure_url,
      public_id: (uploadResponse as any).public_id,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Error uploading image" },
      { status: 500 }
    );
  }
}
