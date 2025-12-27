import { Header } from "@/components/Header";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <header className="">
        <Header />
      </header>
      <main className="max-w-full ">{children}</main>
    </div>
  );
}
