import { SignInForm } from "@/components/auth/signin-form";
// import Image from "next/image";

export default function SignInPage({ callbackUrl }: { callbackUrl?: string }) {
  return (
    <div>
      <SignInForm callbackUrl={callbackUrl} />
    </div>
  );
}
