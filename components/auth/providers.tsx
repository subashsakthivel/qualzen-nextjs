"use client";

import React from "react";
import { Button } from "../ui/button";
import { FaApple, FaGoogle } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";

const AuthProviders = ({ callbackUrl }: { callbackUrl?: string }) => {

  const googleSignIn = async() => {
     await authClient.signIn.social({ provider : "google", callbackURL: callbackUrl , errorCallbackURL : "/auth/error" });
  }

  return (
    <div className="flex flex-col space-y-3">
      <Button
        type="button"
        variant="outline"
        className="flex items-center justify-center gap-2"
        onClick={googleSignIn}
      >
        <FaGoogle size={16} />
        <span>Continue with Google</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        className="flex items-center justify-center gap-2"
        // need to add onClick handler for apple sign in
      >
        <FaApple size={16} />
        <span>Continue with Apple</span>
      </Button>
    </div>
  );
};

export default AuthProviders;
