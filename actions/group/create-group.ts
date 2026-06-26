"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";
import { group, user } from "@/lib/db/schema";
import { CreateGroupSchema } from "@/lib/types";
import { generateSlug } from "@/lib/utils";
import { createGroupFormSchema } from "@/lib/zod-schema";

export async function createGroupFn(values: CreateGroupSchema) {
  try {
    console.log("Checking auth");
    const session = await auth.getSession();

    if (!session?.data?.user.id) {
      return { error: "User not logged in." };
    }

    console.log("Checking values sent");

    const data = createGroupFormSchema.safeParse(values);

    if (!data.success) {
      return { error: "Invalid data sent." };
    }

    console.log("Extracting data from object");
    const { cityMunicipality, description, name, suburb } = data.data;

    console.log("Checking for user in db");
    //check if user in db
    const findUser = await db.query.user.findFirst({
      where: (u, { eq }) => eq(u.userId, session.data?.user.id!),
    });

    console.log("creating user");
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

    console.log("generating slug");
    const generatedSlug = generateSlug(name);

    console.log("creating group");
    await db.insert(group).values({
      city_municipality: cityMunicipality,
      description,
      name,
      suburb,
      creatorId: session.data.user.id,
      slug: generatedSlug,
    });

    return {
      success: "Successfully created new group.",
    };
  } catch (e) {
    console.log("////", typeof e, JSON.stringify(e)); // add this
    console.error(e);

    if (e instanceof Error) {
      return {
        error: e.message,
      };
    }

    return {
      error: "Unknown",
    };
  }
}
