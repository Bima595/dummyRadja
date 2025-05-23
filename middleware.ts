import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Get the token from the cookies
  const isAuthenticated = request.cookies.has("currentUser")

  // Only protect dashboard routes
  if (path.startsWith("/dashboard") && !isAuthenticated) {
    // Redirect to login page if trying to access a protected route without being authenticated
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

// Only run middleware on dashboard routes, not on the root route
export const config = {
  matcher: ["/dashboard/:path*"],
}
