"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import Message from "./message";
import { getGroupMessagesFn } from "@/actions/message/get-group-messages";
import { toast } from "sonner";
import ErrorMessage from "@/components/error-message";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Loader2Icon } from "lucide-react";

interface Props {
  permissions: {
    status: boolean;
  };
  groupId: string;
}

export default function Messages({ groupId, permissions }: Props) {
  const { inView, ref } = useInView({
    threshold: 0,
    rootMargin: "200px",
  });

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage, error } =
    useInfiniteQuery({
      queryKey: ["group-messages", groupId],
      queryFn: ({ pageParam }) =>
        getGroupMessagesFn({ groupId, cursor: pageParam }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, isFetchingNextPage]);

  if (error) {
    toast.error("Error", {
      description: error.message,
    });
    return <ErrorMessage message={error.message} />;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="bg-white w-full mx-auto rounded-lg">
        {data &&
          data.pages.map((page) =>
            page.messages.map((message) => (
              <Message
                key={message.id}
                message={message}
                permissions={permissions.status}
              />
            )),
          )}
      </div>
      <div ref={ref}>
        {isFetchingNextPage && (
          <div className="flex items-center gap-1 text-sm tracking-tight">
            <Loader2Icon className="animate-spin" />
            <span>Loading more...</span>
          </div>
        )}
      </div>
    </div>
  );
}
