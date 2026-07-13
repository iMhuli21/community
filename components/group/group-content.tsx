"use client";

import { useQuery } from "@tanstack/react-query";
import { getGroupFn } from "@/actions/group/get-group";
import GroupContentHeader from "./group-content-header";
import CreateMessage from "./create-message";
import Messages from "./messages";

export default function GroupContent({ id }: { id: string }) {
  const { data: groupInfo, isLoading } = useQuery({
    queryKey: ["group", id],
    queryFn: () => getGroupFn(id),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <main>
      {groupInfo?.data && <GroupContentHeader data={groupInfo} />}
      <CreateMessage />
      <section className="bg-c-bg p-5">
        <Messages />
      </section>
    </main>
  );
}
