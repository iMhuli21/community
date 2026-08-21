"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";
import { poll } from "@/lib/db/schema";
import { CreatePollSchema, Option } from "@/lib/types";
import { createPollSchema } from "@/lib/zod-schema";

export async function createPollFn({
  options,
  values,
  groupId,
}: {
  values: CreatePollSchema;
  options: Option[];
  groupId: string;
}) {
  const { data: session } = await auth.getSession();

  if (!session?.user?.id) {
    throw new Error("User not logged in.");
  }

  if (options.length < 2) {
    throw new Error(
      "Invalid options. Options for the questions have to be a minimum of 2.",
    );
  }

  const validData = createPollSchema.safeParse(values);

  if (validData?.error || groupId.trim().length === 0) {
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
    throw new Error("Member not found...");
  }

  //check if they have the permissions to create poll
  if (findMember.status !== "Admin" && findMember.status !== "Mod") {
    throw new Error(
      "You do not have permission for this action. Ask a moderator to create a poll.",
    );
  }

  const { close_date, question } = validData.data;

  const currentDate = new Date();

  if (close_date === "In 1 day") {
    currentDate.setDate(currentDate.getDate() + 1);
  } else if (close_date === "In 3 days") {
    currentDate.setDate(currentDate.getDate() + 3);
  } else if (close_date === "In 1 week") {
    currentDate.setDate(currentDate.getDate() + 7);
  }

  //create poll
  const newPoll = await db.insert(poll).values({
    closeDate: currentDate,
    creatorId: findMember.id,
    title: question,
    options: options.map((option) => option.value),
    groupId,
  });

  if (!newPoll) {
    throw new Error("Something went wrong.");
  }

  return {
    success: "Successfully create poll.",
  };
}
