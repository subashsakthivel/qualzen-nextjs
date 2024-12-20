import SessionProviderClientComponent from "@/components/SessionProviderClientComponent";
import { authOptions } from "@/lib/authOptions";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Login",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <SessionProviderClientComponent session={session}>
      {children}
    </SessionProviderClientComponent>
  );
}
