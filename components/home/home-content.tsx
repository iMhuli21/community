"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { fraunces } from "@/lib/fonts";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { contentLimit } from "@/lib/constants";
import {
  getGroupsCountFn,
  getJoinedGroupsFn,
} from "@/actions/group/get-groups";
import HomeSkeleton from "../skeletons/home-skeleton";
import JoinedGroupCard from "../group/joined-groups";
import ErrorMessage from "../error-message";

export default function HomeContent({ userName }: { userName: string }) {
  const groupCount = useQuery({
    queryKey: ["group-count"],
    queryFn: getGroupsCountFn,
  });
  const groupsData = useQuery({
    queryKey: ["limited-groups", contentLimit],
    queryFn: () => getJoinedGroupsFn(contentLimit),
  });

  if (groupsData.isLoading || groupCount.isLoading) {
    return <HomeSkeleton />;
  }

  if (groupsData.error || groupCount.error) {
    return (
      <ErrorMessage
        message={groupCount.error?.message || groupsData.error?.message}
      />
    );
  }

  return (
    <main className="px-7 py-5 space-y-7">
      <section>
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
            Here&apos;s what&apos;s happening in,
            <br /> <em className="italic text-green">your communities.</em>
          </h1>
          <span className="tracking-tight text-muted-foreground">
            You&apos;re a member of {groupCount?.data ?? "0"} communities. 4 new
            updates since you last checked in.
          </span>
          <div className="flex items-center gap-4">
            <Button size="lg" variant="outline">
              <Link href="/search"> + Join a community</Link>
            </Button>
            <Button size="lg" asChild>
              <Link href="/group/create">+ Create a group</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="bg-c-bg border border-gray-300 grid grid-cols-2 divide-y md:divide-y-0 md:grid-cols-4  rounded-lg divide-x divide-gray-300 ">
        <div className="p-4">
          <h4 className={cn(fraunces.className, "text-2xl font-medium")}>
            {groupCount?.data ?? 0}
          </h4>
          <span className="text-muted-foreground font-medium text-sm tracking-tight">
            Communities joined
          </span>
        </div>
        <div className="p-4">
          <h4 className={cn(fraunces.className, "text-2xl font-medium")}>4</h4>
          <span className="text-muted-foreground font-medium text-sm tracking-tight">
            Unread updates
          </span>
        </div>
        <div className="p-4">
          <h4 className={cn(fraunces.className, "text-2xl font-medium")}>2</h4>
          <span className="text-muted-foreground font-medium text-sm tracking-tight">
            Reports you&apos;ve filed
          </span>
        </div>
        <div className="p-4">
          <h4 className={cn(fraunces.className, "text-2xl font-medium")}>1</h4>
          <span className="text-muted-foreground font-medium text-sm tracking-tight">
            Group you moderate
          </span>
        </div>
      </section>
      <section className="bg-black text-white rounded-lg p-7">
        <div className="max-w-120 w-full flex flex-col items-start gap-4">
          <span className="text-sm text-muted-foreground capitalize">
            Start something new
          </span>
          <h4 className={cn(fraunces.className, "text-2xl font-semibold")}>
            Don&apos;t see your neighbourhood yet?
          </h4>
          <p className="text-sm text-muted-foreground font-medium tracking-tight">
            Create a community group in under a minute. Invite neighbours,
            appoint moderators, and start tracking local issues &mdash; out in
            the open, not buried in a group chat.
          </p>
          <Button className="bg-white text-black hover:bg-white/80z" size="lg">
            + Create a community group
          </Button>
        </div>
      </section>
      <section className="flex flex-col items-start gap-5">
        <div className="flex items-center justify-between gap-5 w-full">
          <h4 className="text-xl font-semibold">Your communities</h4>
          <Link href="/groups" className="text-sm text-green font-medium">
            View all &#8594;
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 items-center">
          {groupsData.data &&
            groupsData.data.length !== 0 &&
            groupsData.data.map((info) => (
              <JoinedGroupCard key={info.id} info={info} />
            ))}
          {groupsData.data && groupsData.data.length === 0 && (
            <div className="w-75 p-5 border border-line bg-c-bg flex flex-col items-center justify-center rounded-lg gap-2">
              <span className="font-medium">Don&apos;t see your area?</span>
              <p className="text-sm text-center text-muted-foreground">
                Create a group for your
                <br /> neighbourhood in under a minute.
              </p>
              <Button size="sm" asChild>
                <Link href="/group/create">Create a group</Link>
              </Button>
            </div>
          )}
          {!groupsData.data && (
            <div className="w-75 p-5 border border-line bg-c-bg flex flex-col items-center justify-center rounded-lg gap-2">
              <span className="font-medium">Don&apos;t see your area?</span>
              <p className="text-sm text-center text-muted-foreground">
                Create a group for your
                <br /> neighbourhood in under a minute.
              </p>
              <Button size="sm" asChild>
                <Link href="/group/create">Create a group</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
