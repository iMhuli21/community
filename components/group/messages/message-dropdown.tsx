"use client";

import { AiOutlineFire } from "react-icons/ai";
import { CheckCircle2Icon, EllipsisIcon, Trash } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  markMessageAsResolvedFn,
  markMessageAsUrgentFn,
} from "@/actions/message/update-message";
import { toast } from "sonner";
import { deleteMessageFn } from "@/actions/message/delete-message";

interface Props {
  memberUserId: string | undefined;
  userId: string | undefined;
  permission: boolean | null;
  messageId: string;
  groupId: string;
}

export default function MessageDropdown({
  permission,
  userId,
  memberUserId,
  messageId,
  groupId,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const urgentMutation = useMutation({
    mutationFn: markMessageAsUrgentFn,
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
  const resolveMutation = useMutation({
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

  const deleteMutation = useMutation({
    mutationFn: deleteMessageFn,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["group-messages", groupId],
      });
    },
  });

  const handleMarkUrgent = async () => {
    const res = await urgentMutation.mutateAsync(messageId);

    if (urgentMutation.error) {
      return toast.error("Error", {
        description: urgentMutation.error?.message,
      });
    } else if (res?.success) {
      setIsOpen(false);
      return toast.success("Success", {
        description: res.success,
      });
    }
  };
  const handleMarkResolved = async () => {
    const res = await resolveMutation.mutateAsync(messageId);

    if (resolveMutation.error) {
      return toast.error("Error", {
        description: resolveMutation.error?.message,
      });
    } else if (res?.success) {
      setIsOpen(false);
      return toast.success("Success", {
        description: res.success,
      });
    }
  };

  const handleDelete = async () => {
    const res = await deleteMutation.mutateAsync(messageId);

    if (deleteMutation.error) {
      return toast.error("Error", {
        description: deleteMutation.error.message,
      });
    } else if (res.success) {
      return toast.success("Success", {
        description: res.success,
      });
    }
  };

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="bg-accent py-1 px-2 rounded-md"
      >
        <EllipsisIcon size={18} />
      </div>
      {isOpen && (
        <div className="absolute -left-44 top-5 border border-line min-w-50 p-3 bg-white rounded-md text-sm flex flex-col items-start gap-1 z-50">
          <span className="text-center w-full opacity-50 font-medium tracking-tight">
            Actions
          </span>
          {memberUserId === userId && (
            <button
              type="button"
              disabled={deleteMutation.isPending}
              onClick={handleDelete}
              className="flex items-center gap-2 w-full p-1.5 rounded-md cursor-pointer disabled:pointer-events-none disabled:opacity-50"
            >
              <Trash size={18} />
              <span>Delete Message</span>
            </button>
          )}
          {permission && (
            <button
              className="flex items-center gap-2 w-full p-1.5 rounded-md disabled:pointer-events-none disabled:opacity-50 "
              onClick={handleMarkResolved}
              disabled={urgentMutation.isPending || resolveMutation.isPending}
            >
              <CheckCircle2Icon size={18} className="text-green" />
              <span>Mark as Resolved</span>
            </button>
          )}
          {permission && (
            <button
              className="flex items-center gap-2 w-full p-1.5 rounded-md disabled:pointer-events-none disabled:opacity-50 "
              onClick={handleMarkUrgent}
              disabled={urgentMutation.isPending || resolveMutation.isPending}
            >
              <AiOutlineFire size={20} className="text-destructive" />
              <span>Mark as Urgent</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
