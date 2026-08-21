import { toDate, truncateWord } from "@/lib/utils";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addModeratorFn } from "@/actions/member/add-moderator";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { EllipsisIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { removeModeratorFn } from "@/actions/member/remove-moderator";

interface Props {
  member: {
    id: string;
    name: string;
    userId: string;
    status: "Mod" | "Admin" | "Member";
    joinedAt: Date;
    groupId: string;
  };
}

export default function Member({ member }: Props) {
  const queryClient = useQueryClient();

  const addModerator = useMutation({
    mutationFn: addModeratorFn,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["group", member.groupId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["group-members", member.groupId],
        }),
      ]);
    },
  });
  const removeModerator = useMutation({
    mutationFn: removeModeratorFn,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["group", member.groupId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["group-members", member.groupId],
        }),
      ]);
    },
  });

  const handleAddMod = async () => {
    try {
      const res = await addModerator.mutateAsync({
        groupId: member.groupId,
        memberId: member.id,
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
  const handleRemoveMod = async () => {
    try {
      const res = await removeModerator.mutateAsync({
        groupId: member.groupId,
        memberId: member.id,
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

  return (
    <div className="p-4 w-full flex items-center border-b border-line justify-between gap-4">
      <div className="flex items-start gap-2">
        <Avatar>
          <AvatarFallback className="text-xs uppercase">
            {truncateWord(member.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col items-start gap-1">
          <div className="flex items-start gap-2">
            <h4 className="font-semibold">{member.name}</h4>
            <Badge size={"xs"} className="rounded-sm h-5 pointer-events-none">
              {member.status}
            </Badge>
          </div>
          <span className="text-xs opacity-50">
            Joined, {format(toDate(member.joinedAt), "MMM yyyy")}
          </span>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisIcon className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            disabled={addModerator.isPending}
            className="text-sm"
            onClick={handleAddMod}
          >
            Add Moderator
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={removeModerator.isPending}
            className="text-sm"
            onClick={handleRemoveMod}
          >
            Remove Moderator
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
