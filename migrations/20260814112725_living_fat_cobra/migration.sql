CREATE TYPE "decision_type" AS ENUM('rejected', 'success', 'pending');--> statement-breakpoint
CREATE TYPE "report_type" AS ENUM('harassment_bullying', 'hate_speech', 'threats_violence', 'misinformation', 'spam_unwanted', 'scam_fraud', 'sexual_explicit', 'child_safety', 'self_harm', 'illegal', 'privacy_violation', 'impersonation', 'malicious', 'copyright', 'other');--> statement-breakpoint
CREATE TABLE "decision" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"report_id" uuid NOT NULL CONSTRAINT "unique_report_id" UNIQUE,
	"status" "decision_type" NOT NULL,
	"member_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "appeals" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "appeals" ALTER COLUMN "reasoning" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "report" ALTER COLUMN "reason" SET DATA TYPE "report_type" USING "reason"::"report_type";--> statement-breakpoint
CREATE INDEX "decision_report_id_idx" ON "decision" ("report_id");--> statement-breakpoint
CREATE INDEX "decision_member_id_idx" ON "decision" ("member_id");--> statement-breakpoint
ALTER TABLE "decision" ADD CONSTRAINT "decision_report_id_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "report"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "decision" ADD CONSTRAINT "decision_member_id_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "group" DROP CONSTRAINT "group_creator_id_user_user_id_fkey", ADD CONSTRAINT "group_creator_id_user_user_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("user_id");--> statement-breakpoint
DROP TYPE "status";