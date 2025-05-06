import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import {
  getAuth,
  signInWithEmailAndPassword,
  updatePassword,
} from "firebase/auth";
import { app } from "@/lib/firebase";

export async function POST(request: Request) {
  try {
    const { currentPassword, newPassword } = await request.json();

    // Validate request
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    // Get authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token
    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Get user's email
    const userRecord = await adminAuth.getUser(uid);
    const email = userRecord.email;

    if (!email) {
      return NextResponse.json({ error: "User has no email" }, { status: 400 });
    }

    // Update password can only be done through client SDK with current auth
    // We verify the old password by attempting a sign-in
    const auth = getAuth(app);

    try {
      // Verify current password
      await signInWithEmailAndPassword(auth, email, currentPassword);

      // Update the password
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
      } else {
        throw new Error("Not authenticated");
      }

      return NextResponse.json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (authError: any) {
      console.error("Authentication error:", authError);

      if (authError.code === "auth/wrong-password") {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: "Authentication failed: " + authError.message },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { error: error.message || "Error changing password" },
      { status: 500 }
    );
  }
}
