"use client";

import { format } from "date-fns";
import { toDate, truncateWord } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import CommentDropdown from "./comment-dropdown";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth/auth-client";

interface Props {
  comment: {
    id: string;
    body: string;
    createdAt: Date;
    memberId: string;
    messageId: string;
    member: {
      name: string;
      status: "Mod" | "Admin" | "Member";
      userId: string;
    } | null;
    likes?: {
      id: string;
      createdAt: Date;
      memberId: string;
      commentId: string;
      member: {
        userId: string;
      } | null;
    }[];
  };
  groupId?: string;
}

export default function Comment({ comment, groupId }: Props) {
  const { data } = useQuery({
    queryKey: ["client-auth"],
    queryFn: () => authClient.getSession(),
  });

  return (
    <div className="w-full flex flex-col items-start gap-2 border-b border-line p-2">
      <div className="flex items-center justify-between gap-5 w-full">
        <div className="flex items-center gap-2 w-full">
          <Avatar>
            <AvatarFallback className="text-xs">
              {truncateWord(comment?.member?.name ?? "")}
            </AvatarFallback>
          </Avatar>
          <span className="font-semibold text-sm">{comment?.member?.name}</span>

          <Badge className="rounded-sm h-5 pointer-events-none" size={"xs"}>
            {comment?.member?.status}
          </Badge>
        </div>
        {/*dropdown */}
        {data?.data?.user && data.data.user.id === comment.member?.userId && (
          <CommentDropdown
            id={comment.id}
            messageId={comment.messageId}
            groupId={groupId}
          />
        )}
      </div>
      <div className="w-full flex flex-col items-start gap-2">
        <p className="text-sm p-3 bg-c-bg rounded-r-md rounded-b-md w-full">
          {comment?.body}
        </p>
        <span className="text-xs opacity-50 font-medium ml-auto">
          {format(toDate(comment?.createdAt), "H:mm")}
        </span>
      </div>
    </div>
  );
}
