import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "./lib/authOptions";
export default withAuth(
  // `withAuth` augments your `Request` with the user's token.

  function middleware(req: NextRequest) {
    // console.log(req.nextauth.token);
    if (req.nextUrl.pathname.startsWith("/dataAPI/*") && req.method === "POST") {
      // Allow POST requests to /dataAPI/* without authentication

      return NextResponse.next();
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => token?.role === "admin",
    },
    pages: {
      signIn: "/login",
      error: "/login",
    },
    jwt: { decode: authOptions.jwt?.decode },
  }
);

const protectedPages = ["/"];

export const config = { matcher: ["/admin"] };

//export default middleware;
async function uploadMiddleware(req: NextRequest) {
  if (req.method === "POST" && req.nextUrl.pathname.startsWith("/upload")) {
    const formData = await req.formData();
    // Handle file upload logic here
    return NextResponse.json({ message: "File uploaded successfully" });
  }
  return NextResponse.next();
}
