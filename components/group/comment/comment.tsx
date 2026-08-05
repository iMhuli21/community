"use client";

import { format } from "date-fns";
import { toDate, truncateWord } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Props {
  comment: {
    body: string;
    id: string;
    createdAt: Date;
    memberId: string;
    messageId: string;
    member: {
      name: string;
      status: "Mod" | "Admin" | "Member";
    } | null;
  };
}

export default function Comment({ comment }: Props) {
  return (
    <div className="flex items-center gap-4 w-full  ">
      <Avatar>
        <AvatarFallback className="text-xs font-medium">
          {truncateWord(comment.member?.name ?? "")}
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-2 justify-between w-full bg-c-bg rounded-md p-2">
        <div className=" w-full flex items-center gap-2">
          <span className="font-medium tracking-tight text-sm">
            {comment.member?.name}
          </span>
          <div className="bg-gray-500 rounded-full size-1"></div>
          <p className="line-clamp-1 text-xs">{comment.body}</p>
        </div>
        <p className="text-xs font-medium w-fit text-muted-foreground">
          {format(toDate(comment.createdAt), "H:m")}
        </p>
      </div>
    </div>
  );
}
