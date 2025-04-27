// import { withA as middleware } from "@/auth";
// //import {} from "next-auth/middleware";
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "./lib/authOptions";
// import { withAuth as middleware } from "next-auth/middleware";
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
// middleware((req) => {
//   console.log("requset");
//   const isProtectedPage = protectedPages.reduce(
//     (acc, curr) => !acc || curr.includes(req.nextUrl.pathname),
//     false
//   );
//   console.log("auth", req.auth);
//   if (!req.auth && req.nextUrl.pathname !== "/login" && isProtectedPage) {
//     const newUrl = new URL("/login", req.nextUrl.origin);
//     return Response.redirect(newUrl);
//   }
// });

const protectedPages = ["/"];

export const config = { matcher: ["/admin"] };

//export default middleware;
