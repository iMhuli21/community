"use client";

import { getJoinedGroupsFn } from "@/actions/group/get-groups";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { sideBarLimit } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export function NavSecondary() {
  const { data, isLoading } = useQuery({
    queryKey: ["groups", sideBarLimit],
    queryFn: () => getJoinedGroupsFn(sideBarLimit),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="flex-none text-sm animate-spin" />
      </div>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="uppercase">
        My communities
      </SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {data?.data ? (
            data.data.map((info) => (
              <SidebarMenuItem key={info.group?.id}>
                <SidebarMenuButton asChild>
                  <Link href={`/group/${info.group?.id}`}>
                    <div
                      className="size-2 rounded-full"
                      style={{ backgroundColor: info.group?.color }}
                    ></div>
                    {info.group?.name}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          ) : (
            <p className="opacity-50 text-sm">
              You haven&apos;t created any communities yet.
            </p>
          )}
          {data?.data && data.data.length === 0 && (
            <p className="opacity-50 text-xs w-40 ml-2">
              You haven&apos;t created any communities yet.
            </p>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
