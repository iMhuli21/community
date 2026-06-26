import { mainRoutes } from "@/lib/constants";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import { HomeIcon } from "lucide-react";
import SignOutBtn from "./sign-out-btn";

export default function NavAvatar({ name }: { name: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild suppressHydrationWarning>
        <Avatar size="lg" suppressHydrationWarning>
          <AvatarFallback
            suppressHydrationWarning
            className="bg-green-light text-green font-medium border border-green-light"
          >{`${name.split("")[0]}${name.split(" ")[1].split("")[0]}`}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="text-center">MENU</DropdownMenuLabel>
        {mainRoutes.map((route) => (
          <DropdownMenuItem asChild key={route.href}>
            <Link href={route.href} className="flex items-center gap-1">
              <route.icon className="opacity-50" />
              {route.label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem asChild suppressHydrationWarning>
          <SignOutBtn />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
