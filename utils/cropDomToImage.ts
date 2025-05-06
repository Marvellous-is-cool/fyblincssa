import { toPng, toJpeg, toBlob } from "html-to-image";

// Define our own Options interface since the one in html-to-image isn't exported
interface HtmlToImageOptions {
  quality?: number;
  backgroundColor?: string;
  pixelRatio?: number;
  width?: number;
  height?: number;
  canvasWidth?: number;
  canvasHeight?: number;
  style?: object;
  filter?: (node: HTMLElement) => boolean;
  type?: string;
  fontEmbedCSS?: string;
  imagePlaceholder?: string;
  preferredFontFormat?: string;
  cacheBust?: boolean;
  skipAutoScale?: boolean;
  onclone?: (document: Document) => Promise<void> | void;
}

/**
 * Enhanced DOM to image conversion with better error handling and debugging
 * @param element DOM element to convert
 * @param options Conversion options
 * @returns Promise with the result
 */
export async function convertDomToImage(
  element: HTMLElement,
  options: HtmlToImageOptions & { format?: "png" | "jpeg" } = { format: "png" }
) {
  if (!element) {
    throw new Error("Element not found");
  }

  const format = options.format || "png";
  delete options.format;

  // Ensure images are loaded
  await waitForImages(element);

  // Configure conversion options
  const conversionOptions: HtmlToImageOptions = {
    backgroundColor: "#ffffff",
    pixelRatio: 3,
    quality: 0.95,
    fontEmbedCSS: "true", // Force as string for compatibility
    cacheBust: true,
    ...options,
    onclone: async (clonedDocument: Document) => {
      // If custom onclone provided, run it first
      if (options.onclone) {
        await options.onclone(clonedDocument);
      }

      // Wait for all images in clone
      await waitForImages(clonedDocument.body);

      // No return needed as this should be void or Promise<void>
    },
  };

  console.log(`Starting conversion to ${format}...`);

  try {
    // Convert based on format
    if (format === "jpeg") {
      return {
        dataUrl: await toJpeg(element, conversionOptions),
        blob: await toBlob(element, {
          ...conversionOptions,
          type: "image/jpeg",
        }),
      };
    } else {
      return {
        dataUrl: await toPng(element, conversionOptions),
        blob: await toBlob(element, conversionOptions),
      };
    }
  } catch (error) {
    console.error("Error during image conversion:", error);
    throw error;
  }
}

/**
 * Waits for all images in a DOM element to load
 * @param element DOM element containing images
 * @returns Promise that resolves when all images are loaded or timeout
 */
async function waitForImages(element: HTMLElement): Promise<void> {
  const images = element.querySelectorAll("img");
  if (images.length === 0) return;

  return new Promise((resolve) => {
    let loadedCount = 0;
    const totalImages = images.length;

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount >= totalImages) {
        resolve();
      }
    };

    images.forEach((img) => {
      if (img.complete) {
        checkAllLoaded();
      } else {
        img.onload = checkAllLoaded;
        img.onerror = () => {
          console.warn("Image failed to load:", img.src);
          checkAllLoaded();
        };
      }
    });

    // Safety timeout
    setTimeout(resolve, 3000);
  });
}
