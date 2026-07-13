"use client";

import { authClient } from "@/lib/auth/auth-client";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { truncateWord } from "@/lib/utils";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { InfoIcon, StarIcon, ImageIcon, SendIcon } from "lucide-react";
import { TbSpeakerphone } from "react-icons/tb";

export default function CreateMessage() {
  const { data, isLoading } = useQuery({
    queryKey: ["client-auth"],
    queryFn: () => authClient.getSession(),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const session = data?.data;

  return (
    <div className="py-4 px-5 flex items-start gap-4">
      <Avatar>
        <AvatarFallback className="bg-green-light text-green font-medium border-2 border-green-light">
          {truncateWord(session?.user.name ?? "")}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2 flex-1">
        <Textarea
          className="resize-none bg-c-bg min-h-11"
          placeholder="Share an update, report an issue, or post a notice for your community..."
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              size="xs"
              variant={"outline"}
              className="bg-c-bg text-xs text-muted-foreground font-medium hover:text-destructive/80 hover:bg-destructive/10 hover:border-destructive"
            >
              <InfoIcon />
              Report
            </Button>
            <Button
              size="xs"
              variant={"outline"}
              className="bg-c-bg text-xs text-muted-foreground font-medium hover:text-blue hover:bg-blue-light hover:border-blue"
            >
              <TbSpeakerphone />
              Notice
            </Button>
            <Button
              size="xs"
              variant={"outline"}
              className="bg-c-bg text-xs text-muted-foreground font-medium hover:text-green hover:bg-green-light hover:border-green"
            >
              <StarIcon />
              Announce
            </Button>
            <Button
              size="xs"
              variant={"outline"}
              className="bg-c-bg text-xs text-muted-foreground font-medium"
            >
              <ImageIcon />
            </Button>
          </div>
          <Button size="sm" className="pl-4 flex items-center gap-2">
            <SendIcon className="size-3" /> Post
          </Button>
        </div>
      </div>
    </div>
  );
}
