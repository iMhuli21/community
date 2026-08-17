"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";
import { appeal } from "@/lib/db/schema";
import { CreateReasoningSchema } from "@/lib/types";
import { createReasoningSchema } from "@/lib/zod-schema";

export async function sendAppealFn({
  reportId,
  values,
}: {
  reportId: string;
  values: CreateReasoningSchema;
}) {
  const { data: session } = await auth.getSession();

  if (!session?.user?.id) {
    throw new Error("User not logged in.");
  }

  if (reportId.trim().length === 0) {
    throw new Error("Invalid data sent.");
  }

  const validData = createReasoningSchema.safeParse(values);

  if (validData?.error) {
    throw new Error("Invalid data sent.");
  }

  //find report
  const findReport = await db.query.report.findFirst({
    where: {
      id: reportId,
      message: {
        member: {
          userId: session.user.id,
        },
      },
    },
    with: {
      appeal: true,
      message: {
        columns: {
          memberId: true,
        },
      },
    },
  });

  if (!findReport) {
    throw new Error("Report not found.");
  }

  //check if they already made an appeal
  if (findReport.appeal) {
    throw new Error("Appeal already made");
  }

  const { reasoning } = validData.data;

  const makeAppeal = await db.insert(appeal).values({
    reasoning,
    memberId: findReport.memberId,
    reportId: findReport.id,
  });

  if (!makeAppeal) {
    throw new Error("Something went wrong");
  }

  return {
    success: "Successfully made appeal, wait for decision.",
  };
}
