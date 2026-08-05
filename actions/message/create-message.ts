"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";
import { message, messageAttachments } from "@/lib/db/schema";
import { CreateMessageSchema, MessageType, UploadDocsType } from "@/lib/types";
import { createMessageSchema } from "@/lib/zod-schema";

interface SendMessage {
  values: CreateMessageSchema;
  groupId: string;
  messageType: MessageType;
  images: string[];
  docs: UploadDocsType[];
}

export async function sendMessageFn({
  values,
  groupId,
  messageType,
  images,
  docs,
}: SendMessage) {
  const { data: session } = await auth.getSession();

  if (!session?.user.id) {
    throw new Error("User not logged in");
  }

  const validateData = createMessageSchema.safeParse(values);

  if (validateData.error || groupId.trim().length === 0) {
    throw new Error("Invalid data sent.");
  }

  //check if the user is in the group
  const isMember = await db.query.member.findFirst({
    where: {
      userId: session.user.id,
      groupId,
    },
  });

  if (!isMember) {
    throw new Error("You are not a member of this group");
  }

  const { message: body } = validateData.data;

  const new_message = await db
    .insert(message)
    .values({
      body,
      type: messageType,
      groupId,
      memberId: isMember.id,
      media: images,
    })
    .returning({ message_id: message.id });

  if (docs.length > 0) {
    await db.insert(messageAttachments).values(
      docs.map((doc) => ({
        messageId: new_message[0].message_id,
        fileName: doc.name,
        fileSize: doc.size,
        fileType: doc.type,
        fileUrl: doc.ufsUrl,
        fileKey: doc.key,
      })),
    );
  }

  return {
    success: "Message sent.",
  };
}
