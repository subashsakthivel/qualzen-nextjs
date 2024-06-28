import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { GoogleProfile } from "next-auth/providers/google";
import clientPromise from "./mongodb";
import { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile: GoogleProfile) {
        console.log(profile);
        return {
          ...profile,
          role: profile.role ?? "user",
          id: profile.id.toString(),
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
      },
      async authorize(credentials) {
        console.log("Credentials : ", credentials);
        const user = {
          id: "2",
          name: "emaple",
          password: "nextauth",
          role: "user",
        };
        console.log(credentials);
        if (
          credentials?.username === user.name &&
          credentials?.password === user.password
        ) {
          return user;
        }
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise) as Adapter,
  callbacks: {
    async jwt({ token, account, profile, session, user }) {
      if (user && account) {
        console.log("token", token);
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
    redirect({ baseUrl }) {
      console.log("base url", baseUrl);
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
  },
};
