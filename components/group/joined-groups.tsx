"use client";

import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { truncateWord } from "@/lib/utils";
import GroupDropDown from "./group-dropdown";
import Link from "next/link";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth/auth-client";
import { Skeleton } from "../ui/skeleton";

interface Props {
  info: {
    status: "Mod" | "Admin" | "Member";
    id: string;
    userId: string;
    group: {
      id: string;
      description: string;
      color: string;
      name: string;
      slug: string;
      creatorId: string;
      suburbArea: string;
      cityMunicipality: string;
      membersCount: number;
    } | null;
  };
}

export default function JoinedGroupCard({ info }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["client-auth", info.id],
    queryFn: () => authClient.getSession(),
  });

  const session = data?.data;

  if (isLoading) {
    return <Skeleton className="w-100 h-37" />;
  }

  return (
    <Link href={`/group/${encodeURIComponent(info.group?.id ?? "/")}`}>
      <Card className="w-75 min-h-64 hover:ring-green hover:ease-in-out hover:duration-150 relative rounded-lg">
        <CardContent>
          <div
            style={{ backgroundColor: info.group?.color }}
            className="absolute h-18 w-full top-0 left-0"
          ></div>
          <Avatar>
            <AvatarFallback className="rounded-md bg-green-light text-green absolute top-7 left-0 font-medium text-sm border border-green-light">
              {truncateWord(info.group?.name || "TT")}
            </AvatarFallback>
          </Avatar>
          <div className="absolute top-20 flex flex-col gap-3 w-full left-0 p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-start gap-0">
                <h5 className="font-semibold text-base">{info.group?.name}</h5>
                <div className="flex items-center gap-1">
                  <div className="size-1 bg-line rounded-full"></div>
                  <span className="text-xs opacity-50">
                    {info.group?.suburbArea}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-[0.78rem] text-muted-foreground w-full line-clamp-2">
              {info.group?.description}
            </p>
            <div className="border-t border-line"></div>
            <div className="flex items-center gap-4 justify-between">
              <div className="flex items-center gap-1 font-medium text-sm tracking-tight">
                <span>{info.group?.membersCount}</span>
                <span className="font-normal opacity-50">
                  {info.group?.membersCount === 1 ? "member" : "members"}
                </span>
              </div>
              <Button
                size={"sm"}
                variant={"ghost"}
                className="text-green bg-green-light"
                disabled
              >
                Joined
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
