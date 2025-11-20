"use client";
import React from "react";

interface ErrorProps {
  error?: { message: string };
  reset?: () => void;
}

const ErrorPage: React.FC<ErrorProps> = ({
  error = { message: "" },
  reset = () => {},
}: ErrorProps) => {
  // todo : reset should referesh page
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Something went wrong!</h1>
      <p className="mt-4">{error.message}</p>
      <button onClick={() => reset()} className="mt-6 px-4 py-2 bg-blue-500 text-white rounded">
        Try Again
      </button>
    </div>
  );
};

export default ErrorPage;
