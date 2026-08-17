"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";

export async function getUserResolvedFlagsFn() {
  const { data: session } = await auth.getSession();

  if (!session?.user.id) {
    throw new Error("User not logged in.");
  }

  const resolved = await db.query.report.findMany({
    where: {
      message: {
        member: {
          userId: session.user.id,
        },
      },
    },
    with: {
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
      appeal: true,
      message: {
        columns: {
          id: true,
          body: true,
          media: true,
        },
        with: {
          messageAttachments: true,
        },
      },
      group: {
        columns: {
          name: true,
        },
      },
    },
  });

  if (!resolved) {
    throw new Error("Something went wrong.");
  }

  return resolved;
}
