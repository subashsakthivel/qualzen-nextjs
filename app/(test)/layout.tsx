import SessionProviderClientComponent from "@/app/(auth)/SessionProviderClientComponent";
import { authOptions } from "@/lib/authOptions";
import { Inter } from "next/font/google";
import "../globals.css";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { GalleryVerticalEnd } from "lucide-react";
import AppConfig from "@/config/app-config";
const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en" className="h-full">
      <body>{children}</body>
    </html>
  );
}
