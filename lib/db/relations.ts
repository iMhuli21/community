import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  accountInNeonAuth: {
    userInNeonAuth: r.one.userInNeonAuth({
      from: r.accountInNeonAuth.userId,
      to: r.userInNeonAuth.id,
    }),
  },
  userInNeonAuth: {
    accountInNeonAuths: r.many.accountInNeonAuth(),
    organizationInNeonAuthsViaInvitationInNeonAuth:
      r.many.organizationInNeonAuth({
        from: r.userInNeonAuth.id.through(r.invitationInNeonAuth.inviterId),
        to: r.organizationInNeonAuth.id.through(
          r.invitationInNeonAuth.organizationId,
        ),
        alias:
          "userInNeonAuth_id_organizationInNeonAuth_id_via_invitationInNeonAuth",
      }),
    organizationInNeonAuthsViaMemberInNeonAuth: r.many.organizationInNeonAuth({
      alias: "organizationInNeonAuth_id_userInNeonAuth_id_via_memberInNeonAuth",
    }),
    sessionInNeonAuths: r.many.sessionInNeonAuth(),
  },
  organizationInNeonAuth: {
    userInNeonAuthsViaInvitationInNeonAuth: r.many.userInNeonAuth({
      alias:
        "userInNeonAuth_id_organizationInNeonAuth_id_via_invitationInNeonAuth",
    }),
    userInNeonAuthsViaMemberInNeonAuth: r.many.userInNeonAuth({
      from: r.organizationInNeonAuth.id.through(
        r.memberInNeonAuth.organizationId,
      ),
      to: r.userInNeonAuth.id.through(r.memberInNeonAuth.userId),
      alias: "organizationInNeonAuth_id_userInNeonAuth_id_via_memberInNeonAuth",
    }),
  },
  sessionInNeonAuth: {
    userInNeonAuth: r.one.userInNeonAuth({
      from: r.sessionInNeonAuth.userId,
      to: r.userInNeonAuth.id,
    }),
  },

  user: {
    groups: r.many.group({
      from: r.user.userId,
      to: r.group.creatorId,
    }),
    memberships: r.many.member({
      from: r.user.userId,
      to: r.member.userId,
    }),
  },

  group: {
    author: r.one.user({
      from: r.group.creatorId,
      to: r.user.userId,
    }),
    members: r.many.member({
      from: r.group.id,
      to: r.member.groupId,
    }),
    messages: r.many.message({
      from: r.group.id,
      to: r.message.groupId,
    }),
  },

  member: {
    group: r.one.group({
      from: r.member.groupId,
      to: r.group.id,
    }),
    user: r.one.user({
      from: r.member.userId,
      to: r.user.userId,
    }),
    messages: r.many.message({
      from: r.member.id,
      to: r.message.memberId,
    }),
  },

  message: {
    member: r.one.member({
      from: r.message.memberId,
      to: r.member.id,
    }),
    group: r.one.group({
      from: r.message.groupId,
      to: r.group.id,
    }),
  },
}));
