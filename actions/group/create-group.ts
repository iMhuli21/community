"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";
import { group, member, user } from "@/lib/db/schema";
import { CreateGroupSchema } from "@/lib/types";
import { generateSlug, getRandomPaletteColor } from "@/lib/utils";
import { createGroupFormSchema } from "@/lib/zod-schema";

export async function createGroupFn(values: CreateGroupSchema) {
  try {
    const session = await auth.getSession();

    if (!session?.data?.user.id) {
      return { error: "User not logged in." };
    }

    const data = createGroupFormSchema.safeParse(values);

    if (!data.success) {
      return { error: "Invalid data sent." };
    }

    const { cityMunicipality, description, name, suburb } = data.data;

    //check if user in db
    const findUser = await db.query.user.findFirst({
      where: (u, { eq }) => eq(u.userId, session.data?.user.id!),
    });

    //if no user create the user in the db then create group
    if (!findUser) {
      //create user
      await db.insert(user).values({
        name: session.data.user.name,
        email: session.data.user.email,
        userId: session.data.user.id,
      });
    }
    //create group
    const generatedSlug = generateSlug(name);

    console.log("creating group");

    const new_group = await db
      .insert(group)
      .values({
        city_municipality: cityMunicipality,
        description,
        name,
        suburb,
        color: getRandomPaletteColor(),
        creatorId: session.data.user.id,
        slug: generatedSlug,
      })
      .returning({ new_group_id: group.id, new_creator_id: group.creatorId });

    //make the user a member of the group and admin privellage
    await db.insert(member).values({
      group_id: new_group[0].new_group_id,
      user_id: new_group[0].new_creator_id,
      status: "Admin",
    });

    return {
      success: "Successfully created new group.",
    };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Unknown Error",
    };
  }
}
