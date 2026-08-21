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
    href: "/flags",
    label: "Flags",
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

export const flagCategories = [
  {
    label: "Harassment or Bullying",
    value: "harassment_bullying",
    description:
      "Insults, targeted abuse, intimidation, or repeated unwanted behaviour",
  },
  {
    label: "Hate Speech",
    value: "hate_speech",
    description:
      "Attacks or degrading content targeting someone based on protected characteristics.",
  },
  {
    label: "Threats or Violence",
    value: "threats_violence",
    description:
      "Threats of harm, encouragement of violence, or content promoting violent acts.",
  },
  {
    label: "Misinformation",
    value: "misinformation",
    description:
      "False or misleading information presented as fact, especially when it could cause harm.",
  },
  {
    label: "Spam or Unwanted Content",
    value: "spam_unwanted",
    description:
      "Repetitve messages, unsolicited promotions, mass messaging, or irrelevant content.",
  },
  {
    label: "Scam or Fraud",
    value: "scam_fraud",
    description:
      "Attempts to decieve users for money, credentials, personal information, or other benefits",
  },
  {
    label: "Sexual or Explicit Content",
    value: "sexual_explicit",
    description:
      "Unwanted sexual content, explicit material, or inappropriate sexual messages.",
  },
  {
    label: "Child Safety",
    value: "child_safety",
    description:
      "Content involving the sexual exploitation, abuse, or endangerment of minors.",
  },
  {
    label: "Self-Harm",
    value: "self_harm",
    description:
      "Content encouraging, glorifying, or facilitating self-harm or suicide",
  },
  {
    label: "Illegal Activity",
    value: "illegal",
    description: "Content promoting or facilitating illegal activities",
  },
  {
    label: "Privacy Violation",
    value: "privacy_violation",
    description:
      "Sharing someone's private information, personal details, or content without permission.",
  },
  {
    label: "Impersonation",
    value: "impersonation",
    description:
      "Pretending to be another person, organization, or public figure",
  },
  {
    label: "Malicious or Dangerous Content",
    value: "malicious",
    description:
      "Content intendded to harm users, compromise devices/accounts, or facilitate dangerous activities.",
  },
  {
    label: "Copyright or intellectual Property",
    value: "copyright",
    description:
      "Unauthorized sharing or use of copyrighted material or intellectual property",
  },
  {
    label: "Other",
    value: "other",
    description:
      "Something that violates the platform's rules but doesn't fit the categories above",
  },
];

export const maxItems = 7;

export const contentLimit = 4;

export const sideBarLimit = 6;

export const voting_close_times = ["In 1 day", "In 3 days", "In 1 week"];
