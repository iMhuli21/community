"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";

export async function getModViewFlagPostsFn() {
  const { data: session } = await auth.getSession();

  if (!session?.user?.id) {
    throw new Error("User not logged in");
  }

  const flaggedMessages = await db.query.message.findMany({
    where: {
      isReported: true,
      group: {
        members: {
          userId: session.user.id,
          status: {
            OR: ["Admin", "Mod"],
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    with: {
      messageAttachments: true,
      report: {
        with: {
          appeal: true,
          member: {
            columns: {
              name: true,
            },
          },
          decision: {
            with: {
              member: {
                columns: {
                  name: true,
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
      member: {
        columns: {
          name: true,
        },
      },
    },
  });

  if (!flaggedMessages) {
    throw new Error("Something went wrong");
  }

  return flaggedMessages;
}
