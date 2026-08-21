"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";
import { member } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getGroupsFn(limit: number) {
  const { data: session } = await auth.getSession();

  if (!session?.user.id) {
    throw new Error("User not logged in.");
  }

  const groups = await db.query.group.findMany({
    where: {
      creatorId: session.user.id,
    },
    limit,
    extras: {
      membersCount: (table) => db.$count(member, eq(member.groupId, table.id)),
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
  });

  return groups;
}

export async function getGroupsCountFn() {
  const { data: session } = await auth.getSession();

  if (!session?.user.id) {
    throw new Error("User not logged in.");
  }

  const groupsCount = await db.$count(
    member,
    eq(member.userId, session.user.id),
  );

  return groupsCount;
}

export async function getJoinedGroupsFn(limit: number) {
  const { data: session } = await auth.getSession();

  if (!session?.user.id) {
    throw new Error("User not logged in.");
  }

  //get the groups the logged in user has joined
  const joined_groups = await db.query.member.findMany({
    where: {
      userId: session.user.id,
    },
    with: {
      group: {
        extras: {
          membersCount: (table) =>
            db.$count(member, eq(member.groupId, table.id)),
        },
      },
    },
    columns: {
      id: true,
      status: true,
      userId: true,
    },
    limit,
  });

  return joined_groups;
}
