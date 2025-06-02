import { v2 as cloudinary } from "cloudinary";

// Add type definitions for Cloudinary options
interface CloudinaryTransformationOptions {
  width?: number;
  height?: number;
  crop?: string;
  fetch_format?: string;
  quality?: string | number;
}

interface CloudinaryOptions {
  secure?: boolean;
  transformation?: CloudinaryTransformationOptions[];
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const ensureHttps = (url: string) => {
  if (!url) return url;

  // Convert any http:// URLs to https://
  if (url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }

  // Add https:// to URLs starting with res.cloudinary.com
  if (url.startsWith("res.cloudinary.com")) {
    return `https://${url}`;
  }

  // If URL doesn't start with https://, add it
  if (!url.startsWith("https://")) {
    return `https://${url}`;
  }

  return url;
};

export const getSecureImageUrl = (
  publicId: string,
  options: CloudinaryOptions = {}
) => {
  return cloudinary.url(publicId, {
    secure: true,
    ...options,
    transformation: [
      { fetch_format: "auto" },
      { quality: "auto" },
      ...(options.transformation || []),
    ],
  });
};

export default cloudinary;
