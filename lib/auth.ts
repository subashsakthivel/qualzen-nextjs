import { betterAuth } from "better-auth";
import mongodb from "./mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { twoFactor } from "better-auth/plugins";
export const auth = betterAuth({
    appName: "Qualzen",
    user: {
        additionalFields: {
            role: {
                type: ["user", "admin"],
                default: "user",
                input: false,
                required: true
            }
        },
    },
    fetchOptions: {
        onError: async (context: any) => {
            const { response } = context;
            if (response.status === 429) {
                const retryAfter = response.headers.get("X-Retry-After");
                console.log(`Rate limit exceeded. Retry after ${retryAfter} seconds`);
            }
        },
    },
    database: mongodbAdapter(mongodb.db, { client: mongodb.client, }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true
    },
    socialProviders: {
        google: {
            clientId: process.env.AUTH_GOOGLE_ID as string,
            clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
            accessType: "offline",
            prompt: "select_account consent",
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
        storage: "database",
        window: 10,
        max: 100,
        customRules: {
            "/signin/email": {
                window: 10,
                max: 3,
            },
            "/two-factor": async (request) => {
                // custom function to return rate limit window and max
                return {
                    window: 10,
                    max: 3,
                }
            }
        },
        enabled: true,
    },
    advanced: {
        cookiePrefix: "varfeo"
    },
    cookies: {
        cookiePrefix: "varfeo"
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // default: 7 days (in seconds)
        updateAge: 60 * 60 * 24,      // update session every 24 hours
    },
    hooks: {
        async after(inputContext) {

        },
    },
    plugins: [
        twoFactor(),
        nextCookies(), // make sure this is the last plugin in the array
    ]
});

type Session = typeof auth.$Infer.Session