CREATE TYPE "status_type" AS ENUM('resolved', 'none');--> statement-breakpoint
ALTER TABLE "message" ADD COLUMN "is_urgent" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "message" ADD COLUMN "status" "status_type" DEFAULT 'none'::"status_type" NOT NULL;