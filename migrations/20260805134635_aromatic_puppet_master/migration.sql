CREATE TABLE "like_comment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"comment_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"member_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reply" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"body" text NOT NULL,
	"member_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"comment_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE INDEX "like_comment_id_idx" ON "like_comment" ("comment_id");--> statement-breakpoint
CREATE INDEX "like_member_id_idx" ON "like_comment" ("member_id");--> statement-breakpoint
CREATE INDEX "reply_message_id_idx" ON "reply" ("comment_id");--> statement-breakpoint
CREATE INDEX "reply_member_id_idx" ON "reply" ("member_id");--> statement-breakpoint
ALTER TABLE "like_comment" ADD CONSTRAINT "like_comment_comment_id_message_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "message"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "like_comment" ADD CONSTRAINT "like_comment_member_id_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "reply" ADD CONSTRAINT "reply_member_id_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "reply" ADD CONSTRAINT "reply_comment_id_message_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "message"("id") ON DELETE CASCADE;