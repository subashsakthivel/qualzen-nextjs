"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthProviders from "./providers";
import { EyeOffIcon, Mail, User } from "lucide-react";
import { AUTH_URLS } from "@/constants/url-mapper";
import { signIn } from "next-auth/react";

export function SignUpForm({
  className,
  callbackUrl,
  ...props
}: React.ComponentPropsWithoutRef<"form"> & { callbackUrl?: string }) {
  async function handleSubmit(formdata: FormData) {
    const response = await signIn("credentials", {
      username: formdata.get("username"),
      email: formdata.get("email"),
      password: formdata.get("password"),
    });
    if (response?.error) {
      console.error("Error signing up:", response.error); // Handle error
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} action={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
      </div>
      <div className="grid gap-6">
        <AuthProviders callbackUrl={callbackUrl} />
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <div className="relative grid gap-2">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input type="text" placeholder="Enter your username" className="pl-10" />
        </div>
        <div className="relative grid gap-2">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input type="email" placeholder="Enter your email" className="pl-10" />
        </div>
        <div className=" grid gap-2">
          <div className="relative">
            <EyeOffIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground cursor-pointer" />
            <Input type="password" placeholder="Password" className="pl-10" />
          </div>
        </div>
        <Button type="submit" className="w-full">
          Create an Account
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href={AUTH_URLS.SIGN_IN} className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  );
}
