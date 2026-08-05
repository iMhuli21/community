import * as z from "zod";

import {
  createCommentSchema,
  createGroupFormSchema,
  createMessageSchema,
  signInFormSchema,
  signUpFormSchema,
} from "./zod-schema";
import {
  group,
  member,
  message,
  messageType,
  statusType,
  user,
} from "./db/schema";

export type SignUpFormSchema = z.infer<typeof signUpFormSchema>;
export type SignInFormSchema = z.infer<typeof signInFormSchema>;
export type CreateGroupSchema = z.infer<typeof createGroupFormSchema>;
export type CreateMessageSchema = z.infer<typeof createMessageSchema>;
export type CreateCommentSchema = z.infer<typeof createCommentSchema>;

export type Route = {
  href: string;
  label: string;
};

export type RouteIcon = {
  icon?: any;
} & Route;

//db
export type User = typeof user.$inferSelect;
export type Group = typeof group.$inferSelect;
export type Member = typeof member.$inferSelect;
export type Message = {
  body: string;
  id: string;
  createdAt: Date;
  memberId: string;
  status: "resolved" | "none";
  type: "report" | "notice" | "announcement" | "normal";
  groupId: string;
  media: string[];
  isUrgent: boolean;
  commentsCount: number;
  member: {
    id: string;
    userId: string;
    name: string;
    status: "Mod" | "Admin" | "Member";
  } | null;
  likes: {
    id: string;
    member: {
      userId: string;
    } | null;
  }[];
  messageAttachments: {
    id: string;
    fileName: string;
    fileKey: string;
    fileSize: number;
    fileType: string;
    fileUrl: string;
    messageId: string | null;
  }[];
  comments: {
    body: string;
    id: string;
    createdAt: Date;
    memberId: string;
    messageId: string;
    member: {
      name: string;
      status: "Mod" | "Admin" | "Member";
    } | null;
  }[];
};

export type MessageType = (typeof messageType.enumValues)[number];

export type StatusType = (typeof statusType.enumValues)[number];

export type UploadDocsType = {
  key: string;
  name: string;
  ufsUrl: string;
  size: number;
  type: string;
};
