"use client";

import { useQuery } from "@tanstack/react-query";
import Message from "./message";
import { getGroupMessagesFn } from "@/actions/message/get-group-messages";
import { toast } from "sonner";

export default function Messages({ groupId }: { groupId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["group-messages", groupId],
    queryFn: () => getGroupMessagesFn(groupId),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center font-medium tracking-tight min-h-dvh">
        Loading...
      </div>
    );
  }

  if (data?.error) {
    toast.error("Error", {
      description: data.error,
    });
    return (
      <div className="flex items-center justify-center font-medium tracking-tight min-h-dvh">
        {data.error}
      </div>
    );
  }

  return (
    <div className="bg-white w-full mx-auto rounded-lg">
      {data?.messages &&
        data.messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
    </div>
  );
}
