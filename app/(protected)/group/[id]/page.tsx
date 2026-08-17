import GroupContent from "@/components/group/group-content";
import { ensureUserCreated } from "@/lib/db/function";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function page({ params }: Props) {
  const { id } = await params;

  await ensureUserCreated();

  return <GroupContent id={id} />;
}
