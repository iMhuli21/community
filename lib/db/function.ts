"use server";

import { db } from "./db";
import { user } from "./schema";
import { auth } from "../auth/server";
import { cache } from "react";

export const ensureUserCreated = cache(async () => {
  const { data: session } = await auth.getSession();

  if (!session?.user.id) return null;

  await db
    .insert(user)
    .values({
      name: session.user.name,
      email: session.user.email,
      userId: session.user.id,
    })
    .onConflictDoNothing();

  return session.user.id;
});
