import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

export async function POST(request: Request) {
  try {
    console.log("Processing registration via API route");
    const data = await request.json();

    // Validate required fields
    if (!data.fullName || !data.matricNumber || !data.email || !data.password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Format matric number for document ID (replace slashes with hyphens)
    const formattedMatricNumber = data.matricNumber.replace(/\//g, "-");

    // Check if a student with this matric number already exists
    const studentRef = adminDb
      .collection("students")
      .doc(formattedMatricNumber);
    const existingStudent = await studentRef.get();

    if (existingStudent.exists) {
      return NextResponse.json(
        { error: "A student with this matric number already exists" },
        { status: 400 }
      );
    }

    // Check if email already exists before trying to create an account
    try {
      const emailCheck = await adminAuth.getUserByEmail(data.email);
      if (emailCheck) {
        // Email already exists
        return NextResponse.json(
          {
            error: "Email already in use",
            message:
              "This email address is already associated with an account. Please use a different email or try logging in.",
          },
          { status: 400 }
        );
      }
    } catch (emailError: any) {
      // Error with code auth/user-not-found means the email is not in use, which is what we want
      if (emailError.code !== "auth/user-not-found") {
        console.error("Error checking email:", emailError);
      }
      // Continue with registration if email doesn't exist
    }

    // Create Firebase Auth user
    let authUser;
    try {
      // Extract password from data and remove it from student data
      const { password, confirmPassword, ...studentData } = data;

      // Create the auth user
      authUser = await adminAuth.createUser({
        email: data.email,
        password: password,
        displayName: data.fullName,
      });

      // Set custom claims to identify as student
      await adminAuth.setCustomUserClaims(authUser.uid, {
        student: true,
        matricNumber: formattedMatricNumber,
      });

      // Add timestamp and featured status to student data
      const finalStudentData = {
        ...studentData,
        uid: authUser.uid,
        createdAt: Timestamp.now(),
        featured: false,
        canEdit: true, // Students can edit their profile by default
      };

      // Save the student with the formatted matric number as ID
      await studentRef.set(finalStudentData);

      // Return success with document ID
      return NextResponse.json({
        success: true,
        id: formattedMatricNumber,
        uid: authUser.uid,
        message: "Registration successful!",
      });
    } catch (authError: any) {
      // Handle Firebase Auth errors
      console.error("Auth creation error:", authError);

      // Email already exists
      if (authError.code === "auth/email-already-exists") {
        return NextResponse.json(
          {
            error: "Email already in use",
            message:
              "This email address is already associated with an account. Please use a different email or try logging in.",
          },
          { status: 400 }
        );
      }

      // Invalid email
      if (authError.code === "auth/invalid-email") {
        return NextResponse.json(
          { error: "Please provide a valid email address." },
          { status: 400 }
        );
      }

      // Weak password
      if (authError.code === "auth/weak-password") {
        return NextResponse.json(
          { error: "Password is too weak. Please use a stronger password." },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: "Error creating user account: " + authError.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in registration API:", error);
    return NextResponse.json(
      {
        error: error.message || "Error registering student",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
