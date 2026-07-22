"use client";

import { useQuery } from "@tanstack/react-query";
import { getGroupFn } from "@/actions/group/get-group";
import GroupContentHeader from "./group-content-header";
import CreateMessage from "./create-message";
import Messages from "./messages/messages";
import { toast } from "sonner";

export default function GroupContent({ id }: { id: string }) {
  const {
    data: groupInfo,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["group", id],
    queryFn: () => getGroupFn(id),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (groupInfo?.error) {
    toast.info("Info", {
      description: groupInfo.error,
    });

    return (
      <div className="flex items-center justify-center min-h-dvh tracking-tight font-medium">
        {groupInfo.error}
      </div>
    );
  }

  return (
    <main>
      {groupInfo?.data && <GroupContentHeader data={groupInfo} />}
      <CreateMessage groupId={id} />
      <section className="bg-c-bg p-5">
        <Messages groupId={id} />
      </section>
    </main>
  );
}
