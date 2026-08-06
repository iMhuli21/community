"use client";

import { deleteCommentFn } from "@/actions/comment/delete-comment";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EllipsisIcon } from "lucide-react";
import { toast } from "sonner";

export default function CommentDropdown({
  id,
  messageId,
  groupId,
}: {
  id: string;
  messageId: string;
  groupId?: string;
}) {
  const queryClient = useQueryClient();

  const commentMutation = useMutation({
    mutationFn: deleteCommentFn,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["message", messageId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["group-message", groupId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["comments", messageId],
        }),
      ]);
    },
  });

  const handleDeleteComment = async () => {
    try {
      const res = await commentMutation.mutateAsync(id);

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
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-3 py-1 border border-line bg-muted rounded-sm">
        <EllipsisIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="flex items-center gap-2 text-xs font-medium"
          onClick={handleDeleteComment}
          disabled={commentMutation.isPending}
        >
          Delete comment
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
