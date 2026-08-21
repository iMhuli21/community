"use client";

import ErrorMessage from "@/components/error-message";
import CreatePollDialog from "./create-poll-dialog";
import { useQuery } from "@tanstack/react-query";
import { getGroupPollsFn } from "@/actions/polls/get-group-polls";
import Poll from "./poll";
import { hasPermissionFn } from "@/actions/member/has-permissions";

export default function Polls({ groupId }: { groupId: string }) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["polls", groupId],
    queryFn: () => getGroupPollsFn(groupId),
  });
  const hasPermissions = useQuery({
    queryKey: ["permissions", groupId],
    queryFn: () => hasPermissionFn(groupId),
    enabled: Boolean(groupId),
  });

  if (error || hasPermissions.error) {
    <ErrorMessage message={error?.message || hasPermissions.error?.message} />;
  }

  if (isLoading || hasPermissions.isLoading) {
    <div>Loading...</div>;
  }

  return (
    <div className="min-h-dvh p-5 bg-c-bg space-y-3">
      {hasPermissions?.data?.status && (
        <div className="flex justify-end w-full">
          <CreatePollDialog groupId={groupId} />
        </div>
      )}
      <div className="bg-white w-full mx-auto rounded-lg">
        {data && data.map((poll) => <Poll key={poll.id} poll={poll} />)}
      </div>
    </div>
  );
}
