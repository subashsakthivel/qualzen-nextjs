import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import { GoogleProfile } from "next-auth/providers/google";
import { AppleProfile } from "next-auth/providers/apple";
import clientPromise from "./mongodb";
import { Adapter } from "next-auth/adapters";
import jwt from "jsonwebtoken";
import { checkAndAddUser, getUserByEmail, verifyEmailAndPassword } from "@/utils/dbUtil";
import { userInfoObject } from "@/model/UserInfo";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
      profile(profile: GoogleProfile) {
        console.log(profile);
        return {
          ...profile,
          role: profile.role ?? "user",
          id: "dd",
          image: profile.picture,
        };
      },
    }),
    AppleProvider({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
      profile(profile: AppleProfile) {
        console.log("Apple Profile : ", profile.data);
        return {
          ...profile,
          role: profile.role ?? "user",
          id: "dd",
          image: profile.picture,
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "your-name",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "your-tough-password",
        },
        email: {
          label: "Email",
          type: "email",
          placeholder: "your-email",
        },
      },
      async authorize(credentials) {
        console.log("Credentials : ", credentials);
        const user = await getUserByEmail(credentials?.email as string);
        if (!user) {
          console.log("User not found in the database:", credentials?.email);
          return null;
        } else {
          return await verifyEmailAndPassword(credentials?.email as string);
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise) as Adapter,
  callbacks: {
    async jwt({ token, account, profile, session, user }) {
      //persist user data in token
      try {
        const userInfo = userInfoObject.parse({ ...user, token, ...profile, ...account });
        checkAndAddUser(userInfo);
      } catch (error) {
        console.error("Zod validation error:", error);
        throw error; // Rethrow the error to the parent
      }
      console.log("jwt", token, account, profile, session, user);
      if (user && account) {
        token.accessToken = account.access_token;
        //token.id = profile.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) session.user.role = token.role;
      // session.accessToken = token.accessToken;
      // session.id = token.sub;
      return session;
    },
    // redirect({ baseUrl }) {
    //   console.log("base url", baseUrl);
    //   return "/login";
    // },
  },
  jwt: {
    async encode({ secret, token }) {
      if (!token) throw new Error("Token is undefined");
      return jwt.sign(token as object, secret);
    },
    async decode({ secret, token }) {
      if (!token) throw new Error("Token is undefined");
      const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
      return {
        ...decoded,
        role: decoded.role || "user",
      };
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signup",
    error: "/signup",
  },
};
