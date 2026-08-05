"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";
import { searchGroupFn } from "@/actions/group/search-group";
import { Skeleton } from "../ui/skeleton";
import GroupCard from "../group/group-card";
import Link from "next/link";
import { Button } from "../ui/button";

export default function SearchContent() {
  const [search, setSearch] = useState("");
  const debouncedQuery = useDebounce(search, 500);

  const { data, isLoading } = useQuery({
    queryKey: ["search-group", debouncedQuery],
    queryFn: () => searchGroupFn(debouncedQuery),
    enabled: debouncedQuery.trim().length > 0,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center">
        <Skeleton className="w-100 h-37" />
        <Skeleton className="w-100 h-37" />
        <Skeleton className="w-100 h-37" />
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col items-start gap-2">
        <Input
          placeholder="Search for community..."
          className="border-line bg-c-bg h-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {debouncedQuery.trim().length > 0 && (
          <span className="text-sm font-semibold text-ink">
            {data && data.length} results{" "}
            <span className="font-normal">
              for &quot;{debouncedQuery}&quot;
            </span>
          </span>
        )}
      </div>
      {/* <div>
        <Badge className="h-7 rounded-2xl">Near me</Badge>
      </div> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-center">
        {data && data.map((group) => <GroupCard key={group.id} info={group} />)}
      </div>
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
    </section>
  );
}
