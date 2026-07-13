import {
  HomeIcon,
  SearchIcon,
  SettingsIcon,
  FlagTriangleRightIcon,
} from "lucide-react";
import { Route, RouteIcon } from "./types";

export const landingRoutes: Route[] = [
  {
    href: "#howitworks",
    label: "How it works",
  },
  {
    href: "#whycommunity",
    label: "Why Community",
  },
  {
    href: "#foradmins",
    label: "For admins",
  },
];

export const mainRoutes: RouteIcon[] = [
  {
    href: "/home",
    label: "Home",
    icon: HomeIcon,
  },
  {
    href: "/reports",
    label: "Reports",
    icon: FlagTriangleRightIcon,
  },
  {
    href: "/search",
    label: "Search",
    icon: SearchIcon,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: SettingsIcon,
  },
];

export const community_groups = [
  {
    color: "green",
    label: "Primville Ward 45",
  },
];

export const maxItems = 15;

export const contentLimit = 4;
