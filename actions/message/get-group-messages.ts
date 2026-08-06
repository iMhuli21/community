"use server";

import { auth } from "@/lib/auth/server";
import { maxItems } from "@/lib/constants";
import { db } from "@/lib/db/db";
import { comment } from "@/lib/db/schema";
import { eq, lt } from "drizzle-orm";

export async function getGroupMessagesFn({
  groupId,
  cursor,
}: {
  groupId: string;
  cursor?: string;
}) {
  const { data: session } = await auth.getSession();

  if (!session?.user.id) {
    throw new Error("User not logged in.");
  }

  if (!groupId.trim()) {
    throw new Error("Invalid data sent.");
  }

  //get messages
  const messages = await db.query.message.findMany({
    where: {
      groupId,
      createdAt: {
        lt: cursor ? new Date(cursor) : undefined,
      },
    },
    with: {
      member: {
        columns: {
          id: true,
          status: true,
          name: true,
          userId: true,
        },
      },
      likes: {
        columns: {
          id: true,
        },
        with: {
          member: {
            columns: {
              userId: true,
            },
          },
        },
      },
      messageAttachments: true,

      comments: {
        limit: 2,
        orderBy: {
          createdAt: "desc",
        },
        with: {
          member: {
            columns: {
              status: true,
              name: true,
              userId: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    extras: {
      commentsCount: (table) =>
        db.$count(comment, eq(comment.messageId, table.id)),
    },
    limit: maxItems + 1,
  });

  let nextCursor: string | undefined;

  if (messages.length > maxItems) {
    const next = messages.pop();
    nextCursor = next?.createdAt.toISOString();
  }

  return { messages, nextCursor };
}
