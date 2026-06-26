import * as z from "zod";

import {
  createGroupFormSchema,
  signInFormSchema,
  signUpFormSchema,
} from "./zod-schema";
import { user } from "./db/schema";

export type SignUpFormSchema = z.infer<typeof signUpFormSchema>;
export type SignInFormSchema = z.infer<typeof signInFormSchema>;
export type CreateGroupSchema = z.infer<typeof createGroupFormSchema>;

export type Route = {
  href: string;
  label: string;
};

export type RouteIcon = {
  icon?: any;
} & Route;

//db
export type User = typeof user.$inferSelect;
