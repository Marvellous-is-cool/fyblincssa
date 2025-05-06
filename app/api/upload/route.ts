import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

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
    const buffer = Buffer.from(await file.arrayBuffer());

    // Log environment variables (without exposing the secret)
    console.log("Cloudinary Config Check:");
    console.log("Cloud Name:", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
    console.log("API Key Set:", !!process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
    console.log("API Secret Set:", !!process.env.CLOUDINARY_API_SECRET);

    // Handle Upload
    const uploadResponse = await new Promise((resolve, reject) => {
      // Create upload stream using buffer
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "fyb_students",
          resource_type: "image",
          transformation: [{ width: 800, crop: "limit" }, { quality: "auto" }],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      // Convert buffer to stream and pipe to uploadStream
      const Readable = require("stream").Readable;
      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null);
      readableStream.pipe(uploadStream);
    });

    return NextResponse.json(uploadResponse);
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Error uploading image", details: error },
      { status: 500 }
    );
  }
}
