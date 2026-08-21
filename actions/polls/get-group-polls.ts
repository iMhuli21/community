"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";

export async function getGroupPollsFn(groupId: string) {
  const { data: session } = await auth.getSession();

  if (!session?.user?.id) {
    throw new Error("User not logged in.");
  }

  if (groupId.trim().length === 0) {
    throw new Error("Invalid data sent.");
  }

  const polls = await db.query.poll.findMany({
    where: {
      groupId,
    },
    with: {
      creator: {
        columns: {
          name: true,
          status: true,
        },
      },
      votes: {
        with: {
          voter: {
            columns: {
              userId: true,
            },
          },
        },
      },
    },
  });

  if (!polls) {
    throw new Error("Something went wrong");
  }

  return polls;
}
