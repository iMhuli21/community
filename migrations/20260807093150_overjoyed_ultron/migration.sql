ALTER TABLE "message" ADD COLUMN "is_reported" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "report" ADD COLUMN "group_id" uuid NOT NULL;--> statement-breakpoint
CREATE INDEX "report_group_id_idx" ON "report" ("member_id");--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_group_id_message_id_fkey" FOREIGN KEY ("group_id") REFERENCES "message"("id") ON DELETE CASCADE;