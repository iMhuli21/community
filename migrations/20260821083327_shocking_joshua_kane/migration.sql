ALTER TABLE "poll" ADD COLUMN "group_id" uuid NOT NULL;--> statement-breakpoint
CREATE INDEX "poll_group_id_idx" ON "poll" ("group_id");--> statement-breakpoint
ALTER TABLE "poll" ADD CONSTRAINT "poll_group_id_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id");