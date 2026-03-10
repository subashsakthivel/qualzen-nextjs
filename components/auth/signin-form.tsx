"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthProviders from "./providers";
import { AUTH_URLS } from "@/constants/url-mapper";
import { EyeOffIcon, Mail } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";

export function SignInForm({
  className,
  callbackUrl = "/",
  ...props
}: React.ComponentPropsWithoutRef<"form"> & { callbackUrl?: string }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(handleSignin, {
    message: "",
    color: "black",
  });
  async function handleSignin(prevState: { message: string; color: string }, formData: FormData) {
    let nextState = prevState;
    await authClient.signIn.email({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      callbackURL: callbackUrl,
      rememberMe: false
    }, {
      async onError(context) {
        console.log("Error", context);
        nextState = { message: "Invalid Email or Password", color: "red" };
      }
    });
    return nextState;
  }

  return (
    <form action={formAction} className={cn("flex flex-col gap-6", className)} {...props}>
      {/* <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your username or email below to login to your account
        </p>
      </div> */}
      <div className="grid gap-6">
        <AuthProviders callbackUrl={callbackUrl} />

        <div className="grid gap-6">
          <div className="relative grid gap-2">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input name="email" type="email" placeholder="Enter your Email" className="pl-10" />
          </div>
          <div className="relative grid gap-2">
            <EyeOffIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input name="password" type="password" placeholder="Enter your Password" className="pl-10" />
          </div>
          <div>
            {state.message && (
              <p className={cn("text-sm", state.color === "red" ? "text-red-700" : "text-green-700")}>
                {state.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </a>
          </div>
          <Button type="submit" className="w-full disabled:opacity-50" disabled={isPending}>
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </div>
      </div>
      {/* <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href={AUTH_URLS.SIGN_UP} className="underline underline-offset-4">
          Sign up
        </a>
      </div> */}
    </form>
  );
}
