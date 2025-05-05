import Link from "next/link";
import { EyeOffIcon, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import AuthProviders from "@/components/auth/providers";
import { SignUpForm } from "@/components/auth/signup-form";
import { SignInForm } from "@/components/auth/signin-form";

export default function NewsletterSignup() {
  return (
    <div>
      <SignUpForm />
    </div>
  );
}
