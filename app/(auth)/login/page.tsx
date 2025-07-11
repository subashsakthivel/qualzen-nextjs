import { SignInForm } from "@/components/auth/signin-form";
// import Image from "next/image";

export default function LoginPage({ callbackUrl }: { callbackUrl?: string }) {
  console.log("LoginPage callbackUrl:", callbackUrl);
  console.log("podann");
  return (
    <div>
      <SignInForm callbackUrl={callbackUrl} />
    </div>
  );
}
