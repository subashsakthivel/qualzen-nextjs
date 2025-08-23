"use client";
import QueryClientHook from "@/components/queryClientHook";

export default function FormLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <QueryClientHook>{children}</QueryClientHook>;
}
