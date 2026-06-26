"use client";

import * as React from "react";
import { NavMain } from "@/components/layout/main/nav-main";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { mainRoutes } from "@/lib/constants";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { inter } from "@/lib/fonts";
import { NavSecondary } from "./nav-secondary";
import Link from "next/link";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              size={"lg"}
            >
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/Logo.png"
                  width={500}
                  height={500}
                  alt="Logo"
                  className="w-12 h-12"
                  priority
                />
                <h4
                  className={cn(
                    "text-lg tracking-tighter font-medium",
                    inter.className,
                  )}
                >
                  Comm<em className="italic">unity</em>
                </h4>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={mainRoutes} />
        <NavSecondary items={mainRoutes} />
      </SidebarContent>
    </Sidebar>
  );
}
