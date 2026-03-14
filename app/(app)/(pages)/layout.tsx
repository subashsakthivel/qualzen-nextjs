import { Header } from "@/components/header";
import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession();

  return (
    <>{session ? <div>
      <header className="">
        <Header />
      </header>
      <main className="max-w-full ">{children}</main>
    </div> : <div><Link href="/signin">Sign In</Link></div>}</>
  );
}
