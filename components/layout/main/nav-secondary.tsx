"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavSecondary({
  items,
}: {
  items: {
    label: string;
    href: string;
    icon?: any;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="uppercase">
        My communities
      </SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <div className="bg-green-700 size-2 rounded-full"></div>
              Primville Ward 45
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <div className="bg-red-700 size-2 rounded-full"></div>
              New Makhado Park
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <div className="bg-blue-700 size-2 rounded-full"></div>
              Newtown
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
