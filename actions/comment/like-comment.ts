"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";
import { like, likeComment } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function likeCommentFn({
  commentId,
  messageId,
}: {
  commentId: string;
  messageId: string;
}) {
  const { data: session } = await auth.getSession();

  if (!session?.user?.id) {
    throw new Error("User not logged in.");
  }

  if (commentId.trim().length === 0 || messageId.trim().length === 0) {
    throw new Error("Invalid data sent.");
  }

  //find the message
  const findMessage = await db.query.message.findFirst({
    where: {
      id: messageId,
    },
  });

  if (!findMessage) {
    throw new Error("Message not found");
  }

  //check if they are still part of the group
  const findMember = await db.query.member.findFirst({
    where: {
      userId: session.user.id,
      groupId: findMessage.groupId,
    },
  });

  if (!findMember) {
    throw new Error("Cannot complete action, you have not joined this group");
  }

  //check if the user has liked the comment yet if so unlike
  const alreadyLike = await db.query.likeComment.findFirst({
    where: {
      memberId: findMember.id,
      commentId,
    },
  });

  if (alreadyLike) {
    //unlike
    await db.delete(likeComment).where(eq(like.id, alreadyLike.id));

    return {
      success: "Unliked comment.",
    };
  }

  //if they havent liked like the post
  await db.insert(likeComment).values({
    memberId: findMember.id,
    commentId,
  });

  return {
    success: "Liked comment.",
  };
}
