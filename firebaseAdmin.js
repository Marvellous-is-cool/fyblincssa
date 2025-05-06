const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

let serviceAccount;

try {
  // Try to get the service account from base64-encoded env var
  const base64Key = process.env.FIREBASE_ADMIN_KEY_BASE64;

  if (base64Key) {
    // Decode and parse the service account JSON
    const decodedKey = Buffer.from(base64Key, "base64").toString("utf-8");
    serviceAccount = JSON.parse(decodedKey);
  } else {
    // Try to read from a file as fallback
    const possiblePaths = [
      path.join(process.cwd(), "firebase-service-account.json"),
      path.join(process.cwd(), "firebase-adminsdk.json"),
      path.join(process.cwd(), "fyblinc-key.json"),
    ];

    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        serviceAccount = JSON.parse(fs.readFileSync(filePath, "utf8"));
        break;
      }
    }
  }

  if (!serviceAccount) {
    throw new Error("Could not get Firebase Admin credentials from any source");
  }

  // Initialize Firebase with the service account
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_ADMIN_STORAGE_BUCKET,
  });
} catch (error) {
  console.error("Firebase Admin initialization error:", error);
  throw error;
}

module.exports = admin;
