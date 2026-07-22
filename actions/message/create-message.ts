"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";
import { message } from "@/lib/db/schema";
import { CreateMessageSchema, MessageType } from "@/lib/types";
import { createMessageSchema } from "@/lib/zod-schema";

export async function sendMessageFn(
  values: CreateMessageSchema,
  groupId: string,
  messageType: MessageType,
  images: string[],
) {
  try {
    const { data: session } = await auth.getSession();

    if (!session?.user.id) {
      return {
        error: "User not logged in.",
      };
    }

    const validateData = createMessageSchema.safeParse(values);

    if (validateData.error || groupId.trim().length === 0) {
      return {
        error: "Invalid data sent.",
      };
    }

    //check if the user is in the group
    const isMember = await db.query.member.findFirst({
      where: {
        userId: session.user.id,
        groupId,
      },
    });

    if (!isMember) {
      return {
        error: "You are not a member of this group",
      };
    }

    const { message: body } = validateData.data;

    await db.insert(message).values({
      body,
      type: messageType,
      groupId,
      memberId: isMember.id,
      media: images,
    });

    return {
      success: "Message sent.",
    };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Unknown",
    };
  }
}
