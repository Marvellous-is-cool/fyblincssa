"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  sendPasswordResetEmail?: (email: string) => Promise<void>;
  refreshToken: () => Promise<string | null>;
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
