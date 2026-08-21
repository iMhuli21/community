"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CreateCommentSchema, Message as MessageType } from "@/lib/types";
import { cn, downloadFile, toDate, truncateWord } from "@/lib/utils";
import {
  CheckCircle2Icon,
  InfoIcon,
  MessageCircleIcon,
  SendIcon,
  Share2Icon,
  StarIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { formatRelative } from "date-fns";
import { TbSpeakerphone } from "react-icons/tb";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth/auth-client";
import { AiOutlineFire } from "react-icons/ai";
import { likeMessageFn } from "@/actions/message/like-message";
import { toast } from "sonner";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import Comment from "../comment/comment";
import Link from "next/link";
import { host_name } from "@/lib/constants";

interface Props {
  message: MessageType;
}

export default function Message({ message }: Props) {
  const { data: session } = useQuery({
    queryKey: ["client-auth"],
    queryFn: () => authClient.getSession(),
  });

  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: likeMessageFn,
    onMutate: () => {
      const previousMessages = queryClient.getQueryData<MessageType[]>([
        "group-messages",
        message.groupId,
      ]);

      queryClient.setQueryData<MessageType[]>(
        ["group-messages", message.groupId],
        (old = []) =>
          old.map((olm) =>
            olm.id === message.id
              ? {
                  ...olm,
                  likes: [
                    {
                      id: "1",
                      member: {
                        userId: "1",
                      },
                    },
                    ...olm.likes,
                  ],
                }
              : olm,
          ),
      );

      return { previousMessages };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        ["group-messages", message.groupId],
        context?.previousMessages,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["group-messages", message.groupId],
      });
    },
  });

  const handleLikeMessage = async () => {
    try {
      const res = await likeMutation.mutateAsync({
        messageId: message.id,
        groupId: message.groupId,
      });
      if (res?.success) {
        toast.success("Success", {
          description: res.success,
        });
      }
    } catch (e) {
      toast.error("Error", {
        description: e instanceof Error ? e.message : "Unknown",
      });
    }
  };

  const hasLiked = useMemo(() => {
    return message.likes.filter(
      (like) => like.member?.userId === session?.data?.user.id,
    );
  }, [message]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_HOST_NAME}/post/${message.id}`,
      );

      toast.success("Success", {
        description: "Successfully copied link to message",
      });
    } catch (e) {
      toast.error("Error", {
        description: e instanceof Error ? e.message : "Unknown",
      });
    }
  };

  return (
    <Link href={`/post/${message.id}`}>
      <div className="p-4 flex flex-col gap-4 w-full">
        <div className="flex items-start gap-2 relative">
          <Avatar>
            <AvatarFallback
              className={cn(
                message.type === "announcement"
                  ? "text-xs text-amber"
                  : message.type === "notice"
                    ? "text-xs text-blue"
                    : message.type === "report"
                      ? "text-xs text-red-800"
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
          <div className="flex items-center gap-2">
            {message.member?.status === "Admin" ? (
              <Badge className="rounded-sm h-5 pointer-events-none" size={"xs"}>
                Admin
              </Badge>
            ) : (
              message.member?.status === "Mod" && (
                <Badge
                  className="rounded-sm h-5 pointer-events-none"
                  size={"xs"}
                >
                  Mod
                </Badge>
              )
            )}
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
            {message.status === "resolved" && (
              <Badge className="rounded-sm h-5 pointer-events-none" size={"xs"}>
                <CheckCircle2Icon />
                Resolved
              </Badge>
            )}
          </div>
        </div>
        <div className="flex flex-col items-start gap-2">
          {message.isUrgent && (
            <div className="w-full border border-destructive/30 bg-destructive/5 text-[#991b1b] rounded-md flex items-center gap-3 p-1.5 text-sm font-semibold tracking-tight">
              <AiOutlineFire />
              <span>Marked urgent by moderator.</span>
            </div>
          )}
          <p className="text-sm">{message.body}</p>
          {/* media */}
          {message.media.length > 0 && (
            <div className="grid grid-cols-2 grid-flow-dense gap-4">
              {message.media.map((image) => (
                <Image
                  key={image}
                  src={image}
                  width={500}
                  height={500}
                  className="rounded-lg h-50 w-90"
                  alt="uploaded image1"
                />
              ))}
            </div>
          )}
          {message.messageAttachments.length > 0 && (
            <div className="bg-accent rounded-md border border-gray-300 flex flex-col items-start gap-2 p-3 w-full">
              {message.messageAttachments.map((attachment) => (
                <div
                  key={attachment.fileKey}
                  className="w-full flex items-center gap-3"
                >
                  <div className="size-9 rounded-md bg-red-100"></div>
                  <div className="flex items-center gap-4 w-full justify-between">
                    <div className="flex flex-col items-start gap-0">
                      <span className="text-sm font-semibold tracking-tight">
                        {attachment.fileName}
                      </span>
                      <span className="text-xs opacity-50">
                        PDF {`${(attachment.fileSize / 1024).toFixed(0)} KB`}
                      </span>
                    </div>
                    <Button
                      variant={"ghost"}
                      size={"sm"}
                      className="text-green font-medium text-xs"
                      onClick={() =>
                        downloadFile(attachment.fileUrl, attachment.fileName)
                      }
                    >
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-line border-t w-full"></div>
        <div className="flex flex-col items-start gap-4 w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <button
                  disabled={likeMutation.isPending}
                  onClick={handleLikeMessage}
                  type="button"
                  className={cn(
                    hasLiked.length > 0
                      ? "flex items-center gap-1 text-xs text-green font-medium tracking-tight hover:bg-muted px-3 py-1 hover:border hover:border-line hover:rounded-md transition-all duration-150 ease-linear cursor-pointer"
                      : "flex items-center gap-1 text-xs text-muted-foreground font-medium tracking-tight hover:bg-muted px-3 py-1 hover:border hover:border-line hover:rounded-sm transition-all duration-150 ease-linear cursor-pointer",
                  )}
                >
                  <ThumbsUpIcon size={15} />
                  <span>{message.likes.length}</span>
                </button>
                <div className="border-l border border-line h-5"></div>
                <button
                  type="button"
                  className="flex items-center gap-1 text-xs text-muted-foreground font-medium tracking-tight hover:bg-muted px-3 py-1 hover:border hover:border-line hover:rounded-sm transition-all duration-150 ease-linear cursor-pointer"
                  onClick={() => {}}
                >
                  <MessageCircleIcon size={15} />
                  <span>{message.commentsCount}</span>
                </button>
              </div>
              <button
                className="flex items-center gap-1 text-xs text-muted-foreground font-medium tracking-tight hover:bg-muted px-3 py-1 hover:border hover:border-line hover:rounded-sm transition-all duration-150 ease-linear cursor-pointer"
                onClick={handleCopy}
              >
                <Share2Icon size={15} />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
        <div className="border-b border-line w-full"></div>
      </div>
    </Link>
  );
}
