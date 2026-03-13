import { createAuthClient } from "better-auth/react";
import { nextCookies } from "better-auth/next-js";
import { inferAdditionalFields, twoFactorClient } from "better-auth/client/plugins";
import { auth } from "./auth";
export const authClient = createAuthClient({
  baseURL: process.env.BASE_URL!, // Optional if the API base URL matches the frontend
  plugins: [
    inferAdditionalFields<typeof auth>(),
    twoFactorClient({
      onTwoFactorRedirect() {
        window.location.href = "/two-factor" // Handle the 2FA verification redirect
      }
    }),
    nextCookies(), // make sure this is the last plugin in the array
  ]
});

export const { signIn, signOut, useSession } = authClient;
