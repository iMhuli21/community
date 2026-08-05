"use client";

import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { truncateWord } from "@/lib/utils";
import GroupDropDown from "./group-dropdown";
import Link from "next/link";
import { Button } from "../ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth/auth-client";
import { Skeleton } from "../ui/skeleton";
import { useMemo } from "react";
import { joinGroupFn } from "@/actions/group/join-group";
import { toast } from "sonner";

interface Props {
  info: {
    id: string;
    name: string;
    slug: string;
    creatorId: string;
    description: string;
    suburbArea: string;
    cityMunicipality: string;
    color: string;
    membersCount?: number;
    members: {
      id: string;
      status: "Mod" | "Admin" | "Member";
      userId: string;
    }[];
  };
}

export default function GroupCard({ info }: Props) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["client-auth", info.id],
    queryFn: () => authClient.getSession(),
  });

  const session = data?.data;

  const mutation = useMutation({
    mutationFn: joinGroupFn,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["groups"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["limited-groups"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["group-count"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["search-group"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["joined-groups"],
        }),
      ]);
    },
  });

  const { isPending } = mutation;

  const hasJoined = useMemo(() => {
    return info.members.filter((member) => member.userId === session?.user.id);
  }, [info, session]);

  const handleJoinGroup = async () => {
    const res = await mutation.mutateAsync(info.id);

    if (mutation.error) {
      return toast.error("Error", { description: mutation.error?.message });
    } else if (res?.success) {
      toast.success("Success", {
        description: res.success,
      });
    }
  };

  if (isLoading) {
    return <Skeleton className="w-100 h-37" />;
  }

  return (
    <Link href={`/group/${encodeURIComponent(info.id)}`}>
      <Card className="w-75 min-h-64 hover:ring-green hover:ease-in-out hover:duration-150 relative rounded-lg">
        <CardContent>
          <div
            style={{ backgroundColor: info.color }}
            className="absolute h-18 w-full top-0 left-0"
          ></div>
          <Avatar>
            <AvatarFallback className="rounded-md bg-green-light text-green absolute top-7 left-0 font-medium text-sm border border-green-light">
              {truncateWord(info.name)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute top-20 flex flex-col gap-3 w-full left-0 p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-start gap-0">
                <h5 className="font-semibold text-base">{info.name}</h5>
                <div className="flex items-center gap-1">
                  <div className="size-1 bg-line rounded-full"></div>
                  <span className="text-xs opacity-50">{info.suburbArea}</span>
                </div>
              </div>
              {session?.user.id === info.creatorId && <GroupDropDown />}
            </div>
            <p className="text-[0.78rem] text-muted-foreground w-full line-clamp-2">
              {info.description}
            </p>
            <div className="border-t border-line"></div>
            <div className="flex items-center gap-4 justify-between">
              <div className="flex items-center gap-1 font-medium text-sm tracking-tight">
                <span>{info.membersCount}</span>
                <span className="font-normal opacity-50">
                  {info.membersCount === 1 ? "member" : "members"}
                </span>
              </div>
              <Button
                size={"sm"}
                variant={"ghost"}
                className="text-green bg-green-light"
                onClick={handleJoinGroup}
                disabled={isPending || hasJoined.length > 0}
              >
                {hasJoined.length > 0 ? "Joined" : "Join"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
