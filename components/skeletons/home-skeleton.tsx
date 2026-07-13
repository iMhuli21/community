import { Skeleton } from "../ui/skeleton";

export default function HomeSkeleton() {
  return (
    <main className="px-7 py-5 space-y-7">
      <section>
        <div className="flex flex-col items-start gap-3">
          <Skeleton className="h-3 w-38" />
          <Skeleton className="h-20 w-160" />
          <Skeleton className="h-3 w-165" />

          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-50" />
            <Skeleton className="h-10 w-50" />
          </div>
        </div>
      </section>
      <Skeleton className="h-30 w-full" />
      <Skeleton className="h-50 w-full" />
      <section className="flex flex-col items-start gap-5">
        <div className="flex items-center justify-between gap-5 w-full">
          <Skeleton className="h-5 w-60" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center">
          <Skeleton className="w-100 h-37" />
          <Skeleton className="w-100 h-37" />
          <Skeleton className="w-100 h-37" />
        </div>
      </section>
    </main>
  );
}
