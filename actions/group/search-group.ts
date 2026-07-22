"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";
import { member } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function searchGroupFn(query: string) {
  const { data: session } = await auth.getSession();

  if (!session?.user.id) {
    return { error: "User not logged in.", data: null };
  }

  const searchGroup = await db.query.group.findMany({
    where: {
      name: {
        ilike: `%${query}%`,
      },
    },
    with: {
      members: {
        columns: {
          id: true,
          status: true,
          userId: true,
        },
      },
    },
    extras: {
      membersCount: (table) => db.$count(member, eq(member.groupId, table.id)),
    },
  });

  return {
    error: null,
    data: searchGroup,
  };
}
