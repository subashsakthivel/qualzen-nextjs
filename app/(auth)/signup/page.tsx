import { SignUpForm } from "@/components/auth/signup-form";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  console.log("callbackurl", callbackUrl);
  return (
    <div>
      <SignUpForm callbackUrl={callbackUrl} />
    </div>
  );
}
