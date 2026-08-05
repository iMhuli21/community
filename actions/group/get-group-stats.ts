"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";
import { message } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export async function getGroupStatsFn(groupId: string) {
  const { data: session } = await auth.getSession();

  if (!session?.user?.id) {
    throw new Error("User not logged in.");
  }

  if (groupId.trim().length === 0) {
    throw new Error("Invalid data sent.");
  }

  //check  if group exists
  const findGroup = await db.query.group.findFirst({
    where: {
      id: groupId,
    },
  });

  if (!findGroup) {
    throw new Error("Group not found...");
  }

  //fetch the stats
  const [reports, resolvedReports] = await Promise.all([
    db.$count(
      message,
      and(
        eq(message.groupId, groupId),
        eq(message.type, "report"),
        eq(message.status, "none"),
      ),
    ),
    db.$count(
      message,
      and(
        eq(message.groupId, groupId),
        eq(message.type, "report"),
        eq(message.status, "resolved"),
      ),
    ),
  ]);

  return {
    reports,
    resolvedReports,
  };
}
