"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";
import { comment } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getMessageFn({ messageId }: { messageId: string }) {
  const { data: session } = await auth.getSession();

  if (!session?.user?.id) {
    throw new Error("User not logged in");
  }

  if (messageId.trim().length === 0) {
    throw new Error("Invalid data sent.");
  }

  //get the message
  const message = await db.query.message.findFirst({
    where: {
      id: messageId,
    },
    with: {
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
      group: {
        columns: {
          name: true,
          cityMunicipality: true,
        },
      },
      member: {
        columns: {
          name: true,
          userId: true,
        },
      },
    },
    extras: {
      commentsCount: (table) =>
        db.$count(comment, eq(comment.messageId, table.id)),
    },
  });

  if (!message) {
    throw new Error("Message not found.");
  }

  return message;
}
