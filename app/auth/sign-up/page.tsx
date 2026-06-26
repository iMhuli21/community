import SignUp from "@/components/auth/sign-up";
import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  const { data: session } = await auth.getSession();

  if (session?.user) {
    return redirect("/home");
  }

  return (
    <main className="bg-c-bg min-h-dvh flex items-center justify-center">
      <SignUp />
    </main>
  );
}
