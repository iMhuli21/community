"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import Message from "./message";
import { getGroupMessagesFn } from "@/actions/message/get-group-messages";
import { toast } from "sonner";
import ErrorMessage from "@/components/error-message";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Loader2Icon } from "lucide-react";
import CreateMessage from "../create-message";
import { useSearchParams } from "next/navigation";

interface Props {
  groupId: string;
}

export default function Messages({ groupId }: Props) {
  const { inView, ref } = useInView({
    threshold: 0,
    rootMargin: "200px",
  });

  const searchParams = useSearchParams();

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage, error } =
    useInfiniteQuery({
      queryKey: ["group-messages", groupId, searchParams.get("filter")],
      queryFn: ({ pageParam }) =>
        getGroupMessagesFn({
          groupId,
          cursor: pageParam,
          filter: searchParams.get("filter"),
        }),
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
    <div>
      <CreateMessage groupId={groupId} />
      <div className="flex flex-col items-center justify-center gap-3 p-5">
        <div className="bg-white w-full mx-auto rounded-lg">
          {data &&
            data.pages.map((page) =>
              page.messages.map((message) => (
                <Message key={message.id} message={message} />
              )),
            )}
        </div>
        {data?.pages[0].messages.length === 0 && (
          <div className="flex items-center justify-center text-sm font-semibold min-h-dvh">
            No messages...
          </div>
        )}
        <div ref={ref}>
          {isFetchingNextPage && (
            <div className="flex items-center gap-1 text-sm tracking-tight">
              <Loader2Icon className="animate-spin" />
              <span>Loading more...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
