"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function deleteAccountFn() {
  const { data: session } = await auth.getSession();

  if (!session?.user?.id) {
    throw new Error("User not logged in.");
  }

  const deleteAccount = await db
    .delete(user)
    .where(eq(user.userId, session.user.id));

  if (!deleteAccount) {
    throw new Error("Something went wrong.");
  }

  //make posts anonymous

  return {
    success: "Successfully deleted your account.",
  };
}
