"use client";

import { useQuery } from "@tanstack/react-query";
import { getGroupFn } from "@/actions/group/get-group";
import GroupContentHeader from "./group-content-header";
import CreateMessage from "./create-message";
import Messages from "./messages/messages";
import { toast } from "sonner";
import { hasPermissionFn } from "@/actions/member/has-permissions";
import ErrorMessage from "../error-message";

export default function GroupContent({ id }: { id: string }) {
  const groupInfo = useQuery({
    queryKey: ["group", id],
    queryFn: () => getGroupFn(id),
  });

  if (groupInfo.isLoading) {
    return <div>Loading...</div>;
  }

  if (groupInfo?.error) {
    toast.info("Info", {
      description: groupInfo.error?.message,
    });

    return <ErrorMessage message={groupInfo.error?.message} />;
  }

  return (
    <main>
      {groupInfo?.data && <GroupContentHeader data={groupInfo?.data} />}
      <CreateMessage groupId={id} />
      <section className="bg-c-bg p-5 min-h-dvh">
        <Messages groupId={id} />
      </section>
    </main>
  );
}
