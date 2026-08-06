"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";
import { comment } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function deleteCommentFn(commentId: string) {
  const { data: session } = await auth.getSession();

  if (!session?.user?.id) {
    throw new Error("User not logged in.");
  }

  if (commentId.trim().length === 0) {
    throw new Error("Invalid data sent.");
  }

  //find comment
  const findComment = await db.query.comment.findFirst({
    where: {
      id: commentId,
      member: {
        userId: session.user.id,
      },
    },
  });

  if (!findComment) {
    throw new Error("Cannot complete action...");
  }

  await db.delete(comment).where(eq(comment.id, commentId));

  return {
    success: "Successfully deleted comment.",
  };
}
