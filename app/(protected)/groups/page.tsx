import GroupsContent from "@/components/group/groups-content";
import { auth } from "@/lib/auth/server";
import { ensureUserCreated } from "@/lib/db/function";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function page() {
  const { data: session } = await auth.getSession();

  if (!session?.user.id) {
    redirect("/sign-in");
  }

  await ensureUserCreated();

  return <GroupsContent userName={session.user.name.split(" ")[0]} />;
}
