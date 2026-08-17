"use client";

import { fraunces } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import FlagToggle from "./flag-toggle";
import { useSearchParams } from "next/navigation";
import FlagStats from "./flag-stats";
import ModView from "./mod-view";
import UserView from "./user-view";

export default function FlagContent() {
  const searchParams = useSearchParams();

  return (
    <div className="bg-c-bg p-6 min-h-dvh space-y-6">
      <div className="flex items-center gap-5 justify-between w-full">
        <div className="flex flex-col items-start gap-2">
          <h1
            className={cn(
              "text-2xl sm:text-3xl md:text-4xl font-semibold",
              fraunces.className,
            )}
          >
            Flags & appeals
          </h1>
          <span className="text-muted-foreground text-sm">
            {!searchParams.get("active") ||
            searchParams.get("active") === "my_appeals"
              ? "Track flags on your posts and manage your appeals."
              : searchParams.get("active") === "mod_queue"
                ? "Review flagged posts and appeals from your community members."
                : searchParams.get("active") &&
                  "Track flags on your posts and manage your appeals."}
          </span>
        </div>
        <div>
          <FlagToggle />
        </div>
      </div>

      {!searchParams.get("active") ||
      searchParams.get("active") === "my_appeals" ? (
        <UserView />
      ) : searchParams.get("active") === "mod_queue" ? (
        <ModView />
      ) : (
        <UserView />
      )}
    </div>
  );
}
