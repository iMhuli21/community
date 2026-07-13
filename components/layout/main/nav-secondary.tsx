"use client";

import { getGroupsFn } from "@/actions/group/get-groups";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { maxItems } from "@/lib/constants";
import { getRandomPaletteColor } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export function NavSecondary({
  items,
}: {
  items: {
    label: string;
    href: string;
    icon?: any;
  }[];
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["groups", maxItems],
    queryFn: () => getGroupsFn(maxItems),
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
          {data?.groups ? (
            data.groups.map((group) => (
              <SidebarMenuItem key={group.id}>
                <SidebarMenuButton asChild>
                  <Link href={`/group/${group.id}`}>
                    <div
                      className="size-2 rounded-full"
                      style={{ backgroundColor: group.color }}
                    ></div>
                    {group.name}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          ) : (
            <p className="opacity-50 text-sm">
              You haven&apos;t created any communities yet.
            </p>
          )}
          {data?.groups && data.groups.length === 0 && (
            <p className="opacity-50 text-xs w-40 ml-2">
              You haven&apos;t created any communities yet.
            </p>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
