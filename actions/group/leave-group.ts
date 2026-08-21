"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";
import { member } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function leaveGroupFn(groupId: string) {
  const { data: session } = await auth.getSession();

  if (!session?.user.id) {
    throw new Error("User not logged in.");
  }

  if (groupId.trim().length === 0) {
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

  //get the anon info
  const anonID = process.env.ANONYMOUS_USER_ID;
  const anonName = process.env.ANONYMOUS_USER_NAME;

  //update the member info to anon to keep the messages
  const updateMember = await db
    .update(member)
    .set({
      name: anonName,
      userId: anonID,
    })
    .where(eq(member.id, findMember.id));

  if (!updateMember) {
    throw new Error("Something went wrong.");
  }

  return {
    success: "Successfully left group.",
  };
}
