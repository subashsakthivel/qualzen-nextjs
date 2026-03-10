import { SignUpForm } from "@/components/auth/signup-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;



  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session) {
    redirect("/")
  }

  return (
    <div>
      <SignUpForm callbackUrl={callbackUrl} />
    </div>
  );
}
