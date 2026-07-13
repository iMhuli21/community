"use client";

import { Button } from "../ui/button";
import { fraunces } from "@/lib/fonts";
import { Badge } from "../ui/badge";
import { cn, truncateWord } from "@/lib/utils";
import { CheckIcon, PinIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth/auth-client";

interface Props {
  data: {
    error: null;
    data: {
      id: string;
      name: string;
      slug: string;
      description: string;
      suburb: string;
      city_municipality: string;
      color: string;
      creatorId: string;
      updatedAt: Date;
      members: {
        id: string;
        user_id: string;
        status: "Mod" | "Admin" | "Member";
      }[];
    };
  };
}

export default function GroupContentHeader({ data }: Props) {
  const { data: session } = useQuery({
    queryKey: ["client-auth"],
    queryFn: () => authClient.getSession(),
  });

  const hasJoined = useMemo(() => {
    return data.data.members.filter(
      (member) => member.user_id === session?.data?.user.id,
    );
  }, [data.data, session?.data]);
  return (
    <div className="space-y-2 border-b border-line">
      <div className="bg-black text-white p-5 flex flex-col gap-3 w-full">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Avatar size="lg">
              <AvatarFallback className="rounded-md bg-green-light text-green font-medium">
                {truncateWord(data?.data?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start gap-0">
              <span
                className={cn(
                  "text-xl font-medium text-white tracking-tight",
                  fraunces.className,
                )}
              >
                {data?.data.name}
              </span>
              <div className="flex items-center gap-2 text-white/60">
                <PinIcon className="size-3" />
                <span className="text-xs">{data?.data.city_municipality}</span>
              </div>
            </div>
          </div>
          {hasJoined.length > 0 ? (
            <Button>
              <CheckIcon /> Joined
            </Button>
          ) : (
            <Button>
              <CheckIcon /> Join
            </Button>
          )}
        </div>
        <div className="flex items-center gap-5">
          <Badge className="h-5 rounded-sm">Public</Badge>
          <div className="flex items-center gap-1 text-sm text-white tracking-tight font-medium">
            <span className="text-white/90">{data?.data?.members.length}</span>
            <span className="text-white/50">
              {data?.data?.members.length === 1 ? "member" : "members"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-white tracking-tight font-medium">
            <span className="text-white/90">38</span>
            <span className="text-white/50">open reports</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-white tracking-tight font-medium">
            <span className="text-white/90">12</span>
            <span className="text-white/50">resolved this month</span>
          </div>
        </div>
      </div>
      <div className="px-5 py-2 flex items-center gap-4 justify-between">
        <ToggleGroup type="single" defaultValue="latest">
          <ToggleGroupItem
            size={"sm"}
            value="latest"
            className="text-muted-foreground data-[state=on]:text-black"
          >
            Latest
          </ToggleGroupItem>
          <ToggleGroupItem
            size={"sm"}
            value="top"
            className="text-muted-foreground data-[state=on]:text-black"
          >
            Top
          </ToggleGroupItem>
          <ToggleGroupItem
            size={"sm"}
            value="reports"
            className="text-muted-foreground data-[state=on]:text-black"
          >
            Reports
          </ToggleGroupItem>
          <ToggleGroupItem
            size={"sm"}
            value="resolved"
            className="text-muted-foreground data-[state=on]:text-black"
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
