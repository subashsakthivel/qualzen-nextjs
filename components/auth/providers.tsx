"use client";

import React from "react";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { FaApple, FaGoogle } from "react-icons/fa";

const AuthProviders = ({ callbackUrl = "/" }: { callbackUrl?: string }) => {
  return (
    <div className="flex flex-col space-y-3">
      <Button
        type="button"
        variant="outline"
        className="flex items-center justify-center gap-2"
        onClick={() => signIn("google", { callbackUrl })}
      >
        <FaGoogle size={16} />
        <span>Continue with Google</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        className="flex items-center justify-center gap-2"
        onClick={() => signIn("apple", { callbackUrl })}
      >
        <FaApple size={16} />
        <span>Continue with Apple</span>
      </Button>
    </div>
  );
};

export default AuthProviders;
