"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthProviders from "./providers";
import { AUTH_URLS } from "@/constants/url-mapper";
import { Mail } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function SignInForm({
  className,
  callbackUrl,
  ...props
}: React.ComponentPropsWithoutRef<"form"> & { callbackUrl?: string }) {
  const router = useRouter();

  async function handleSignin(formdata: FormData) {
    await authClient.signIn.email({
      email: formdata.get("email") as string,
      password: formdata.get("password") as string,
    }, {
      async onSuccess(context) {
        if (context.data.twoFactorRedirect) {
          router.push("/two-factor");
        } else {
          router.push("/");
        }
      }
    });
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      {/* <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your username or email below to login to your account
        </p>
      </div> */}
      <div className="grid gap-6">
        <AuthProviders callbackUrl={callbackUrl} />

        <form action={handleSignin}>
          <div className="relative grid gap-2">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input type="email" placeholder="Enter your Email" className="pl-10" />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                Forgot your password?
              </a>
            </div>
            <Input id="password" type="password" />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
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
