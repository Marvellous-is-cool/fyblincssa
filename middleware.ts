import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is an admin route (but not login/register)
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    !pathname.startsWith("/admin/register")
  ) {
    // Get the authorization token from cookies or headers
    const token =
      request.cookies.get("firebase-token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      // Redirect to admin login if no token
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      // Verify admin privileges via our API
      const verifyResponse = await fetch(
        new URL("/api/admin/verify", request.url),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );

      if (!verifyResponse.ok) {
        // Redirect to admin login if verification fails
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }

      // If verification passes, continue to the route
    } catch (error) {
      console.error("Middleware admin verification error:", error);
      // Redirect to admin login on error
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Continue to the next middleware or route handler
  return NextResponse.next();
}

// Configure the matcher to exclude API routes from middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
