CREATE TYPE "public"."member_status" AS ENUM('Mod', 'Admin', 'Member');--> statement-breakpoint
CREATE TABLE "member" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"user_id" text NOT NULL,
	"updated_at" timestamp NOT NULL,
	"status" "member_status" DEFAULT 'Member' NOT NULL,
	"group_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "member_userId_idx" ON "member" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "member_groupId_idx" ON "member" USING btree ("group_id");