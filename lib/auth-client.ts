import { createAuthClient } from "better-auth/react";
import { nextCookies } from "better-auth/next-js";
import { twoFactorClient } from "better-auth/plugins";
export const authClient = createAuthClient({
  baseURL: process.env.BASE_URL!, // Optional if the API base URL matches the frontend
  plugins: [
    twoFactorClient(),
    nextCookies(), // make sure this is the last plugin in the array
  ]
});

export const { signIn, signOut, useSession } = authClient;
