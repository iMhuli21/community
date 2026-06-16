import SignIn from "@/components/auth/sign-in";
import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const { data: session } = await auth.getSession();

  if (session) {
    return redirect("/home");
  }
  return (
    <main className="bg-c-bg min-h-dvh flex items-center justify-center">
      <SignIn />
    </main>
  );
}
