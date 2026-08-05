"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";
import { message } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function deleteMessageFn(messageId: string) {
  const { data: session } = await auth.getSession();

  if (!session?.user?.id) {
    throw new Error("User not logged in,");
  }

  if (messageId.trim().length === 0) {
    throw new Error("Invalid data sent.");
  }

  //member
  const findMember = await db.query.member.findFirst({
    where: {
      userId: session.user.id,
    },
  });

  if (!findMember) {
    throw new Error("You are haven't joined this group yet.");
  }

  //check if they sent the message
  const findMessage = await db.query.message.findFirst({
    where: {
      id: messageId,
      memberId: findMember.id,
    },
  });

  if (!findMessage) {
    throw new Error("Cannot complete action.");
  }

  await db.delete(message).where(eq(message.id, findMessage.id));

  return {
    success: "Successfully deleted the message.",
  };
}
