import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { betterAuth } from "better-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import {db} from "./mongodb";
export const auth = betterAuth({

    database: MongoDBAdapter(db),
  
});