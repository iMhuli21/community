"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import AppTitle from "./app-title";
import NavAvatar from "../nav-avatar";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth/auth-client";

export function SiteHeader() {
  const { data } = useQuery({
    queryKey: ["client-auth"],
    queryFn: () => authClient.getSession(),
  });

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-8"
        />
        <AppTitle />
        <div className="ml-auto flex items-center gap-2">
          {data?.data?.user?.id && <NavAvatar name={data.data.user.name} />}
        </div>
      </div>
    </header>
  );
}
