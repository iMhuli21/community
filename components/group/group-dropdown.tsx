"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ShieldUserIcon } from "lucide-react";
import { ReactNode } from "react";
import PickModeratorsDialog from "./pick-moderators-dialog";

export default function GroupDropDown({
  children,
  groupId,
}: {
  children: ReactNode;
  groupId: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-40">
        <DropdownMenuLabel className="text-center">Actions</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <PickModeratorsDialog groupId={groupId} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
