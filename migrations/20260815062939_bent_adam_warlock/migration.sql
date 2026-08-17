ALTER TABLE "decision" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "decision" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "decision_type";--> statement-breakpoint
CREATE TYPE "decision_type" AS ENUM('dismiss', 'uphold');--> statement-breakpoint
ALTER TABLE "decision" ALTER COLUMN "status" SET DATA TYPE "decision_type" USING "status"::"decision_type";--> statement-breakpoint
ALTER TABLE "report" DROP COLUMN "flag";--> statement-breakpoint
ALTER TABLE "message" ALTER COLUMN "body" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "group" ADD CONSTRAINT "unique_group_name" UNIQUE("name");