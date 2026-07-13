import { Skeleton } from "../ui/skeleton";

export default function GroupsSkeleton() {
  return (
    <main className="px-7 py-5 space-y-7">
      <section>
        <div className="flex flex-col items-start gap-3">
          <Skeleton className="h-3 w-38" />
          <Skeleton className="h-20 w-160" />
        </div>
      </section>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 3xl:grid-cols-4 gap-5">
        <Skeleton className="w-100 h-37" />
        <Skeleton className="w-100 h-37" />
        <Skeleton className="w-100 h-37" />
        <Skeleton className="w-100 h-37" />
        <Skeleton className="w-100 h-37" />
        <Skeleton className="w-100 h-37" />
        <Skeleton className="w-100 h-37" />
        <Skeleton className="w-100 h-37" />
        <Skeleton className="w-100 h-37" />
        <Skeleton className="w-100 h-37" />
        <Skeleton className="w-100 h-37" />
      </div>
    </main>
  );
}
