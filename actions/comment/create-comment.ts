"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";
import { comment } from "@/lib/db/schema";
import { CreateCommentSchema } from "@/lib/types";
import { createCommentSchema } from "@/lib/zod-schema";

interface Arguments {
  values: CreateCommentSchema;
  messageId: string;
  groupId: string;
}

export async function createCommentFn({
  messageId,
  values,
  groupId,
}: Arguments) {
  const { data: session } = await auth.getSession();

  if (!session?.user?.id) {
    throw new Error("User not logged in.");
  }
  const validData = createCommentSchema.safeParse(values);

  if (
    messageId.trim().length === 0 ||
    validData.error ||
    groupId.trim().length === 0
  ) {
    throw new Error("Invalid data sent.");
  }

  //find member
  const findMember = await db.query.member.findFirst({
    where: {
      userId: session.user.id,
      groupId,
    },
  });

  if (!findMember) {
    throw new Error("Cannot complete action, you havent joined this group.");
  }

  await db.insert(comment).values({
    body: validData.data.comment,
    memberId: findMember.id,
    messageId,
  });

  return {
    success: "Comment saved.",
  };
}
