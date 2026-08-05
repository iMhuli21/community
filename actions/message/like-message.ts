"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";
import { like } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function likeMessageFn({
  messageId,
  groupId,
}: {
  messageId: string;
  groupId: string;
}) {
  const { data: session } = await auth.getSession();

  if (!session?.user?.id) {
    throw new Error("User not logged in.");
  }

  if (messageId.trim().length === 0 || groupId.trim().length === 0) {
    throw new Error("Invalid data sent.");
  }

  //check if the user is part of the group
  const findMember = await db.query.member.findFirst({
    where: {
      userId: session.user.id,
      groupId,
    },
  });

  if (!findMember) {
    throw new Error("Cannot complete action, you have not joined this group");
  }

  //check if the user has liked the message yet if so unlike
  const alreadyLike = await db.query.like.findFirst({
    where: {
      memberId: findMember.id,
      messageId,
    },
  });

  if (alreadyLike) {
    //unlike
    await db.delete(like).where(eq(like.id, alreadyLike.id));

    return {
      success: "Unliked message.",
    };
  }

  //if they havent liked like the post
  await db.insert(like).values({
    memberId: findMember.id,
    messageId,
  });

  return {
    success: "Liked message.",
  };
}
