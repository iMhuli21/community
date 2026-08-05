"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";
import { message } from "@/lib/db/schema";
import { CreateMessageSchema, MessageType } from "@/lib/types";
import { createMessageSchema } from "@/lib/zod-schema";
import { eq } from "drizzle-orm";

interface UpdateMessage {
  data: CreateMessageSchema;
  toggle: MessageType;
  files: string[];
  messageId: string;
}

export async function markMessageAsUrgentFn(messageId: string) {
  const { data: session } = await auth.getSession();

  if (!session?.user?.id) {
    throw new Error("User not logged in.");
  }

  if (messageId.trim().length === 0) {
    throw new Error("Invalid data sent.");
  }

  //check if user has permission to mark message as urgent
  const hasPrivelleges = await db.query.member.findFirst({
    where: {
      userId: session.user.id,
    },
  });

  if (!hasPrivelleges) {
    throw new Error("You are not part of this group");
  }

  if (hasPrivelleges.status !== "Admin" && hasPrivelleges.status !== "Mod") {
    throw new Error("You do not have permission for this action.");
  }

  //check if the message has already been made urgent
  const getMessage = await db.query.message.findFirst({
    where: {
      id: messageId,
    },
    columns: {
      isUrgent: true,
    },
  });

  if (!getMessage) {
    throw new Error("Message not found.");
  }
  if (getMessage.isUrgent) {
    throw new Error("Message already marked urgent.");
  }

  await db
    .update(message)
    .set({
      isUrgent: true,
    })
    .where(eq(message.id, messageId));

  return {
    success: "Successfully marked as urgent.",
  };
}

export async function markMessageAsResolvedFn(messageId: string) {
  const { data: session } = await auth.getSession();

  if (!session?.user?.id) {
    throw new Error("User not logged in");
  }

  if (messageId.trim().length === 0) {
    throw new Error("Invalid data sent.");
  }

  //check if user has permission to mark message as resolved
  const hasPrivelleges = await db.query.member.findFirst({
    where: {
      userId: session.user.id,
    },
  });

  if (!hasPrivelleges) {
    throw new Error("You are not part of this group.");
  }

  if (hasPrivelleges.status !== "Admin" && hasPrivelleges.status !== "Mod") {
    throw new Error("You do not have permission for this action.");
  }

  //check if it is a report
  const getMessage = await db.query.message.findFirst({
    where: {
      id: messageId,
      type: "report",
    },
  });

  if (!getMessage) {
    throw new Error("Message is not a report");
  }

  //check if it is already resolved
  if (getMessage.status === "resolved") {
    throw new Error("Report has already been resolved.");
  }

  await db
    .update(message)
    .set({
      status: "resolved",
    })
    .where(eq(message.id, messageId));

  return {
    success: "Successfully marked as resolved.",
  };
}

export async function updateMessageFn({
  data,
  toggle,
  files,
  messageId,
}: UpdateMessage) {
  const { data: session } = await auth.getSession();

  if (!session?.user?.id) {
    throw new Error("User not logged in.");
  }

  if (messageId.trim().length === 0) {
    throw new Error("Invalid data sent.");
  }

  const validData = createMessageSchema.safeParse(data);

  if (validData.error) {
    throw new Error("Invalid data sent.");
  }

  //check if the message was created by the logged in user.
  const getMessage = await db.query.message.findFirst({
    where: {
      id: messageId,
    },
    with: {
      member: {
        columns: {
          userId: true,
        },
      },
    },
    columns: {
      id: true,
    },
  });

  if (!getMessage) {
    throw new Error("Cannot update message.");
  }

  //update the message
  await db
    .update(message)
    .set({
      body: validData.data.message,
      media: files,
      type: toggle,
    })
    .where(eq(message.id, messageId));

  return {
    success: "Successfully updated message.",
  };
}
