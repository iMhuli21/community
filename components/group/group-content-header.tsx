"use client";

import { Button } from "../ui/button";
import { fraunces } from "@/lib/fonts";
import { Badge } from "../ui/badge";
import { cn, truncateWord } from "@/lib/utils";
import { CheckIcon, PinIcon, Share2Icon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth/auth-client";
import { getGroupStatsFn } from "@/actions/group/get-group-stats";
import ErrorMessage from "../error-message";
import { joinGroupFn } from "@/actions/group/join-group";
import { toast } from "sonner";

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
  const queryClient = useQueryClient();

  const { data: session } = useQuery({
    queryKey: ["client-auth"],
    queryFn: () => authClient.getSession(),
  });

  const hasJoined = useMemo(() => {
    return data.members.filter(
      (member) => member.userId === session?.data?.user.id,
    );
  }, [data, session?.data]);

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
  return (
    <div className="space-y-2 border-b border-line bg-white">
      <div className="bg-black text-white p-5 flex flex-col gap-3 w-full">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Avatar size="lg" className="after:rounded-md">
              <AvatarFallback className="rounded-md bg-green-light text-green font-medium">
                {truncateWord(data?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start gap-0">
              <span
                className={cn(
                  "text-xl font-medium text-white tracking-tight",
                  fraunces.className,
                )}
              >
                {data?.name}
              </span>
              <div className="flex items-center gap-2 text-white/60">
                <PinIcon className="size-3" />
                <span className="text-xs">{data?.cityMunicipality}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size={"sm"}
              className="px-3 flex items-center gap-3 bg-[rgba(255,255,255,.08)] border border-[rgba(255,255,255,.13)] text-white/80"
            >
              <Share2Icon className="size-3" />
              Share
            </Button>
            {hasJoined.length > 0 ? (
              <Button
                size="sm"
                className="bg-[rgba(192,57,43,.15)] text-[#f87171] border border-[rgba(192,57,43,.3)] hover:bg-[rgba(192,57,43,.15)]/80 "
              >
                Leave Group
              </Button>
            ) : (
              <Button
                onClick={handleJoinGroup}
                disabled={joinMutation.isPending}
              >
                <CheckIcon /> Join
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-5">
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
      <div className="px-5 py-2 flex items-center gap-4 justify-between">
        <ToggleGroup type="single" defaultValue="latest">
          <ToggleGroupItem
            size={"sm"}
            value="latest"
            className="text-muted-foreground data-[state=on]:text-white data-[state=on]:bg-black h-7 rounded-sm tracking-tighter px-3"
          >
            Latest
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
            value="resolved"
            className="text-muted-foreground data-[state=on]:text-white data-[state=on]:bg-black h-7 rounded-sm tracking-tighter px-3"
          >
            Resolved
          </ToggleGroupItem>
        </ToggleGroup>
        <div className="flex items-center w-fit gap-1 opacity-50 text-sm tracking-tight">
          <HiAdjustmentsHorizontal className="size-4" />
          <span>Filter</span>
        </div>
      </div>
    </div>
  );
}
