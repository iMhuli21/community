"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";

export async function hasPermissionFn(groupId?: string) {
  const { data: session } = await auth.getSession();

  if (!session?.user?.id) {
    throw new Error("User not logged in.");
  }

  if (groupId?.trim().length === 0) {
    throw new Error("Invalid data sent.");
  }

  //checking their status in the group
  const findMember = await db.query.member.findFirst({
    where: {
      userId: session.user.id,
      groupId,
    },
  });

  if (!findMember) {
    throw new Error("You are not part of this group.");
  }

  if (findMember.status === "Admin" || findMember.status === "Mod") {
    return {
      status: true,
    };
  }

  return {
    status: false,
  };
}
