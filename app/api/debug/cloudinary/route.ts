import { NextResponse } from "next/server";

export async function GET() {
  // Only include this in development, never in production
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Debug endpoint only available in development" },
      { status: 403 }
    );
  }

  return NextResponse.json({
    cloudinary: {
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "not set",
      api_key_set: !!process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      api_secret_set: !!process.env.CLOUDINARY_API_SECRET,
      // Do not expose the actual values in responses
    },
    node_env: process.env.NODE_ENV,
  });
}
