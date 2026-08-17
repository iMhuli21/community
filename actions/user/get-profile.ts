"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";

export async function getProfileFn() {
  const { data: session } = await auth.getSession();

  if (!session?.user?.id) {
    throw new Error("User not logged in.");
  }

  const profileInfo = await db.query.user.findFirst({
    where: {
      userId: session.user.id,
    },
  });

  if (!profileInfo) {
    throw new Error("User not found...");
  }

  return profileInfo;
}
