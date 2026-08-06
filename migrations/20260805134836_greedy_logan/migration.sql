DROP INDEX "like_member_id_idx";--> statement-breakpoint
DROP INDEX "reply_message_id_idx";--> statement-breakpoint
CREATE INDEX "like_comment_member_id_idx" ON "like_comment" ("member_id");--> statement-breakpoint
CREATE INDEX "reply_comment_id_idx" ON "reply" ("comment_id");