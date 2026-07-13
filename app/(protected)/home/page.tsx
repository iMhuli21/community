import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { ensureUserCreated } from "@/lib/db/function";
import HomeContent from "@/components/home/home-content";

export const dynamic = "force-dynamic";

export default async function page() {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    redirect(`${encodeURIComponent("/sign-in")}`);
  }

  await ensureUserCreated();

  return <HomeContent userName={session.user.name.split(" ")[0]} />;
}
