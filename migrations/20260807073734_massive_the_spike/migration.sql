ALTER TABLE "appeals" ADD COLUMN "member_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "report" ADD COLUMN "member_id" uuid NOT NULL;--> statement-breakpoint
CREATE INDEX "appeal_member_id_idx" ON "appeals" ("member_id");--> statement-breakpoint
CREATE INDEX "report_member_id_idx" ON "report" ("member_id");--> statement-breakpoint
ALTER TABLE "appeals" ADD CONSTRAINT "appeals_member_id_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_member_id_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE CASCADE;