"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Loader2Icon, ShieldUserIcon } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { getAllMembersFn } from "@/actions/member/get-all-members";
import { toast } from "sonner";
import ErrorMessage from "../error-message";
import { useEffect } from "react";
import Member from "../member";

export default function PickModeratorsDialog({ groupId }: { groupId: string }) {
  const { inView, ref } = useInView({
    threshold: 0,
    rootMargin: "200px",
  });

  const pathname = usePathname();

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage, error } =
    useInfiniteQuery({
      queryKey: ["group-members", groupId],
      queryFn: ({ pageParam }) =>
        getAllMembersFn({
          groupId,
          cursor: pageParam,
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
    <Dialog>
      <DialogTrigger className="flex items-center gap-2 px-2 py-1 text-sm">
        <ShieldUserIcon className="size-4" />
        Pick Moderators
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Moderator</DialogTitle>
          <DialogDescription>Add a new moderator.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {/* <form>
            <Input placeholder="Search user." />
          </form> */}
          <div className="w-full space-y-3">
            {data?.pages[0].members.length === 0 && (
              <div className="flex items-center justify-center text-sm font-semibold min-h-dvh">
                No messages...
              </div>
            )}
            {data &&
              data.pages.map((page) =>
                page.members.map((member) => (
                  <Member key={member.id} member={member} />
                )),
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
      </DialogContent>
    </Dialog>
  );
}
