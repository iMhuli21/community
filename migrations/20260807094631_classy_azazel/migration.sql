ALTER TABLE "report" DROP CONSTRAINT "report_group_id_message_id_fkey";--> statement-breakpoint
DROP INDEX "report_group_id_idx";--> statement-breakpoint
CREATE INDEX "report_group_id_idx" ON "report" ("group_id");--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_group_id_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE CASCADE;