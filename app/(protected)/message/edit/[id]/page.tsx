import EditMessage from "@/components/group/messages/edit-message";
import { ensureUserCreated } from "@/lib/db/function";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function page({ params }: Props) {
  const { id } = await params;

  await ensureUserCreated();

  return (
    <div>
      <EditMessage messageId={id} />
    </div>
  );
}
