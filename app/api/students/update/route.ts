import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ensureHttps } from "@/utils/cloudinaryConfig";

export async function PUT(request: Request) {
  try {
    const { id, updates } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    // Ensure photoURL is HTTPS if it exists
    if (updates.photoURL) {
      updates.photoURL = ensureHttps(updates.photoURL);
    }

    // Clean up undefined values
    Object.keys(updates).forEach(
      (key) => updates[key] === undefined && delete updates[key]
    );

    const studentRef = doc(db, "students", id);
    await updateDoc(studentRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      data: { id, ...updates },
    });
  } catch (error: any) {
    console.error("Update error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to update profile",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}
