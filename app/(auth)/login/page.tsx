import { SignInForm } from "@/components/auth/signin-form";
// import Image from "next/image";

export default function LoginPage({ callbackUrl }: { callbackUrl?: string }) {
  console.log("LoginPage callbackUrl:", callbackUrl);
  return (
    <div>
      <SignInForm callbackUrl={callbackUrl} />
    </div>
  );
}
