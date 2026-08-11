CREATE TYPE "appeal" AS ENUM('rejected', 'success', 'pending');--> statement-breakpoint
CREATE TABLE "appeal" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"report_id" uuid NOT NULL,
	"appeal" text,
	"status" "appeal" DEFAULT 'pending'::"appeal" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "report" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"flag" boolean DEFAULT true NOT NULL,
	"reason" text NOT NULL,
	"message_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "message" DROP COLUMN "flag";--> statement-breakpoint
CREATE INDEX "appeal_report_id_idx" ON "appeal" ("report_id");--> statement-breakpoint
CREATE INDEX "report_message_id_idx" ON "report" ("message_id");--> statement-breakpoint
ALTER TABLE "appeal" ADD CONSTRAINT "appeal_report_id_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "report"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_message_id_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "message"("id") ON DELETE CASCADE;