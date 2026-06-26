import GroupCard from "@/components/group/group-card";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth/server";
import { ensureUserCreated } from "@/lib/db/function";
import { fraunces } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function page() {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    redirect(`${encodeURIComponent("/sign-in")}`);
  }

  await ensureUserCreated();

  return (
    <main className="px-7 py-5 space-y-7">
      <section>
        <div className="flex flex-col items-start gap-3">
          <h5 className="text-sm text-muted-foreground font-medium tracking-tight">
            Welcome back, {session.user.name.split(" ")[0]}
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
            You&apos;re a member of 3 communities. 4 new updates since you last
            checked in.
          </span>
          <div className="flex items-center gap-4">
            <Button size="lg" variant="outline">
              + Join a community
            </Button>
            <Button size="lg" asChild>
              <Link href="/group/create">+ Create a group</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="bg-c-bg border border-gray-300 grid grid-cols-2 divide-y md:divide-y-0 md:grid-cols-4  rounded-lg divide-x divide-gray-300 ">
        <div className="p-4">
          <h4 className={cn(fraunces.className, "text-2xl font-medium")}>3</h4>
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
          <Button className="bg-white text-black" size="lg">
            + Create a community group
          </Button>
        </div>
      </section>
      <section className="flex flex-col items-start gap-5">
        <div className="flex items-center justify-between gap-5 w-full">
          <h4 className="text-xl font-semibold">Your communities</h4>
          <Link href="#" className="text-sm text-green font-medium">
            View all &#8594;
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center">
          <GroupCard />
          <GroupCard />
          <GroupCard />
        </div>
      </section>
    </main>
  );
}
