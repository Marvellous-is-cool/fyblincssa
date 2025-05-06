import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Use the new route segment config format instead of the deprecated export const config
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer
    const originalBuffer = Buffer.from(await file.arrayBuffer());

    // Optimize image with sharp
    let optimizedBuffer;
    try {
      // Process with sharp - resize to reasonable dimensions and compress
      optimizedBuffer = await sharp(originalBuffer)
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
      } else {
        // If optimization didn't help, try more aggressive compression
        optimizedBuffer = await sharp(originalBuffer)
          .resize({
            width: 800,
            height: 800,
            fit: "inside",
            withoutEnlargement: true,
          })
          .jpeg({ quality: 70, progressive: true })
          .toBuffer();
      }
    } catch (sharpError) {
      console.error("Image optimization failed:", sharpError);
      // If sharp fails, continue with original buffer
      optimizedBuffer = originalBuffer;
    }

    // Handle Upload
    const uploadResponse = await new Promise((resolve, reject) => {
      // Create upload stream using buffer
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "fyb_students",
          resource_type: "image",
          // Add transformations to further optimize on Cloudinary
          transformation: [
            { width: 800, crop: "limit" },
            { quality: "auto:good" },
            { fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      // Convert buffer to stream and pipe to uploadStream
      const Readable = require("stream").Readable;
      const readableStream = new Readable();
      readableStream.push(optimizedBuffer);
      readableStream.push(null);
      readableStream.pipe(uploadStream);
    });

    return NextResponse.json(uploadResponse);
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Error uploading image" },
      { status: 500 }
    );
  }
}
