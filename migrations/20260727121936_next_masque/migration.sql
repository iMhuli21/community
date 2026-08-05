CREATE TABLE "comment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"body" text NOT NULL,
	"member_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"message_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "like" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"message_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"member_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE INDEX "comment_message_id_idx" ON "comment" ("message_id");--> statement-breakpoint
CREATE INDEX "comment_member_id_idx" ON "comment" ("member_id");--> statement-breakpoint
CREATE INDEX "like_message_id_idx" ON "like" ("message_id");--> statement-breakpoint
CREATE INDEX "like_member_id_idx" ON "like" ("member_id");--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_member_id_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_message_id_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "message"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "like" ADD CONSTRAINT "like_message_id_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "message"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "like" ADD CONSTRAINT "like_member_id_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE CASCADE;