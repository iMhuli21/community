"use server";

import { auth } from "@/lib/auth/server";
import { maxItems } from "@/lib/constants";
import { db } from "@/lib/db/db";

export async function getAllMembersFn({
  groupId,
  cursor,
}: {
  groupId: string;
  cursor?: string;
}) {
  const { data: session } = await auth.getSession();

  if (!session?.user?.id) {
    throw new Error("User not logged in");
  }

  if (groupId.trim().length === 0) {
    throw new Error("Invalid data sent.");
  }

  const members = await db.query.member.findMany({
    where: {
      groupId,
      joinedAt: {
        lt: cursor ? new Date(cursor) : undefined,
      },
    },
    limit: maxItems + 1,
  });

  let nextCursor: string | undefined;

  if (members.length > maxItems) {
    const next = members.pop();
    nextCursor = next?.joinedAt.toISOString();
  }

  return { members, nextCursor };
}
