"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";
import { member } from "@/lib/db/schema";

export async function joinGroupFn(groupId: string) {
  try {
    const { data: session } = await auth.getSession();

    if (!session?.user.id) {
      return {
        error: "User not logged in.",
      };
    }

    await db
      .insert(member)
      .values({
        groupId: groupId,
        userId: session.user.id,
        name: session.user.name,
      })
      .onConflictDoNothing();

    return {
      success: "Successfully joined group.",
    };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Unknown",
    };
  }
}
