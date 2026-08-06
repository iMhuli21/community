"use server";

import { auth } from "@/lib/auth/server";
import { maxItems } from "@/lib/constants";
import { db } from "@/lib/db/db";

export async function getCommentsFn({
  messageId,
  cursor,
}: {
  messageId: string;
  cursor?: string;
}) {
  const { data: session } = await auth.getSession();

  if (!session?.user?.id) {
    throw new Error("User not logged in.");
  }

  if (messageId.trim().length === 0) {
    throw new Error("Invalid data sent.");
  }

  const comments = await db.query.comment.findMany({
    where: {
      messageId,
      createdAt: {
        lt: cursor ? new Date(cursor) : undefined,
      },
    },
    limit: maxItems + 1,
    orderBy: {
      createdAt: "desc",
    },
    with: {
      member: {
        columns: {
          name: true,
          status: true,
          userId: true,
        },
      },
      likes: {
        with: {
          member: {
            columns: {
              userId: true,
            },
          },
        },
      },
    },
  });

  let nextCursor: string | undefined;

  if (comments.length > maxItems) {
    const next = comments.pop();
    nextCursor = next?.createdAt.toISOString();
  }

  return { comments, nextCursor };
}
