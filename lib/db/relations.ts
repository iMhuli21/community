import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";
import { report } from "process";

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
    reports: r.many.report({
      from: r.group.id,
      to: r.report.groupId,
    }),
  },

  member: {
    group: r.one.group({
      from: r.member.groupId,
      to: r.group.id,
    }),
    reports: r.many.report({
      from: r.member.id,
      to: r.report.memberId,
    }),
    decisions: r.many.decision({
      from: r.member.id,
      to: r.decision.memberId,
    }),
    appeals: r.many.appeal({
      from: r.member.id,
      to: r.appeal.memberId,
    }),
    user: r.one.user({
      from: r.member.userId,
      to: r.user.userId,
    }),
    messages: r.many.message({
      from: r.member.id,
      to: r.message.memberId,
    }),
    likes: r.many.like({
      from: r.member.id,
      to: r.like.memberId,
    }),
    commentLikes: r.many.likeComment({
      from: r.member.id,
      to: r.likeComment.memberId,
    }),
    comments: r.many.comment({
      from: r.member.id,
      to: r.comment.memberId,
    }),
    replies: r.many.reply({
      from: r.member.id,
      to: r.reply.memberId,
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
    likes: r.many.like({
      from: r.message.id,
      to: r.like.messageId,
    }),
    comments: r.many.comment({
      from: r.message.id,
      to: r.comment.messageId,
    }),
    messageAttachments: r.many.messageAttachments({
      from: r.message.id,
      to: r.messageAttachments.messageId,
    }),
    report: r.one.report({
      from: r.message.id,
      to: r.report.messageId,
    }),
  },

  messageAttachments: {
    message: r.one.message({
      from: r.messageAttachments.messageId,
      to: r.message.id,
    }),
  },

  like: {
    member: r.one.member({
      from: r.like.memberId,
      to: r.member.id,
    }),
    message: r.one.message({
      from: r.like.messageId,
      to: r.message.id,
    }),
  },
  comment: {
    member: r.one.member({
      from: r.comment.memberId,
      to: r.member.id,
    }),
    message: r.one.message({
      from: r.comment.messageId,
      to: r.message.id,
    }),
    replies: r.many.reply({
      from: r.comment.id,
      to: r.reply.commentId,
    }),
    likes: r.many.likeComment({
      from: r.comment.id,
      to: r.likeComment.commentId,
    }),
  },
  reply: {
    member: r.one.member({
      from: r.reply.memberId,
      to: r.member.id,
    }),
    comment: r.one.comment({
      from: r.reply.commentId,
      to: r.comment.id,
    }),
  },
  likeComment: {
    member: r.one.member({
      from: r.likeComment.memberId,
      to: r.member.id,
    }),
    comment: r.one.comment({
      from: r.likeComment.commentId,
      to: r.comment.id,
    }),
  },

  report: {
    message: r.one.message({
      from: r.report.messageId,
      to: r.message.id,
    }),
    member: r.one.member({
      from: r.report.memberId,
      to: r.member.id,
    }),
    group: r.one.group({
      from: r.report.groupId,
      to: r.group.id,
    }),
    appeal: r.one.appeal({
      from: r.report.id,
      to: r.appeal.reportId,
    }),
    decision: r.one.decision({
      from: r.report.id,
      to: r.decision.reportId,
    }),
  },
  appeal: {
    report: r.one.report({
      from: r.appeal.reportId,
      to: r.report.id,
    }),
    member: r.one.member({
      from: r.appeal.memberId,
      to: r.member.id,
    }),
  },

  decision: {
    report: r.one.report({
      from: r.decision.reportId,
      to: r.report.id,
    }),
    member: r.one.member({
      from: r.decision.memberId,
      to: r.member.id,
    }),
  },
}));
