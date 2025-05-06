import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { getAuth } from "firebase-admin/auth";
import * as fs from "fs";
import * as path from "path";

// Function to try reading the key from a file as a fallback
function readPrivateKeyFromFile(): any | null {
  try {
    // Check several possible locations for the service account key file
    const possiblePaths = [
      path.join(process.cwd(), "firebase-service-account.json"),
      path.join(process.cwd(), "firebase-adminsdk.json"),
      path.join(process.cwd(), "fyblinc-key.json"),
    ];

    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, "utf8"));
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

    let serviceAccount: any;

    // Primary method: Try to get the service account from base64-encoded env var
    const base64Key = process.env.FIREBASE_ADMIN_KEY_BASE64;

    if (base64Key) {
      try {
        // Decode and parse the service account JSON
        const decodedKey = Buffer.from(base64Key, "base64").toString("utf-8");

        // Check if it looks like JSON
        if (
          decodedKey.trim().startsWith("{") &&
          decodedKey.trim().endsWith("}")
        ) {
          serviceAccount = JSON.parse(decodedKey);

          // Verify required fields are present
          if (
            !(
              serviceAccount.project_id &&
              serviceAccount.private_key &&
              serviceAccount.client_email
            )
          ) {
            serviceAccount = null;
          }
        }
      } catch (decodeError) {
        console.error("Error decoding base64 service account:", decodeError);
        serviceAccount = null;
      }
    }

    // Fallback: Try to get the service account from file
    if (!serviceAccount) {
      serviceAccount = readPrivateKeyFromFile();

      // Last resort: Try to use individual environment variables
      if (!serviceAccount) {
        const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

        if (projectId && clientEmail && privateKey) {
          serviceAccount = {
            projectId,
            clientEmail,
            privateKey: privateKey.replace(/\\n/g, "\n"),
          };
        }
      }
    }

    if (
      !serviceAccount ||
      (!serviceAccount.projectId && !serviceAccount.project_id)
    ) {
      throw new Error(
        "Could not get Firebase Admin credentials from any source"
      );
    }

    // Support both camelCase and snake_case key formats
    const certConfig = {
      projectId: serviceAccount.projectId || serviceAccount.project_id,
      clientEmail: serviceAccount.clientEmail || serviceAccount.client_email,
      privateKey: serviceAccount.privateKey || serviceAccount.private_key,
    };

    return initializeApp({
      credential: cert(certConfig),
      storageBucket: process.env.FIREBASE_ADMIN_STORAGE_BUCKET,
    });
  } catch (error: any) {
    console.error("Firebase Admin initialization error:", error.message);
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
} catch (error) {
  console.error("Failed to initialize Firebase Admin services:", error);

  // Provide fallback empty objects for services that will throw proper errors when used
  adminDb = {} as any;
  adminAuth = {} as any;
  adminStorage = {} as any;
}

export { adminDb, adminAuth, adminStorage };
