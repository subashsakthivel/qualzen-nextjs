"use client";

import React from "react";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { FaApple, FaGoogle } from "react-icons/fa";

const AuthProviders = () => {
  return (
    <div className="flex flex-col space-y-3">
      <Button
        variant="outline"
        className="flex items-center justify-center gap-2"
        onClick={() => signIn("google")}
      >
        <FaGoogle size={16} />
        <span>Continue with Google</span>
      </Button>
      <Button
        variant="outline"
        className="flex items-center justify-center gap-2"
        onClick={() => signIn("apple")}
      >
        <FaApple size={16} />
        <span>Continue with Apple</span>
      </Button>
    </div>
  );
};

export default AuthProviders;
