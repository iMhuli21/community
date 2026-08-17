"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";
import { message, report, reportType } from "@/lib/db/schema";
import { CreateReasonSchema } from "@/lib/types";
import { categories, createReasonSchema } from "@/lib/zod-schema";
import { eq } from "drizzle-orm";

export async function flagMessageFn({
  messageId,
  values,
  groupId,
}: {
  messageId: string;
  values: CreateReasonSchema;
  groupId: string;
}) {
  const { data: session } = await auth.getSession();

  if (!session?.user?.id) {
    throw new Error("User not logged in.");
  }

  if (messageId.trim().length === 0) {
    throw new Error("Invalid data sent.");
  }

  const validData = createReasonSchema.safeParse(values);

  if (validData?.error) {
    throw new Error("Invalid data sent.");
  }

  //check if the person flagging the message is a member of the group
  const findMember = await db.query.member.findFirst({
    where: {
      userId: session.user.id,
      groupId,
    },
    columns: {
      id: true,
    },
  });

  if (!findMember) {
    throw new Error("Member not found..");
  }

  //the message has already been flagged
  const findMessage = await db.query.message.findFirst({
    where: {
      id: messageId,
    },
  });

  if (!findMessage) {
    throw new Error("Message not found...");
  }

  if (findMessage.isReported === true) {
    throw new Error("Message has already been flagged.");
  }

  const { reason } = validData.data;

  const flagMessage = await db.insert(report).values({
    memberId: findMember.id,
    reason: reason as (typeof reportType.enumValues)[number],
    messageId: findMessage.id,
    groupId,
  });

  if (!flagMessage) {
    throw new Error("Something went wrong.");
  }

  //mark the message
  const updatedMessage = await db
    .update(message)
    .set({
      isReported: true,
    })
    .where(eq(message.id, messageId));

  if (!updatedMessage) {
    throw new Error("Something went wrong.");
  }

  return {
    success: "Flagged message.",
  };
}
