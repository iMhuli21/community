import CreateGroupForm from "@/components/group/create-group-form";
import { auth } from "@/lib/auth/server";
import { ensureUserCreated } from "@/lib/db/function";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function page() {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return redirect(`${encodeURIComponent("/sign-in")}`);
  }

  return (
    <div>
      <CreateGroupForm />
    </div>
  );
}
