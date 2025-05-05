import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "./lib/authOptions";
export default withAuth(
  // `withAuth` augments your `Request` with the user's token.

  function middleware(req) {
    // console.log(req.nextauth.token);
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
