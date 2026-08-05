"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CreateCommentSchema, Message as MessageType } from "@/lib/types";
import { cn, toDate, truncateWord } from "@/lib/utils";
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
import MessageDropdown from "./message-dropdown";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth/auth-client";
import { AiOutlineFire } from "react-icons/ai";
import { likeMessageFn } from "@/actions/message/like-message";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { createCommentSchema } from "@/lib/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCommentFn } from "@/actions/comment/create-comment";
import { Field, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Comment from "../comment/comment";

interface Props {
  message: MessageType;
  permissions: boolean | null;
}

export default function Message({ message, permissions }: Props) {
  const { data: session } = useQuery({
    queryKey: ["client-auth"],
    queryFn: () => authClient.getSession(),
  });

  const queryClient = useQueryClient();
  const [showCommentBox, setShowCommentBox] = useState(false);

  const form = useForm<CreateCommentSchema>({
    mode: "onChange",
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      comment: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  const commentMutation = useMutation({
    mutationFn: createCommentFn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["group-messages", message.groupId],
      });
    },
  });

  const handleCreateComment = async (values: CreateCommentSchema) => {
    const res = await commentMutation.mutateAsync({
      values,
      messageId: message.id,
      groupId: message.groupId,
    });

    if (commentMutation.error) {
      return toast.error("Error", {
        description: commentMutation.error?.message,
      });
    } else if (res?.success) {
      reset({
        comment: "",
      });
      setShowCommentBox(false);
      return toast.success("Success", {
        description: res.success,
      });
    }
  };

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
    const res = await likeMutation.mutateAsync({
      messageId: message.id,
      groupId: message.groupId,
    });

    if (likeMutation.error) {
      return toast.error("Error", {
        description: likeMutation.error?.message,
      });
    } else if (res?.success) {
      toast.success("Success", {
        description: res.success,
      });

      return;
    }
  };

  const hasLiked = useMemo(() => {
    return message.likes.filter(
      (like) => like.member?.userId === session?.data?.user.id,
    );
  }, [message]);

  const handleDownload = async (fileUrl: string, name: string) => {
    const res = await fetch(fileUrl);

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const toggleDownload = document.createElement("a");

    toggleDownload.href = url;
    toggleDownload.download = name;
    document.body.appendChild(toggleDownload);
    toggleDownload.click();

    toggleDownload.remove();

    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

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
                        handleDownload(attachment.fileUrl, attachment.fileName)
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
        <div className="border-line border-t"></div>
        <div className="flex flex-col items-start gap-4 w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-5">
              <div className="grid grid-cols-2 divide-x divide-line w-30 gap-5">
                <button
                  disabled={likeMutation.isPending}
                  onClick={handleLikeMessage}
                  type="button"
                  className={cn(
                    hasLiked.length > 0
                      ? "flex items-center gap-1 text-xs text-green font-medium tracking-tight"
                      : "flex items-center gap-1 text-xs text-muted-foreground font-medium tracking-tight",
                  )}
                >
                  <ThumbsUpIcon size={15} />
                  <span>{message.likes.length}</span>
                </button>
                <button
                  type="button"
                  disabled={commentMutation.isPending}
                  className="flex items-center gap-1 text-xs text-muted-foreground font-medium tracking-tight"
                  onClick={() => setShowCommentBox(!showCommentBox)}
                >
                  <MessageCircleIcon size={15} />
                  <span>{message.commentsCount}</span>
                </button>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium tracking-tight">
                <Share2Icon size={15} />
                <span>Share</span>
              </div>
            </div>
            {permissions ? (
              <MessageDropdown
                memberUserId={message?.member?.userId}
                permission={permissions}
                userId={session?.data?.user.id}
                messageId={message.id}
                groupId={message.groupId}
              />
            ) : (
              message.member?.userId === session?.data?.user?.id && (
                <MessageDropdown
                  memberUserId={message?.member?.userId}
                  permission={permissions}
                  userId={session?.data?.user.id}
                  messageId={message.id}
                  groupId={message.groupId}
                />
              )
            )}
          </div>
          {showCommentBox && (
            <form
              className="w-full border-t border-line py-2"
              onSubmit={handleSubmit(handleCreateComment)}
            >
              <Controller
                name="comment"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="w-full">
                    <div className="flex items-center gap-2 justify-between">
                      <Textarea
                        className="resize-none bg-c-bg min-h-6"
                        {...field}
                        placeholder="Add your comment..."
                      />
                      <Button
                        className="pl-4 flex items-center gap-2 bg-blue text-white tracking-tight"
                        type="submit"
                        disabled={isSubmitting}
                        variant={"outline"}
                      >
                        <MessageCircleIcon className="size-3" /> Comment
                      </Button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </form>
          )}
          {message.comments.length > 0 && (
            <div className="flex flex-col items-start gap-2 w-full border-t border-line p-2">
              {message.comments.map((comment) => (
                <Comment key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
