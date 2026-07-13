"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";
import { group, member } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getGroupsFn(limit: number) {
  try {
    const { data: session } = await auth.getSession();

    if (!session?.user.id) {
      return {
        error: "User not logged in.",
      };
    }

    const groups = await db.query.group.findMany({
      where: {
        creatorId: session.user.id,
      },
      limit,
      extras: {
        membersCount: (table) =>
          db.$count(member, eq(member.group_id, table.id)),
      },
      with: {
        members: {
          columns: {
            id: true,
            status: true,
            user_id: true,
          },
        },
      },
    });

    return {
      groups,
    };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Unknown Error",
    };
  }
}

export async function getGroupsCountFn() {
  try {
    const { data: session } = await auth.getSession();

    if (!session?.user.id) {
      return {
        error: "User not logged in.",
      };
    }

    const groupsCount = await db.$count(
      member,
      eq(member.user_id, session.user.id),
    );

    console.log(session.user.id);

    return {
      count: groupsCount,
    };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Unknown",
    };
  }
}

export async function getJoinedGroupsFn(limit: number) {
  try {
    const { data: session } = await auth.getSession();

    if (!session?.user.id) {
      return {
        error: "User not logged in.",
        data: null,
      };
    }

    //get the groups the logged in user has joined
    const joined_groups = await db.query.group.findMany({
      with: {
        members: {
          where: {
            user_id: session.user.id,
          },
          columns: {
            id: true,
            status: true,
            user_id: true,
          },
        },
      },
      limit,
      extras: {
        membersCount: (table) =>
          db.$count(member, eq(member.group_id, table.id)),
      },
    });

    return {
      error: null,
      data: joined_groups,
    };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Unknown",
      data: null,
    };
  }
}
