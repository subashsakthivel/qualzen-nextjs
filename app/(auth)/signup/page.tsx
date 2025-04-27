import Link from "next/link";
import { EyeOffIcon, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import AuthProviders from "@/components/auth/providers";

export default function NewsletterSignup() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center space-y-2 pt-6">
          {/* <div className="rounded-full bg-purple-100 p-3">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-purple-600"
            >
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div> */}
          <h2 className="text-center text-2xl font-bold">Create an Account</h2>
          <p className="text-center text-sm text-muted-foreground">
            Sign up to access exclusive deals, new arrivals, and special offers tailored just for
            you.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <AuthProviders />

          <div className="relative flex items-center">
            <Separator className="flex-1" />
            <span className="mx-2 text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input type="email" placeholder="Enter your email" className="pl-10" />
              </div>
              <div className="relative">
                <EyeOffIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground cursor-pointer" />
                <Input type="password" placeholder="Password" className="pl-10" />
              </div>
            </div>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">Sign Up</Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-6">
          <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-purple-600">
              Terms
            </Link>
            <Link href="#" className="hover:text-purple-600">
              Privacy
            </Link>
            <Link href="#" className="hover:text-purple-600">
              Help
            </Link>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            We respect your privacy. Delete an account at any time.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
