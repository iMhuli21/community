"use client";

import { getJoinedGroupsFn } from "@/actions/group/get-groups";
import { maxItems } from "@/lib/constants";
import { fraunces } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import GroupCard from "./group-card";
import GroupsSkeleton from "../skeletons/groups-skeleton";

export default function GroupsContent({ userName }: { userName: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["joined-groups", maxItems],
    queryFn: () => getJoinedGroupsFn(maxItems),
  });

  if (isLoading) {
    return <GroupsSkeleton />;
  }

  console.log(data);

  return (
    <main className="px-7 py-5 space-y-7">
      <div className="flex flex-col items-start gap-3">
        <h5 className="text-sm text-muted-foreground font-medium tracking-tight">
          Welcome back, {userName}
        </h5>
        <h1
          className={cn(
            "text-2xl sm:text-3xl md:text-4xl font-semibold",
            fraunces.className,
          )}
        >
          Here are all,
          <br /> <em className="italic text-green">your communities.</em>
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {data?.data &&
          data.data.map((group) => <GroupCard key={group.id} info={group} />)}
      </div>
    </main>
  );
}
