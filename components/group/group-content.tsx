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
  const hasPermissions = useQuery({
    queryKey: ["permissions", id],
    queryFn: () => hasPermissionFn(id),
  });

  if (groupInfo.isLoading) {
    return <div>Loading...</div>;
  }

  if (groupInfo?.error || hasPermissions?.error) {
    toast.info("Info", {
      description: groupInfo.error?.message || hasPermissions.error?.message,
    });

    return (
      <ErrorMessage
        message={groupInfo.error?.message || hasPermissions.error?.message}
      />
    );
  }

  return (
    <main>
      {groupInfo?.data && <GroupContentHeader data={groupInfo?.data} />}
      <CreateMessage groupId={id} />
      <section className="bg-c-bg p-5">
        {hasPermissions?.data && (
          <Messages groupId={id} permissions={hasPermissions.data} />
        )}
      </section>
    </main>
  );
}
