import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import { GoogleProfile } from "next-auth/providers/google";
import { AppleProfile } from "next-auth/providers/apple";
import clientPromise from "./mongodb";
import { Adapter } from "next-auth/adapters";
import { getUserByEmail, verifyEmailAndPassword } from "@/util/dbUtil";
import { UserInfoModel, UserInfoSchema, UserInfo } from "@/model/UserInfo";
import { CommonUtil } from "@/util/util";
import dbConnect from "./mongoose";
import { InvalidInputError } from "@/constants/erros";

async function checkAndAddUser(user: UserInfo) {
  await dbConnect();
  const existingUser = await UserInfoModel.findOne({ email: user.email });
  if (existingUser) {
    console.log("User already exists in the database:", existingUser);
  } else {
    await UserInfoModel.create(user);
    console.log("User added to the database:", user);
  }
}
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      profile(profile: GoogleProfile) {
        return {
          ...profile,
          id: profile.sub,
          role: "user",
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
    async jwt({ token, account, profile, session, user, trigger }) {
      //persist user data in token
      console.log("trigger", trigger);

      if (trigger === "signUp" || trigger === "update" || trigger === "signIn") {
        console.warn("jwt token", token, account, profile, session, user, trigger);
        const userObj = CommonUtil.filterObjectByType(
          { ...token, ...account, ...profile, ...session, ...user },
          Object.keys(UserInfoSchema.shape)
        );
        console.log("userObj", userObj);
        const { data, error, success } = UserInfoSchema.safeParse(userObj);
        if (error) {
          console.error("Zod validation error:", error);
          throw new InvalidInputError(error);
        } else {
          console.log("User data is valid:", data);
          checkAndAddUser(data as UserInfo);
        }
      }
      if (user && account) {
        token.accessToken = account.access_token;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session?.user) session.user.role = token.role;
      return session;
    },
    redirect({ baseUrl }) {
      return baseUrl + "/private";
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
