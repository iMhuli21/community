CREATE TYPE "message_type" AS ENUM('report', 'notice', 'announcement', 'normal');--> statement-breakpoint
CREATE TABLE "message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"body" text NOT NULL,
	"media" text[] NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"type" "message_type" DEFAULT 'normal'::"message_type" NOT NULL,
	"member_id" text NOT NULL,
	"group_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE INDEX "message_member_id_idx" ON "message" ("member_id");--> statement-breakpoint
CREATE INDEX "message_groupId_idx" ON "message" ("group_id");--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_member_id_member_user_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("user_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_group_id_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE CASCADE;