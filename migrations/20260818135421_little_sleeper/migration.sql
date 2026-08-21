CREATE TABLE "poll" (
	"id" uuid PRIMARY KEY,
	"title" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"close_date" timestamp NOT NULL,
	"votes_count" integer DEFAULT 0,
	"creator_id" uuid NOT NULL,
	"options" text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vote" (
	"id" uuid PRIMARY KEY,
	"vote" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"poll_id" uuid NOT NULL,
	"voter_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE INDEX "poll_creator_id_idx" ON "poll" ("creator_id");--> statement-breakpoint
CREATE INDEX "vote_poll_id_idx" ON "vote" ("poll_id");--> statement-breakpoint
CREATE INDEX "vote_voter_id_idx" ON "vote" ("voter_id");--> statement-breakpoint
ALTER TABLE "poll" ADD CONSTRAINT "poll_creator_id_member_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "member"("id");--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_poll_id_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "poll"("id");--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_voter_id_member_id_fkey" FOREIGN KEY ("voter_id") REFERENCES "member"("id");