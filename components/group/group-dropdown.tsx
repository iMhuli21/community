"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  EllipsisIcon,
  Footprints,
  PenLineIcon,
  ShieldUserIcon,
} from "lucide-react";

export default function GroupDropDown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-40">
        <DropdownMenuLabel className="text-center">Actions</DropdownMenuLabel>
        <DropdownMenuItem className="flex items-center">
          <PenLineIcon className="size-3" />
          Edit Group
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center">
          <Footprints className="size-4" />
          Leave Group
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center">
          <ShieldUserIcon className="size-4" />
          Pick Moderators
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
