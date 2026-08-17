"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";
import { member, user, userInNeonAuth } from "@/lib/db/schema";
import {
  EditEmailSchema,
  EditPasswordSchema,
  EditProfileSchema,
} from "@/lib/types";
import {
  editEmailSchema,
  editPasswordSchema,
  editProfileSchema,
} from "@/lib/zod-schema";
import { eq } from "drizzle-orm";

export async function updateProfileFn(values: EditProfileSchema) {
  const { data: session } = await auth.getSession();

  if (!session?.user?.id) {
    throw new Error("User not logged in.");
  }

  const validData = editProfileSchema.safeParse(values);

  if (validData?.error) {
    throw new Error("Invalid data sent.");
  }

  const { name, location } = validData.data;

  const updateProfile = await db
    .update(user)
    .set({
      name,
      location,
    })
    .where(eq(user.userId, session.user.id));

  if (!updateProfile) {
    throw new Error("Something went wrong.");
  }

  //update every member db
  const updateMemberInfo = await db
    .update(member)
    .set({
      name,
    })
    .where(eq(member.userId, session.user.id));

  if (!updateMemberInfo) {
    throw new Error("Something went wrong.");
  }

  const updateNeonAuth = await db
    .update(userInNeonAuth)
    .set({
      name,
    })
    .where(eq(userInNeonAuth.id, session.user.id));

  if (!updateNeonAuth) {
    throw new Error("Something went wrong.");
  }

  await auth.updateUser({
    name,
  });

  return {
    success: "Successfully updated profile.",
  };
}

export async function updateEmailFn(values: EditEmailSchema) {
  const { data: session } = await auth.getSession();

  if (!session?.user?.id) {
    throw new Error("User not logged in.");
  }

  const validData = editEmailSchema.safeParse(values);

  if (validData?.error) {
    throw new Error("Invalid data sent.");
  }

  const { email } = validData.data;

  const updateEmail = await db
    .update(user)
    .set({
      email,
    })
    .where(eq(user.userId, session.user.id));

  if (!updateEmail) {
    throw new Error("Something went wrong.");
  }

  const updateNeonAuth = await db
    .update(userInNeonAuth)
    .set({
      email,
    })
    .where(eq(userInNeonAuth.id, session.user.id));

  if (!updateNeonAuth) {
    throw new Error("Something went wrong.");
  }

  await auth.signOut();

  return {
    success: "Successfully updated email.",
  };
}

export async function updatePasswordFn(values: EditPasswordSchema) {
  const { data: session } = await auth.getSession();

  if (!session?.user?.id) {
    throw new Error("User not logged in.");
  }

  const validData = editPasswordSchema.safeParse(values);

  if (validData?.error) {
    throw new Error("Invalid data sent.");
  }

  const { newPassword, oldPassword } = validData.data;

  const updatePassword = await auth.changePassword({
    currentPassword: oldPassword,
    newPassword,
    revokeOtherSessions: true,
  });

  if (!updatePassword) {
    throw new Error("Something went wrong.");
  }

  await auth.signOut();

  return {
    success: "Successfully updated password.",
  };
}
