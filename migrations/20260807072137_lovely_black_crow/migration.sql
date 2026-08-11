CREATE TYPE "status" AS ENUM('rejected', 'success', 'pending');--> statement-breakpoint
ALTER TABLE "appeal" ADD COLUMN "reasoning" text;--> statement-breakpoint
ALTER TABLE "appeal" DROP COLUMN "appeal";--> statement-breakpoint
ALTER TABLE "appeal" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "appeal" ALTER COLUMN "status" SET DATA TYPE "status" USING "status"::text::"status";--> statement-breakpoint
ALTER TABLE "appeal" ALTER COLUMN "status" SET DEFAULT 'pending'::"status";--> statement-breakpoint
DROP TYPE "appeal";