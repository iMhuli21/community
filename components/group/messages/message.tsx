import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Message as MessageType } from "@/lib/types";
import { cn, toDate, truncateWord } from "@/lib/utils";
import {
  InfoIcon,
  MessageCircleIcon,
  Share2Icon,
  StarIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { formatRelative } from "date-fns";
import { TbSpeakerphone } from "react-icons/tb";

interface Props {
  message: MessageType & {
    member: {
      id: string;
      name: string;
      status: "Mod" | "Admin" | "Member";
    } | null;
  };
}

export default function Message({ message }: Props) {
  return (
    <div className="border-b border-line">
      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-start gap-2 relative">
          <Avatar>
            <AvatarFallback
              className={cn(
                message.type === "announcement"
                  ? "text-xs text-amber"
                  : message.type === "notice"
                    ? "text-xs text-blue"
                    : message.type === "report"
                      ? "text-xs text-destructive"
                      : "text-xs",
              )}
            >
              {truncateWord(message.member?.name ?? "")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start gap-0 pointer-events-none">
            <span className="text-sm font-semibold">
              {message.member?.name}
            </span>
            <span className="text-xs opacity-50 ">
              {formatRelative(toDate(message.createdAt), new Date())}
            </span>
          </div>
          {message.type !== "normal" && (
            <Badge
              className="rounded-sm h-5 pointer-events-none"
              size={"xs"}
              variant={message.type}
            >
              {message.type === "report" ? (
                <InfoIcon size={19} />
              ) : message.type === "announcement" ? (
                <StarIcon />
              ) : (
                message.type === "notice" && <TbSpeakerphone />
              )}
              {message.type}
            </Badge>
          )}
        </div>
        <div>
          <p className="text-sm">{message.body}</p>
          {/* media */}
        </div>
        <div className="border-line border-t"></div>
        <div className="flex items-center gap-5">
          <div className="grid grid-cols-2 divide-x divide-line w-30 gap-5">
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium tracking-tight">
              <ThumbsUpIcon size={15} />
              <span>40</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium tracking-tight">
              <MessageCircleIcon size={15} />
              <span>40</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium tracking-tight">
            <Share2Icon size={15} />
            <span>Share</span>
          </div>
        </div>
      </div>
    </div>
  );
}
