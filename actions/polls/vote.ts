"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/db";
import { poll, vote } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function voteFn({
  groupId,
  pollId,
  value,
}: {
  groupId: string;
  pollId: string;
  value: string;
}) {
  const { data: session } = await auth.getSession();

  if (!session?.user?.id) {
    throw new Error("User not logged in.");
  }

  if (
    groupId.trim().length === 0 ||
    pollId.trim().length === 0 ||
    value.trim().length === 0
  ) {
    throw new Error("Invalid data sent.");
  }

  //find Member

  const findMember = await db.query.member.findFirst({
    where: {
      userId: session.user.id,
      groupId,
    },
  });

  if (!findMember) {
    throw new Error("Member not found.");
  }

  //check if member has already voted
  const alreadyVoted = await db.query.vote.findFirst({
    where: {
      pollId,
      voterId: findMember.id,
    },
  });

  if (alreadyVoted) {
    throw new Error("Already voted.");
  }

  //check if it is a valid Poll
  const realPoll = await db.query.poll.findFirst({
    where: {
      id: pollId,
    },
  });

  if (!realPoll) {
    throw new Error("Poll does not exist.");
  }

  //check if it is past the close date
  if (new Date() > realPoll.closeDate) {
    throw new Error("Cannot vote poll has been closed.");
  }

  const newVote = await db.insert(vote).values({
    pollId,
    vote: value,
    voterId: findMember.id,
  });

  if (!newVote) {
    throw new Error("Something went wrong");
  }

  //update the voteCount

  const updateVoteCount = await db
    .update(poll)
    .set({
      votesCount: (realPoll?.votesCount as number) + 1,
    })
    .where(eq(poll.id, pollId));

  if (!updateVoteCount) {
    throw new Error("Something went wrong.");
  }

  return {
    success: "Sent vote.",
  };
}
