"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";

export async function getUserFlaggedPostFn() {
  const { data: session } = await auth.getSession();

  if (!session?.user?.id) {
    throw new Error("User not logged in.");
  }

  //get all the messages the user posted that are flagged
  const flaggedPosts = await db.query.message.findMany({
    where: {
      isReported: true,
      member: {
        userId: session.user.id,
      },
    },
    with: {
      messageAttachments: true,
      report: {
        with: {
          appeal: true,
          decision: {
            with: {
              member: {
                columns: {
                  name: true,
                  status: true,
                },
              },
            },
          },
        },
      },
      group: {
        columns: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!flaggedPosts) {
    throw new Error("Something went wrong");
  }

  return flaggedPosts;
}
