"use client";

import { toast } from "sonner";
import { useMemo, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { fraunces } from "@/lib/fonts";
import { cn, truncateWord } from "@/lib/utils";
import { authClient } from "@/lib/auth/auth-client";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { joinGroupFn } from "@/actions/group/join-group";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { leaveGroupFn } from "@/actions/group/leave-group";
import {
  CheckIcon,
  EllipsisVerticalIcon,
  PinIcon,
  Share2Icon,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import GroupDropDown from "./group-dropdown";
import { hasPermissionFn } from "@/actions/member/has-permissions";
import { host_name } from "@/lib/constants";
import { TbDoorExit } from "react-icons/tb";

interface Props {
  data: {
    id: string;
    name: string;
    slug: string;
    creatorId: string;
    description: string;
    suburbArea: string;
    cityMunicipality: string;
    color: string;
    membersCount: number;
    members: {
      id: string;
      userId: string;
      status: "Mod" | "Admin" | "Member";
    }[];
    stats: {
      reports: number;
      resolvedReports: number;
    };
  };
}

export default function GroupContentHeader({ data }: Props) {
  const route = useRouter();

  const searchParams = useSearchParams();

  const [activeToggle, setActiveToggle] = useState(
    searchParams.get("filter") ?? "latest",
  );

  const queryClient = useQueryClient();

  const { data: session } = useQuery({
    queryKey: ["client-auth"],
    queryFn: () => authClient.getSession(),
  });

  const hasPermissions = useQuery({
    queryKey: ["permissions", data.id],
    queryFn: () => hasPermissionFn(data.id),
    enabled: Boolean(data.id),
  });

  const joinMutation = useMutation({
    mutationFn: joinGroupFn,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["groups"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["limited-groups"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["group-count"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["search-group"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["joined-groups"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["group", data.id],
        }),
      ]);
    },
  });

  const leaveMutation = useMutation({
    mutationFn: leaveGroupFn,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["groups"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["limited-groups"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["group-count"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["search-group"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["joined-groups"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["group", data.id],
        }),
        queryClient.invalidateQueries({
          queryKey: ["group-messages", data.id],
        }),
      ]);
    },
  });

  const handleJoinGroup = async () => {
    try {
      const res = await joinMutation.mutateAsync(data.id);

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

  const handleLeaveGroup = async () => {
    try {
      const res = await leaveMutation.mutateAsync(data.id);

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_HOST_NAME}/group/${data.id}`,
      );

      toast.success("Success", {
        description: "Successfully copied link to group",
      });
    } catch (e) {
      toast.error("Error", {
        description: e instanceof Error ? e.message : "Unknown",
      });
    }
  };

  return (
    <div className="space-y-2 border-b border-line bg-white">
      <div className="bg-black text-white p-5 flex flex-col gap-3 w-full">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Avatar className="after:rounded-md">
              <AvatarFallback className="rounded-md bg-green-light text-green font-medium">
                {truncateWord(data?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start gap-0">
              <span
                className={cn(
                  "text-base sm:text-xl font-medium text-white tracking-tight line-clamp-1",
                  fraunces.className,
                )}
              >
                {data?.name}
              </span>
              <div className="flex items-center gap-2 text-white/60">
                <PinIcon className="size-3" />
                <span className="text-xs line-clamp-1">
                  {data?.cityMunicipality}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size={"sm"}
              className="px-3 flex items-center gap-3 bg-[rgba(255,255,255,.08)] border border-[rgba(255,255,255,.13)] text-white/80 "
              onClick={handleCopy}
            >
              <Share2Icon className="size-3" />
              <span className="hidden sm:block">Share</span>
            </Button>
            {data.members.filter(
              (member) => member.userId === session?.data?.user.id,
            ).length > 0 ? (
              <Button
                onClick={handleLeaveGroup}
                disabled={leaveMutation.isPending}
                size="sm"
                className="bg-[rgba(192,57,43,.15)] text-[#f87171] border border-[rgba(192,57,43,.3)] hover:bg-[rgba(192,57,43,.15)]/80 flex items-center gap-3"
              >
                <TbDoorExit className="sm:hidden size-4" />
                <span className="hidden sm:block">Leave Group</span>
              </Button>
            ) : (
              <Button
                onClick={handleJoinGroup}
                disabled={joinMutation.isPending}
                size="sm"
                className="flex items-center gap-3"
              >
                <CheckIcon /> Join
              </Button>
            )}
            {hasPermissions.data?.status && (
              <GroupDropDown groupId={data.id}>
                <EllipsisVerticalIcon className="size-4" />
              </GroupDropDown>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-5 flex-wrap">
          <Badge className="h-5 rounded-sm">Public</Badge>
          <div className="flex items-center gap-1 text-sm text-white tracking-tight font-medium">
            <span className="text-white/90">{data?.members.length}</span>
            <span className="text-white/50">
              {data?.members.length === 1 ? "member" : "members"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-white tracking-tight font-medium">
            <span className="text-white/90">{data?.stats.reports}</span>
            <span className="text-white/50">open reports</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-white tracking-tight font-medium">
            <span className="text-white/90">{data?.stats.resolvedReports}</span>
            <span className="text-white/50">resolved this month</span>
          </div>
        </div>
      </div>
      <div className="px-5 py-2 flex items-center gap-4 justify-between overflow-x-auto">
        <ToggleGroup
          type="single"
          defaultValue={activeToggle}
          onValueChange={(val) => route.push(`/group/${data.id}?filter=${val}`)}
        >
          <ToggleGroupItem
            size={"sm"}
            value="latest"
            className="text-muted-foreground data-[state=on]:text-white data-[state=on]:bg-black h-7 rounded-sm tracking-tighter px-3"
          >
            Latest
          </ToggleGroupItem>
          <ToggleGroupItem
            size={"sm"}
            value="announcement"
            className="text-muted-foreground data-[state=on]:text-white data-[state=on]:bg-black h-7 rounded-sm tracking-tighter px-3"
          >
            Announcement
          </ToggleGroupItem>
          <ToggleGroupItem
            size={"sm"}
            value="notice"
            className="text-muted-foreground data-[state=on]:text-white data-[state=on]:bg-black h-7 rounded-sm tracking-tighter px-3"
          >
            Notice
          </ToggleGroupItem>
          <ToggleGroupItem
            size={"sm"}
            value="reports"
            className="text-muted-foreground data-[state=on]:text-white data-[state=on]:bg-black h-7 rounded-sm tracking-tighter px-3"
          >
            Reports
          </ToggleGroupItem>

          <ToggleGroupItem
            size={"sm"}
            value="polls"
            className="text-muted-foreground data-[state=on]:text-white data-[state=on]:bg-black h-7 rounded-sm tracking-tighter px-3"
          >
            Polls
          </ToggleGroupItem>
        </ToggleGroup>
        <div className="hidden sm:flex items-center w-fit gap-1 opacity-50 text-sm tracking-tight">
          <HiAdjustmentsHorizontal className="size-4" />
          <span>Filter</span>
        </div>
      </div>
    </div>
  );
}
