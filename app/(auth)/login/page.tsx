import { GalleryVerticalEnd } from "lucide-react";
import AppConfig from "@/config/app-config";
import { LoginForm } from "@/components/login-form";
import { SignInForm } from "@/components/auth/signin-form";
// import Image from "next/image";

export default function LoginPage() {
  return (
    <div>
      <SignInForm />
    </div>
  );
}
