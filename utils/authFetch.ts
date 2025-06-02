/**
 * Utility function to make authenticated fetch requests that handle token refresh
 */
import { User } from "firebase/auth";

type FetchOptions = RequestInit & {
  skipAuth?: boolean; // Skip authentication for development or public endpoints
};

/**
 * Make an authenticated API request with automatic token refresh
 */
export async function authFetch(
  url: string,
  options: FetchOptions = {},
  user: User | null = null,
  refreshTokenFn?: () => Promise<string | null>
): Promise<Response> {
  const { skipAuth = false, ...fetchOptions } = options;

  // Prepare headers
  const headers = new Headers(fetchOptions.headers);

  // Add content-type if not specified
  if (
    !headers.has("Content-Type") &&
    !options.body?.toString().includes("FormData")
  ) {
    headers.set("Content-Type", "application/json");
  }

  // Add authentication if user is available and authentication is not skipped
  if (user && !skipAuth) {
    try {
      // Try to get a fresh token if refresh function is provided
      let token = null;
      if (refreshTokenFn) {
        token = await refreshTokenFn();
      } else {
        // Fall back to regular token if no refresh function
        token = await user.getIdToken();
      }

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        console.log("Using authenticated request with token");
      } else {
        console.warn("Failed to get auth token for request");
      }
    } catch (error) {
      console.error("Error getting auth token:", error);
    }
  }

  // Make the request with the prepared headers
  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  // Handle 401 unauthorized errors (could add auto retry logic here)
  if (response.status === 401) {
    console.warn("401 Unauthorized response - token may be expired");
  }

  return response;
}

/**
 * Create a wrapper around authFetch that uses the current user and refresh function
 */
export function createAuthFetchWithUser(
  user: User | null,
  refreshTokenFn?: () => Promise<string | null>
) {
  return (url: string, options: FetchOptions = {}) =>
    authFetch(url, options, user, refreshTokenFn);
}
