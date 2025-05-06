import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import InteractiveBackground from "@/components/InteractiveBackground";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personality of the Week | FYB",
  description: "Final Year Personality of the Week",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans min-h-screen bg-black text-white">
        <AuthProvider>
          <InteractiveBackground />
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#000",
                color: "#FFD700",
                border: "1px solid #FFD700",
                padding: "16px",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
