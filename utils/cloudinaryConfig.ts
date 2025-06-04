import { Cloudinary } from "@cloudinary/url-gen";

const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  },
  url: {
    secure: true,
  },
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

export const getCloudinaryUrl = (publicId: string) => {
  return cld.image(publicId).toURL();
};

export default cld;
