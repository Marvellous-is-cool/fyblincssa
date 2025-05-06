import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { getAuth } from "firebase-admin/auth";
import * as fs from "fs";
import * as path from "path";

// Enhanced function to properly format the private key
function formatPrivateKey(key: string | undefined): string {
  if (!key) {
    throw new Error("FIREBASE_ADMIN_PRIVATE_KEY is not defined");
  }

  // Check if the key already has actual newlines
  if (key.includes("\n") && !key.includes("\\n")) {
    console.log("Private key already contains actual newlines");
    return key;
  }

  // Handle the key with different escape patterns
  // Replace both JSON-style escaped newlines and regular escaped newlines
  // This handles both '\\n' and '\n' cases
  let formattedKey = key;

  // First, handle double-escaped newlines (\\n)
  formattedKey = formattedKey.replace(/\\n/g, "\n");

  // Then, make sure we handle any remaining \n strings (that were not actually newlines)
  formattedKey = formattedKey.replace(/\\\\n/g, "\\n");

  // Ensure it starts and ends with the right format
  if (!formattedKey.startsWith("-----BEGIN PRIVATE KEY-----")) {
    console.warn("Formatted key doesn't start with the expected prefix");
  }

  if (
    !formattedKey.endsWith("-----END PRIVATE KEY-----\n") &&
    !formattedKey.endsWith("-----END PRIVATE KEY-----")
  ) {
    console.warn("Formatted key doesn't end with the expected suffix");
  }

  return formattedKey;
}

// Function to try reading the key from a file as a fallback
function readPrivateKeyFromFile(): string | null {
  try {
    // Check several possible locations for the service account key file
    const possiblePaths = [
      path.join(process.cwd(), "firebase-service-account.json"),
      path.join(process.cwd(), "firebase-adminsdk.json"),
    ];

    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        console.log(`Reading Firebase Admin private key from ${filePath}`);
        const serviceAccount = JSON.parse(fs.readFileSync(filePath, "utf8"));
        return serviceAccount.private_key;
      }
    }
    return null;
  } catch (error) {
    console.error("Error reading private key from file:", error);
    return null;
  }
}

// Check if we're already initialized to prevent multiple instances
function getFirebaseAdminApp() {
  try {
    if (getApps().length > 0) {
      return getApps()[0];
    }

    // Try to get the private key from environment variable
    let privateKey: string;
    try {
      privateKey = formatPrivateKey(process.env.FIREBASE_ADMIN_PRIVATE_KEY);
      console.log(
        "Successfully formatted private key from environment variable"
      );
    } catch (envError) {
      console.warn(
        "Error getting private key from environment variables:",
        envError
      );

      // Try to get from file as fallback
      const fileKey = readPrivateKeyFromFile();
      if (fileKey) {
        privateKey = formatPrivateKey(fileKey);
        console.log("Successfully formatted private key from file");
      } else {
        throw new Error(
          "Could not get Firebase Admin private key from any source"
        );
      }
    }

    // Initialize with service account
    const certConfig = {
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: privateKey,
    };

    // Log initialization without exposing the actual key
    console.log(
      "Initializing Firebase Admin with project:",
      process.env.FIREBASE_ADMIN_PROJECT_ID
    );
    console.log("Client email:", process.env.FIREBASE_ADMIN_CLIENT_EMAIL);
    console.log("Private key length:", privateKey?.length || 0);

    // Log first and last few characters of the private key for debugging
    if (privateKey && privateKey.length > 20) {
      console.log(
        "Private key starts with:",
        privateKey.substring(0, 20) + "..."
      );
      console.log(
        "Private key ends with:",
        "..." + privateKey.substring(privateKey.length - 20)
      );
    }

    return initializeApp({
      credential: cert(certConfig),
      storageBucket: process.env.FIREBASE_ADMIN_STORAGE_BUCKET,
    });
  } catch (error: any) {
    console.error("Firebase Admin initialization error:", error.message);

    // Additional logging for debugging
    if (error.message.includes("DECODER")) {
      console.error(
        "This is likely a private key format issue. Check the format of your FIREBASE_ADMIN_PRIVATE_KEY."
      );
    }

    throw error;
  }
}

// Initialize the app
let adminDb: FirebaseFirestore.Firestore;
let adminAuth: any;
let adminStorage: any;

try {
  const app = getFirebaseAdminApp();

  // Initialize Firebase Admin services
  adminDb = getFirestore(app);
  adminAuth = getAuth(app);
  adminStorage = getStorage(app);

  console.log("Firebase Admin services initialized successfully");
} catch (error) {
  console.error("Failed to initialize Firebase Admin services:", error);

  // Provide fallback empty objects for services that will throw proper errors when used
  // This prevents the app from crashing during initialization
  adminDb = {} as any;
  adminAuth = {} as any;
  adminStorage = {} as any;
}

export { adminDb, adminAuth, adminStorage };
