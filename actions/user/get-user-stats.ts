"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";
import { appeal, member } from "@/lib/db/schema";
import { and, eq, or } from "drizzle-orm";

export async function getUserStats() {
  const { data: session } = await auth.getSession();

  if (!session?.user?.id) {
    throw new Error("User not logged in.");
  }

  const [communities, moderating_communities, user] = await Promise.all([
    db.$count(member, eq(member.userId, session.user.id)),
    db.$count(
      member,
      and(
        eq(member.userId, session.user.id),
        or(eq(member.status, "Admin"), eq(member.status, "Mod")),
      ),
    ),
    db.query.user.findFirst({
      where: {
        userId: session.user.id,
      },
      columns: {
        createdAt: true,
      },
    }),
  ]);

  return { communities, moderating_communities, user };
}
