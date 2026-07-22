"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";

export async function getGroupMessagesFn(groupId: string) {
  try {
    const { data: session } = await auth.getSession();

    if (!session?.user.id) {
      return {
        error: "User not logged in.",
        messages: null,
      };
    }

    if (!groupId.trim()) {
      return {
        error: "Invalid data sent.",
        messages: null,
      };
    }

    //get messages
    const messages = await db.query.message.findMany({
      where: {
        groupId,
      },
      with: {
        member: {
          columns: {
            id: true,
            status: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { error: null, messages };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Unknown",
      messages: null,
    };
  }
}
