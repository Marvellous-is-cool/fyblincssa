import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { getAuth } from "firebase-admin/auth";

// Function to properly format the private key
function formatPrivateKey(key: string | undefined): string {
  if (!key) {
    throw new Error("FIREBASE_ADMIN_PRIVATE_KEY is not defined");
  }

  // Keys from environment variables might come with escaped newlines
  // This properly formats them for use with the Firebase SDK
  return key.replace(/\\n/g, "\n");
}

// Check if we're already initialized to prevent multiple instances
function getFirebaseAdminApp() {
  try {
    if (getApps().length > 0) {
      return getApps()[0];
    }

    const privateKey = formatPrivateKey(process.env.FIREBASE_ADMIN_PRIVATE_KEY);

    // Initialize with service account
    const certConfig = {
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: privateKey,
    };

    // Log initialization attempt without exposing the actual key
    console.log(
      "Initializing Firebase Admin with project:",
      process.env.FIREBASE_ADMIN_PROJECT_ID
    );

    return initializeApp({
      credential: cert(certConfig),
      storageBucket: process.env.FIREBASE_ADMIN_STORAGE_BUCKET,
    });
  } catch (error: any) {
    console.error("Firebase Admin initialization error:", error.message);

    // Additional logging for debugging
    if (error.message.includes("DECODER")) {
      console.error(
        "This may be a private key format issue. Check that FIREBASE_ADMIN_PRIVATE_KEY is properly formatted."
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
