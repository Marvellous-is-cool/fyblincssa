// This utility doesn't have external dependencies beyond built-in browser APIs
// A utility to extract dominant colors from images

export const extractColors = async (imageUrl: string): Promise<string[]> => {
  try {
    // Create an image element
    const img = document.createElement("img");

    // Create a promise to handle image loading
    const imageLoaded = new Promise<HTMLImageElement>((resolve, reject) => {
      img.crossOrigin = "Anonymous"; // Important for CORS

      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load image"));

      img.src = imageUrl;
    });

    // Wait for the image to load
    const loadedImg = await imageLoaded;

    // Create a canvas to draw the image
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    // Set canvas size to image size (scaling down large images if needed)
    const maxSize = 300;
    const scale = Math.min(
      1,
      maxSize / Math.max(loadedImg.width, loadedImg.height)
    );

    canvas.width = loadedImg.width * scale;
    canvas.height = loadedImg.height * scale;

    // Draw the image on the canvas
    ctx.drawImage(loadedImg, 0, 0, canvas.width, canvas.height);

    // Sample pixels at strategic positions
    const pixelData = [
      ctx.getImageData(0, 0, 1, 1).data, // Top left
      ctx.getImageData(canvas.width - 1, 0, 1, 1).data, // Top right
      ctx.getImageData(0, canvas.height - 1, 1, 1).data, // Bottom left
      ctx.getImageData(canvas.width - 1, canvas.height - 1, 1, 1).data, // Bottom right
      ctx.getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data, // Center
    ];

    // Convert pixel data to hex colors
    const colors = pixelData.map((pixel) => {
      return rgbToHex(pixel[0], pixel[1], pixel[2]);
    });

    // Filter out too dark or too light colors
    const filteredColors = colors.filter((color) => {
      const brightness = getBrightness(color);
      return brightness > 20 && brightness < 235; // Not too dark or too light
    });

    // If we filtered all colors, return a default set
    if (filteredColors.length === 0) {
      return ["#7C4DFF", "#FF4081", "#1E3A8A", "#FFD700"];
    }

    // Return unique colors with the best contrast
    return Array.from(new Set(filteredColors));
  } catch (error) {
    console.error("Error extracting colors:", error);
    // Return default colors if extraction failed
    return ["#7C4DFF", "#FF4081", "#1E3A8A", "#FFD700"];
  }
};

// Helper function to convert RGB to hex
const rgbToHex = (r: number, g: number, b: number): string => {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
};

// Helper function to calculate brightness
const getBrightness = (hexColor: string): number => {
  // Remove the # if present
  const hex = hexColor.replace("#", "");

  // Parse the hex values
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate brightness (HSP color model)
  // See: https://alienryderflex.com/hsp.html
  return Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
};
