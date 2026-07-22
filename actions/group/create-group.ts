"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";
import { group, member, user } from "@/lib/db/schema";
import { CreateGroupSchema } from "@/lib/types";
import { generateSlug, getRandomPaletteColor } from "@/lib/utils";
import { createGroupFormSchema } from "@/lib/zod-schema";

export async function createGroupFn(values: CreateGroupSchema) {
  try {
    const { data: session } = await auth.getSession();

    if (!session?.user.id) {
      return { error: "User not logged in." };
    }

    const data = createGroupFormSchema.safeParse(values);

    if (!data.success) {
      return { error: "Invalid data sent." };
    }

    const { cityMunicipality, description, name, suburb } = data.data;

    //check if user in db
    const findUser = await db.query.user.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    //if no user create the user in the db then create group
    if (!findUser) {
      //create user
      await db.insert(user).values({
        name: session.user.name,
        email: session.user.email,
        userId: session.user.id,
      });
    }
    //create group
    const generatedSlug = generateSlug(name);

    console.log("creating group");

    const new_group = await db
      .insert(group)
      .values({
        cityMunicipality: cityMunicipality,
        description,
        name,
        suburbArea: suburb,
        color: getRandomPaletteColor(),
        creatorId: session.user.id,
        slug: generatedSlug,
      })
      .returning({ new_group_id: group.id, new_creator_id: group.creatorId });

    //make the user a member of the group and admin privellage
    await db.insert(member).values({
      groupId: new_group[0].new_group_id,
      userId: new_group[0].new_creator_id,
      status: "Admin",
      name: session.user.name,
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
