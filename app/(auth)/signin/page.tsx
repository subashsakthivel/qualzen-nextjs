import { SignInForm } from "@/components/auth/signin-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignInPage({ callbackUrl }: { callbackUrl?: string }) {
  
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session) {
    redirect("/")
  }
  return (
    <div>
      <SignInForm callbackUrl={callbackUrl} />
    </div>
  );
}
