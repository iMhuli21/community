"use client";

import { toast } from "sonner";
import Messages from "./messages/messages";
import ErrorMessage from "../error-message";
import { useQuery } from "@tanstack/react-query";
import { getGroupFn } from "@/actions/group/get-group";
import GroupContentHeader from "./group-content-header";
import { useSearchParams } from "next/navigation";
import Polls from "./messages/polls/polls";

export default function GroupContent({ id }: { id: string }) {
  const searchParams = useSearchParams();

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
      <section className="bg-c-bg min-h-dvh">
        {!searchParams.get("filter") ? (
          <Messages groupId={id} />
        ) : searchParams.get("filter") === "polls" ? (
          <Polls groupId={id} />
        ) : (
          searchParams.get("filter") && <Messages groupId={id} />
        )}
      </section>
    </main>
  );
}
