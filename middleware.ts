// import { withA as middleware } from "@/auth";
// //import {} from "next-auth/middleware";
import { withAuth } from "next-auth/middleware";
import { pages } from "next/dist/build/templates/app-page";
import { NextRequest, NextResponse } from "next/server";
// import { withAuth as middleware } from "next-auth/middleware";
export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    console.log("middleware page");

    console.log(req.nextauth);
    console.log(req.nextauth.token);
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        console.log("authorized ", token);
        return token?.role === "admin";
      },
    },
    pages: {
      signIn: "/login",
    },
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
export function middleware(request: NextRequest) {
  console.log("middleware function");
  // Redirect to login page if not authenticated
  return NextResponse.next();
}
const protectedPages = ["/"];
export const config = { matcher: ["/jdi"] };

//export default middleware;
