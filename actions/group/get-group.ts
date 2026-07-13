"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";

export async function getGroupFn(id: string) {
  const { data: session } = await auth.getSession();

  if (!session?.user.id) {
    return { error: "User not logged In.", data: null };
  }

  //find the group with the id
  const findGroup = await db.query.group.findFirst({
    where: (grp, { eq }) => eq(grp.id, id),
    with: {
      members: {
        columns: {
          status: true,
          user_id: true,
          id: true,
        },
      },
    },
  });

  if (!findGroup) {
    return { error: "Group does not exist.", data: null };
  }

  return { error: null, data: findGroup };
}
