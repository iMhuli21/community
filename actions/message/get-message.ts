"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";

export async function getMessageFn(messageId: string) {
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
  });

  if (!message) {
    throw new Error("Message not found.");
  }
  return message;
}
