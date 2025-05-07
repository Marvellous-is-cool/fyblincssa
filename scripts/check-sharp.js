#!/usr/bin/env node

/**
 * This script checks if the sharp module is properly installed
 * and attempts to reinstall it for the current platform if needed.
 */

const { execSync } = require("child_process");
const os = require("os");

// Check if we're running in a production or build environment
const isProduction = process.env.NODE_ENV === "production";
const isVercel = process.env.VERCEL === "1";

// Only perform special installation in production environments
if (isProduction || isVercel) {
  console.log(
    "Production environment detected, checking Sharp installation..."
  );

  try {
    // Try to load Sharp to see if it works
    require("sharp");
    console.log("✅ Sharp is installed and functional");
  } catch (err) {
    console.warn("⚠️ Sharp module failed to load:", err.message);
    console.log("🔄 Attempting to reinstall Sharp for the current platform...");

    try {
      // Get the current platform and architecture
      const platform = os.platform();
      const arch = os.arch();

      console.log(`Platform: ${platform}, Architecture: ${arch}`);

      // Install Sharp specifically for this platform
      const command = `npm install --no-save sharp --platform=${platform} --arch=${arch}`;
      console.log(`Running: ${command}`);

      execSync(command, { stdio: "inherit" });

      // Verify the installation
      try {
        require("sharp");
        console.log("✅ Sharp has been successfully reinstalled");
      } catch (verifyErr) {
        console.error("❌ Sharp reinstallation failed:", verifyErr.message);
        console.log(
          "⚠️ The application will continue without Sharp. Image processing may be limited."
        );
      }
    } catch (installErr) {
      console.error("❌ Error reinstalling Sharp:", installErr.message);
      console.log(
        "⚠️ The application will continue without Sharp. Image processing may be limited."
      );
    }
  }
} else {
  console.log("Development environment detected, skipping Sharp check");
}
