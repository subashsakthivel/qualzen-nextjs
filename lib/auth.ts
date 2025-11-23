import { betterAuth } from "better-auth";
import mongodb from "./mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
export const auth = betterAuth({
    user: {
        additionalFields: {
            role: {
                type: "string",
                default: "user",
                input: false,
                required : false
            },
            username: {
                type: "string",
                input: true,
                required : false
            }
        },
     },
    
    fetchOptions: {
        onError: async (context : any) => {
            const { response } = context;
            if (response.status === 429) {
                const retryAfter = response.headers.get("X-Retry-After");
                console.log(`Rate limit exceeded. Retry after ${retryAfter} seconds`);
            }
        },
    },
    database: mongodbAdapter(mongodb.db , { client : mongodb.client , }),
    emailAndPassword: {
        enabled : true,
    },
    socialProviders: {
        google : {
            clientId : process.env.AUTH_GOOGLE_ID as string,
            clientSecret : process.env.AUTH_GOOGLE_SECRET as string,
            mapProfileToUser: (profile) => {
                console.log("profile", profile)
                return {
                ...profile,
                username: profile.name,
                };
            },
        }
    },
    rateLimit: {
        window: 10,
        max: 100,
        enabled: true,
    },
    advanced: {
        cookiePrefix: "varfeo"
    },
    cookies: {
        cookiePrefix: "varfeo"
    },
    plugins: [
        nextCookies() , // make sure this is the last plugin in the array
    ]
});