"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";
import { decision } from "@/lib/db/schema";
import { CreateReasoningSchema } from "@/lib/types";
import { createReasoningSchema } from "@/lib/zod-schema";

export async function rejectAppealFn({
  reportId,
  values,
}: {
  reportId: string;
  values: CreateReasoningSchema;
}) {
  const { data: session } = await auth.getSession();

  const validData = createReasoningSchema.safeParse(values);

  if (!session?.user?.id) {
    throw new Error("User not logged in");
  }

  if (reportId.trim().length === 0 || validData.error) {
    throw new Error("Invalid data sent.");
  }

  //find report
  const findReport = await db.query.report.findFirst({
    where: {
      id: reportId,
      group: {
        members: {
          userId: session.user.id,
        },
      },
    },
    with: {
      decision: true,
    },
  });

  //check if there is report
  if (!findReport) {
    throw new Error("Report not found...");
  }

  //check if a decision has been made already
  if (findReport.decision) {
    if (
      findReport.decision.status === "uphold" ||
      findReport.decision.status === "dismiss"
    ) {
      throw new Error("Decision has already been made.");
    }
  }

  const findMember = await db.query.member.findFirst({
    where: {
      userId: session.user.id,
      groupId: findReport.groupId,
    },
  });

  if (!findMember) {
    throw new Error("Member not found. Cannot complete action.");
  }

  if (findMember.status !== "Admin" && findMember.status !== "Mod") {
    throw new Error("Not authorized for this action.");
  }

  //make the decision
  const makeDecision = await db.insert(decision).values({
    reportId: findReport.id,
    memberId: findMember.id,
    status: "uphold",
    reasoning: validData.data.reasoning,
  });

  if (!makeDecision) {
    throw new Error("Something went wrong.");
  }

  return {
    success: "Successfully upheld flag.",
  };
}
