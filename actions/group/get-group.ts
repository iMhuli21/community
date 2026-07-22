"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";
import { member } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getGroupFn(id: string) {
  const { data: session } = await auth.getSession();

  if (!session?.user.id) {
    return { error: "User not logged In.", data: null };
  }

  //find the group with the id
  const findGroup = await db.query.group.findFirst({
    where: {
      id,
    },
    with: {
      members: {
        columns: {
          status: true,
          userId: true,
          id: true,
        },
      },
    },
    extras: {
      membersCount: (table) => db.$count(member, eq(member.groupId, table.id)),
    },
  });

  if (!findGroup) {
    return { error: "Group does not exist.", data: null };
  }

  return { error: null, data: findGroup };
}
