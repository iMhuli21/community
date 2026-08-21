"use client";

import {
  CheckCircle2Icon,
  FlagTriangleRightIcon,
  InfoIcon,
  MessageCircleIcon,
  Route,
  SendIcon,
  Share2Icon,
  StarIcon,
  ThumbsUpIcon,
  Trash2,
  UsersIcon,
} from "lucide-react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Badge } from "../ui/badge";
import { getMessageFn } from "@/actions/message/get-message";
import { TbSpeakerphone } from "react-icons/tb";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { cn, downloadFile, toDate, truncateWord } from "@/lib/utils";
import { formatRelative } from "date-fns";
import Image from "next/image";
import { Button } from "../ui/button";
import { useMemo } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { likeMessageFn } from "@/actions/message/like-message";
import { CreateCommentSchema, Message } from "@/lib/types";
import { toast } from "sonner";
import { AiOutlineFire } from "react-icons/ai";
import ErrorMessage from "../error-message";
import { getCommentsFn } from "@/actions/comment/get-comments";
import CommentCard from "../group/comment/comment";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCommentSchema } from "@/lib/zod-schema";
import { Field, FieldError } from "../ui/field";
import { createCommentFn } from "@/actions/comment/create-comment";
import { Textarea } from "../ui/textarea";
import { hasPermissionFn } from "@/actions/member/has-permissions";
import {
  markMessageAsResolvedFn,
  markMessageAsUrgentFn,
} from "@/actions/message/update-message";
import { deleteMessageFn } from "@/actions/message/delete-message";
import BackBtn from "../back-btn";
import { useRouter } from "next/navigation";
import { flagMessageFn } from "@/actions/message/flag-message";
import ReportDropdown from "../group/messages/report-dropdown";

export default function PostContent({ id }: { id: string }) {
  const { data: session } = useQuery({
    queryKey: ["client-auth"],
    queryFn: () => authClient.getSession(),
  });

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["message", id],
    queryFn: () => getMessageFn({ messageId: id }),
  });

  const hasPermissions = useQuery({
    queryKey: ["permissions", post?.groupId],
    queryFn: () => hasPermissionFn(post?.groupId),
    enabled: Boolean(post?.groupId),
  });

  const {
    data: comments,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["comments", id],
    queryFn: ({ pageParam }) =>
      getCommentsFn({ messageId: id, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: likeMessageFn,
    onMutate: () => {
      const previousMessages = queryClient.getQueryData<Message>([
        "message",
        id,
      ]);

      queryClient.setQueryData<Message>(["message", id], (old) => {
        if (!old || !old.likes) {
          return old;
        }

        return {
          ...old,
          likes: [
            ...old.likes,
            {
              id: "1",
              member: {
                userId: "1",
              },
            },
          ],
        };
      });

      return { previousMessages };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["message", id], context?.previousMessages);
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["message", id],
        }),
        queryClient.invalidateQueries({
          queryKey: ["group-messages", post?.groupId],
        }),
      ]);
    },
  });

  const commentMutation = useMutation({
    mutationFn: createCommentFn,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["message", id],
        }),
        queryClient.invalidateQueries({
          queryKey: ["group-message", post?.groupId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["comments", id],
        }),
      ]);
    },
  });

  const urgentMessageMutation = useMutation({
    mutationFn: markMessageAsUrgentFn,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["group"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["group-messages"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["message", id],
        }),
      ]);
    },
  });
  const resolveMessageMutation = useMutation({
    mutationFn: markMessageAsResolvedFn,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["group"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["group-messages"],
        }),
      ]);
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: deleteMessageFn,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["group-messages", post?.groupId],
      });
    },
  });

  const route = useRouter();

  const form = useForm<CreateCommentSchema>({
    mode: "onChange",
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      comment: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
    control,
    watch,
  } = form;

  const handleLikeMessage = async () => {
    if (post) {
      const res = await likeMutation.mutateAsync({
        messageId: id,
        groupId: post.groupId,
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
    }
  };

  const hasLiked = useMemo(() => {
    return post?.likes.filter(
      (like) => like.member?.userId === session?.data?.user.id,
    );
  }, [post]);

  const handleAddComment = async (values: CreateCommentSchema) => {
    if (post) {
      try {
        const res = await commentMutation.mutateAsync({
          messageId: id,
          groupId: post.groupId,
          values,
        });

        if (res?.success) {
          reset({
            comment: "",
          });
          toast.success("Success", {
            description: res.success,
          });
        }
      } catch (e) {
        toast.error("Error", {
          description: e instanceof Error ? e.message : "Unknown",
        });
      }
    }
  };

  const handleMarkMessageUrgent = async () => {
    if (post) {
      try {
        const res = await urgentMessageMutation.mutateAsync({
          messageId: post.id,
          groupId: post.groupId,
        });

        if (res?.success) {
          return toast.success("Success", {
            description: res.success,
          });
        }
      } catch (e) {
        toast.error("Error", {
          description: e instanceof Error ? e.message : "Unknown",
        });
      }
    }
  };

  const handleMarkMessageResolved = async () => {
    if (post) {
      try {
        const res = await resolveMessageMutation.mutateAsync({
          messageId: post.id,
          groupId: post.groupId,
        });

        if (res?.success) {
          return toast.success("Success", {
            description: res.success,
          });
        }
      } catch (e) {
        toast.error("Error", {
          description: e instanceof Error ? e.message : "Unknown",
        });
      }
    }
  };

  const handleDeleteMessage = async () => {
    if (post) {
      const res = await deleteMessageMutation.mutateAsync(post.id);

      if (deleteMessageMutation.error) {
        return toast.error("Error", {
          description: deleteMessageMutation.error.message,
        });
      } else if (res.success) {
        toast.success("Success", {
          description: res.success,
        });

        route.push(`/group/${post.groupId}`);
      }
    }
  };

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (!post && !isLoading) {
    return <div>Post not found..</div>;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_HOST_NAME}/post/${post?.id}`,
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
    <div className="p-6 bg-c-bg space-y-3">
      {post?.groupId && (
        <BackBtn href={`/group/${encodeURIComponent(post?.groupId)}`} />
      )}
      <div className="flex flex-col-reverse sm:flex-row items-start gap-5 bg-c-bg min-h-dvh">
        <div className="w-full ">
          <div className="w-full flex-1 border border-line p-8 flex flex-col items-start gap-4 rounded-t-lg bg-white ">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Badge
                  className="rounded-sm h-5 pointer-events-none"
                  size={"xs"}
                  variant={post?.type}
                >
                  {post?.type === "report" ? (
                    <InfoIcon size={19} />
                  ) : post?.type === "announcement" ? (
                    <StarIcon />
                  ) : (
                    post?.type === "notice" && <TbSpeakerphone />
                  )}
                  {post?.type}
                </Badge>
                {post?.isUrgent && (
                  <Badge
                    className="rounded-sm h-5 pointer-events-none"
                    size={"xs"}
                    variant={"report"}
                  >
                    {"Urgent"}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <UsersIcon className="text-green size-4" />
                <span className="text-green font-medium">
                  {post?.group?.name}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarFallback
                  className={cn(
                    post?.type === "announcement"
                      ? "text-xs text-amber"
                      : post?.type === "notice"
                        ? "text-xs text-blue"
                        : post?.type === "report"
                          ? "text-xs text-destructive"
                          : "text-xs",
                  )}
                >
                  {truncateWord(post?.member?.name ?? "")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start gap-0">
                <span className="font-semibold tracking-tight">
                  {post?.member?.name}
                </span>
                <span className="text-xs opacity-50">
                  {formatRelative(toDate(post?.createdAt ?? ""), new Date())}
                </span>
              </div>
            </div>
            <div className="border-t border-line w-full"></div>
            <div className="flex flex-col items-start gap-3 w-full">
              <p className="text-sm">{post?.body}</p>
              {post?.media && (
                <div className="grid grid-cols-2 grid-flow-dense gap-4">
                  {post?.media.map((image) => (
                    <Image
                      key={image}
                      src={image}
                      width={500}
                      height={500}
                      className="rounded-lg h-50 w-90"
                      alt="uploaded image1"
                      loading="lazy"
                    />
                  ))}
                </div>
              )}
              {post?.messageAttachments &&
                post.messageAttachments.length > 0 && (
                  <div className="bg-accent rounded-md border border-gray-300 flex flex-col items-start gap-2 p-3 w-full">
                    {post?.messageAttachments.map((attachment) => (
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
                              PDF{" "}
                              {`${(attachment.fileSize / 1024).toFixed(0)} KB`}
                            </span>
                          </div>
                          <Button
                            variant={"ghost"}
                            size={"sm"}
                            className="text-green font-medium text-xs"
                            onClick={() =>
                              downloadFile(
                                attachment.fileUrl,
                                attachment.fileName,
                              )
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
            <div className="border-t border-line w-full"></div>
            <div className="flex items-center gap-2">
              <button
                disabled={likeMutation.isPending}
                onClick={handleLikeMessage}
                type="button"
                className={cn(
                  hasLiked && hasLiked.length > 0
                    ? "flex items-center gap-1 text-xs text-green font-medium tracking-tight bg-muted px-3 py-1 border border-line rounded-md transition-all duration-150 ease-linear cursor-pointer"
                    : "flex items-center gap-1 text-xs text-muted-foreground font-medium tracking-tight bg-muted px-3 py-1 border border-line rounded-sm transition-all duration-150 ease-linear cursor-pointer",
                )}
              >
                <ThumbsUpIcon size={15} />
                <span>{post?.likes.length}</span>
              </button>
              <button
                type="button"
                className={
                  "flex items-center gap-1 text-xs text-muted-foreground font-medium tracking-tight bg-muted px-3 py-1 border border-line rounded-sm transition-all duration-150 ease-linear cursor-pointer"
                }
              >
                <MessageCircleIcon size={15} />
                <span>{post?.commentsCount}</span>
              </button>
              <button
                className="flex items-center gap-1 text-xs text-muted-foreground font-medium tracking-tight bg-muted px-3 py-1 border border-line rounded-sm transition-all duration-150 ease-linear cursor-pointer"
                onClick={handleCopy}
              >
                <Share2Icon size={15} />
                <span>Share</span>
              </button>
            </div>
          </div>
          <div className="bg-white p-5 border-b border-l border-r border-line rounded-b-lg flex flex-col items-start gap-3">
            <div className="flex items-center gap-4 justify-between w-full">
              <span className="font-semibold text-sm tracking-tight">
                Comments
              </span>
              <span className="text-muted-foreground text-xs">
                {`${post?.commentsCount} ${post?.commentsCount === 1 ? "comment" : "comments"}`}
              </span>
            </div>
            <div className="flex flex-col items-start gap-3 w-full">
              {comments?.pages.map((page) =>
                page.comments.map((comment) => (
                  <CommentCard
                    key={comment.id}
                    comment={comment}
                    groupId={post?.groupId}
                  />
                )),
              )}
              {isFetchingNextPage && (
                <div
                  className="text-sm w-fit font-medium text-green bg-muted px-3 py-1 rounded-sm border border-line tracking-tight mx-auto"
                  onClick={() => {
                    if (!isFetchingNextPage && hasNextPage) {
                      fetchNextPage();
                    }
                  }}
                >
                  load more...
                </div>
              )}
            </div>
            <div className="flex items-start gap-3 w-full">
              <Avatar>
                <AvatarFallback className="text-xs">
                  {truncateWord(post?.member?.name ?? "")}
                </AvatarFallback>
              </Avatar>
              <form
                onSubmit={handleSubmit(handleAddComment)}
                className="w-full space-y-2"
              >
                <Controller
                  name="comment"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Textarea
                        className="flex-1 bg-c-bg min-h-9 resize-none"
                        placeholder="Add a comment..."
                        {...field}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                {watch("comment").length > 0 && (
                  <div className="flex items-center gap-2 ml-auto w-fit">
                    <Button
                      variant={"outline"}
                      type="button"
                      size={"sm"}
                      disabled={isSubmitting}
                      onClick={() => reset({ comment: "" })}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="pl-4 flex items-center gap-2"
                      type="submit"
                      size={"sm"}
                      disabled={isSubmitting}
                    >
                      <SendIcon className="size-3" /> Comment
                    </Button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
        <div className="w-full max-w-60 rounded-lg border border-line p-4 flex flex-col items-start gap-3 bg-white">
          <span className="uppercase text-muted-foreground text-xs font-medium">
            Actions
          </span>

          <div className="border-t border-line w-full"></div>
          <div className="flex flex-col items-start gap-1.5 w-full">
            {post?.member?.userId === session?.data?.user.id && (
              <button
                className="w-full flex items-center gap-2 border border-line hover:bg-muted/80 text-[.78rem] px-[.9rem] py-2 font-semibold rounded-sm bg-c-bg text-ink2 disabled:pointer-events-none disabled:opacity-50"
                onClick={handleDeleteMessage}
                disabled={
                  deleteMessageMutation.isPending ||
                  resolveMessageMutation.isPending ||
                  urgentMessageMutation.isPending
                }
              >
                <Trash2 className="size-4" />
                <span>Delete Message</span>
              </button>
            )}
            {hasPermissions.data?.status && (
              <button
                className="w-full flex items-center gap-2 border border-line hover:bg-muted/80 text-[.78rem] px-[.9rem] py-2 font-semibold rounded-sm bg-c-bg text-ink2 disabled:pointer-events-none disabled:opacity-50"
                onClick={handleMarkMessageResolved}
                disabled={
                  deleteMessageMutation.isPending ||
                  resolveMessageMutation.isPending ||
                  urgentMessageMutation.isPending
                }
              >
                <CheckCircle2Icon className="size-4" />
                <span>Mark as Resolved</span>
              </button>
            )}
            {hasPermissions.data?.status && (
              <button
                className="w-full flex items-center gap-2 border border-line hover:bg-muted/80 text-[.78rem] px-[.9rem] py-2 font-semibold rounded-sm bg-c-bg text-ink2 disabled:pointer-events-none disabled:opacity-50"
                onClick={handleMarkMessageUrgent}
                disabled={
                  deleteMessageMutation.isPending ||
                  resolveMessageMutation.isPending ||
                  urgentMessageMutation.isPending
                }
              >
                <AiOutlineFire size={18} />
                <span>Mark as Urgent</span>
              </button>
            )}
            {post && (
              <ReportDropdown
                disabled={
                  deleteMessageMutation.isPending ||
                  resolveMessageMutation.isPending ||
                  urgentMessageMutation.isPending
                }
                groupId={post.groupId}
                messageId={post.id}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
