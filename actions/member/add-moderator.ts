"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";
import { member } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function addModeratorFn({
  groupId,
  memberId,
}: {
  groupId: string;
  memberId: string;
}) {
  const { data: session } = await auth.getSession();

  if (!session?.user?.id) {
    throw new Error("User not logged in.");
  }

  if (groupId?.trim().length === 0 || memberId?.trim().length === 0) {
    throw new Error("Invalid data sent.");
  }

  //checking their status in the group
  const findLoggedInMember = await db.query.member.findFirst({
    where: {
      userId: session.user.id,
      groupId,
    },
  });

  if (!findLoggedInMember) {
    throw new Error("You are not part of this group.");
  }

  //check the contender is in the group
  const findContender = await db.query.member.findFirst({
    where: {
      id: memberId,
      groupId,
    },
  });

  if (!findContender) {
    throw new Error("Member not found");
  }

  //check if already admin or mod
  if (findContender.status === "Admin" || findContender.status === "Mod") {
    throw new Error("Already moderator.");
  }

  if (findLoggedInMember.status !== "Admin") {
    throw new Error("You dont have admin privelleges.");
  }

  //update the contenders status

  const updateStatus = await db
    .update(member)
    .set({
      status: "Mod",
    })
    .where(eq(member.id, findContender.id));

  if (!updateStatus) {
    throw new Error("Something went wrong.");
  }
  return {
    success: "Successfully added moderator status.",
  };
}
