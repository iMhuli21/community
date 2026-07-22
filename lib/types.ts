import * as z from "zod";

import {
  createGroupFormSchema,
  createMessageSchema,
  signInFormSchema,
  signUpFormSchema,
} from "./zod-schema";
import { group, member, message, messageType, user } from "./db/schema";

export type SignUpFormSchema = z.infer<typeof signUpFormSchema>;
export type SignInFormSchema = z.infer<typeof signInFormSchema>;
export type CreateGroupSchema = z.infer<typeof createGroupFormSchema>;
export type CreateMessageSchema = z.infer<typeof createMessageSchema>;

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
export type Message = typeof message.$inferSelect;

export type MessageType = (typeof messageType.enumValues)[number];
