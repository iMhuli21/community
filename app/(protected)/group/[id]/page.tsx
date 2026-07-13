import GroupContent from "@/components/group/group-content";
import { auth } from "@/lib/auth/server";
import { ensureUserCreated } from "@/lib/db/function";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function page({ params }: Props) {
  const { id } = await params;

  return <GroupContent id={id} />;
}
