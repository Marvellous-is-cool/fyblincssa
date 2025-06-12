"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  sendPasswordResetEmail?: (email: string) => Promise<void>;
  refreshToken: () => Promise<string | null>;
  checkUserRole: (uid: string) => Promise<string | null>;
  signInAdmin: (email: string, password: string) => Promise<void>;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signOut: async () => {},
  signUp: async () => {},
  refreshToken: async () => null,
  checkUserRole: async () => null,
  signInAdmin: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      console.error("Error signing in:", error);
      // Type guard to check if error is an object with a message property
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred during sign in");
      }
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Clear the firebase token cookie
      document.cookie = 'firebase-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      await firebaseSignOut(auth);
    } catch (error: unknown) {
      console.error("Error signing out:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred during sign out");
      }
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      // Use the imported createUserWithEmailAndPassword function
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      console.error("Error signing up:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred during sign up");
      }
      throw error;
    }
  };

  const refreshToken = async () => {
    if (user) {
      try {
        const token = await user.getIdToken(true);
        console.log("Token refreshed successfully");
        return token;
      } catch (error) {
        console.error("Failed to refresh token:", error);
        return null;
      }
    }
    return null;
  };

  const checkUserRole = async (uid: string): Promise<string | null> => {
    try {
      // Check admins collection first
      const adminDoc = await getDoc(doc(db, "admins", uid));
      if (adminDoc.exists()) {
        const data = adminDoc.data();
        return data?.role || null;
      }

      // Check students collection if not found in admins
      const studentDoc = await getDoc(doc(db, "students", uid));
      if (studentDoc.exists()) {
        const data = studentDoc.data();
        return data?.role || "student"; // Default to student if no role field
      }

      return null;
    } catch (error) {
      console.error("Error checking user role:", error);
      return null;
    }
  };

  const signInAdmin = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if user has admin role
      const userRole = await checkUserRole(user.uid);
      
      if (userRole !== "admin") {
        // Sign out the user immediately
        await firebaseSignOut(auth);
        throw new Error("Access denied. Admin privileges required.");
      }
      
      // Get the Firebase token and store it in a cookie for middleware
      const token = await user.getIdToken();
      document.cookie = `firebase-token=${token}; path=/; max-age=${60 * 60 * 24}; secure; samesite=strict`;
      
      // If we get here, the user is a valid admin
      console.log("Admin login successful");
    } catch (error: unknown) {
      console.error("Error in admin sign in:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred during admin sign in");
      }
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      const tokenRefreshInterval = setInterval(async () => {
        try {
          await user.getIdToken(true);
          console.log("Token refreshed in background");
        } catch (error) {
          console.error("Background token refresh failed:", error);
        }
      }, 30 * 60 * 1000); // 30 minutes

      return () => clearInterval(tokenRefreshInterval);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signOut,
        signUp,
        refreshToken,
        checkUserRole,
        signInAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
