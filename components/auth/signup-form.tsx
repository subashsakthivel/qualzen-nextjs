"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthProviders from "./providers";
import { EyeOffIcon, Mail, User } from "lucide-react";
import { AUTH_URLS } from "@/constants/url-mapper";
import { authClient } from "@/lib/auth-client";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import z, { ZodError } from "zod";
import { passwordSchema } from "@/schema/zod-schema";

const userSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.email("Invalid email address"),
  password: passwordSchema,
});

export function SignUpForm({
  className,
  callbackUrl = "/",
  ...props
}: React.ComponentPropsWithoutRef<"form"> & { callbackUrl?: string }) {
  const [state, formAction, isPending] = useActionState(handleSignUp, {
    message: "",
    color: "",
  });
  const router = useRouter();

  async function handleSignUp(prevState: { message: string | ZodError; color: string }, formdata: FormData) {
    let nextState = prevState;
    const formValues = {
      name: formdata.get("name") as string,
      email: formdata.get("email") as string,
      password: formdata.get("password") as string,
    }
    const formValidation = userSchema.safeParse(formValues);
    if (!formValidation.success) {
      nextState = { message: formValidation.error, color: "red" };
      return nextState;
    }
    await authClient.signUp.email({
      callbackURL: callbackUrl,
      ...formValues,
    }, {
      async onError(context) {
        console.log("Error", context);
        nextState = { message: context.error.message, color: "red" };
      },
      async onSuccess(context) {
        router.push(callbackUrl);
      }
    });
    return nextState;
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} action={formAction}>
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
          <Input type="text" name="name" placeholder="Enter your name" className="pl-10" />
        </div>
        <div className="relative grid gap-2">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input type="email" name="email" placeholder="Enter your email" className="pl-10" />
        </div>
        <div className=" grid gap-2">
          <div className="relative">
            <EyeOffIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground cursor-pointer" />
            <Input type="password" name="password" placeholder="Password" className="pl-10" />
          </div>
        </div>
        <div>
          {state.message && (
            <div className={cn("text-sm ", state.color === "red" ? "text-red-600" : "text-green-700")}>
              !{typeof state.message === "string" ? <p>{state.message}</p> : <div>
                {state.message.issues.map((issue, index) => (
                  <p key={index}>{issue.message}</p>
                ))}
              </div>}
            </div>
          )}
        </div>
        <Button type="submit" className="w-full disabled:opacity-50" disabled={isPending}>
          {isPending ? "Creating Account..." : "Create an Account"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href={AUTH_URLS.SIGN_IN} className="underline underline-offset-4">
          Sign In
        </a>
      </div>
    </form>
  );
}
