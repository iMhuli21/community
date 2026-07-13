import { defineRelations } from "drizzle-orm";
import { member, group, user } from "./schema";

export const relations = defineRelations({ user, member, group }, (r) => ({
  user: {
    groups: r.many.group(),
    memberships: r.many.member(),
  },
  member: {
    groups: r.one.group({
      from: r.member.group_id,
      to: r.group.id,
    }),
    user: r.one.user({
      from: r.member.user_id,
      to: r.user.userId,
    }),
  },
  group: {
    creator: r.one.user({
      from: r.group.creatorId,
      to: r.user.userId,
    }),
    members: r.many.member(),
  },
}));
