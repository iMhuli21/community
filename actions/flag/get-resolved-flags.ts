"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";

export async function getResolvedFlagsFn() {
  const { data: session } = await auth.getSession();

  if (!session?.user.id) {
    throw new Error("User not logged in.");
  }

  const resolved = await db.query.report.findMany({
    where: {
      group: {
        members: {
          userId: session.user.id,
          status: {
            OR: ["Admin", "Mod"],
          },
        },
      },
    },
    with: {
      decision: {
        with: {
          member: {
            columns: {
              name: true,
            },
          },
        },
      },
      appeal: true,
    },
  });

  if (!resolved) {
    throw new Error("Something went wrong.");
  }

  return resolved;
}
