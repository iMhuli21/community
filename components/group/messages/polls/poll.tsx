import { voteFn } from "@/actions/polls/vote";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { authClient } from "@/lib/auth/auth-client";
import { toDate, truncateWord } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow, formatRelative } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  poll: {
    createdAt: Date;
    title: string;
    id: string;
    groupId: string;
    creatorId: string;
    closeDate: Date;
    votesCount: number | null;
    options: string[];
    creator: {
      name: string;
      status: "Admin" | "Mod" | "Member";
    } | null;
    votes: {
      id: string;
      createdAt: Date;
      vote: string;
      pollId: string;
      voterId: string;
      voter: {
        userId: string;
      } | null;
    }[];
  };
}

export default function Poll({ poll }: Props) {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["client-auth"],
    queryFn: () => authClient.getSession(),
  });

  const [option, setOption] = useState(poll.options[0]);

  const voteMutation = useMutation({
    mutationFn: voteFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["polls", poll.groupId],
      });
    },
  });

  useEffect(() => {
    if (poll) {
      setOption(
        poll.votes.find((vote) => vote.voter?.userId === data?.data?.user.id)
          ?.vote ?? poll.options[0],
      );
    }
  }, [poll]);

  const handleVote = async () => {
    try {
      const res = await voteMutation.mutateAsync({
        groupId: poll.groupId,
        pollId: poll.id,
        value: option,
      });

      if (res?.success) {
        toast.success("Success", {
          description: res.success,
        });
      }
    } catch (e) {
      toast.error("Error", {
        description: e instanceof Error ? e.message : "Unknown",
      });
    }
  };

  //check if the vote
  const alreadyVoted = poll.votes.filter(
    (vote) => vote.voter?.userId === data?.data?.user.id,
  );

  return (
    <div className="p-4 flex flex-col gap-4 w-full">
      <div className="flex items-start gap-2 relative">
        <Avatar>
          <AvatarFallback className={"text-xs text-green"}>
            {truncateWord(poll.creator?.name ?? "")}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start gap-0 pointer-events-none">
          <span className="text-sm font-semibold">{poll.creator?.name}</span>
          <span className="text-xs opacity-50 ">
            {`${formatRelative(toDate(poll.createdAt), new Date())}`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {poll.creator?.status === "Admin" ? (
            <Badge className="rounded-sm h-5 pointer-events-none" size={"xs"}>
              Admin
            </Badge>
          ) : (
            poll.creator?.status === "Mod" && (
              <Badge className="rounded-sm h-5 pointer-events-none" size={"xs"}>
                Mod
              </Badge>
            )
          )}

          <Badge
            className="rounded-sm h-5 pointer-events-none text-purple-800 border-purple-200"
            size={"xs"}
          >
            Poll
          </Badge>
        </div>
      </div>
      <div className="p-4 w-full bg-c-bg border border-line rounded-md flex flex-col items-start gap-4">
        <h4 className="font-semibold">{`${poll.title}`}</h4>
        <RadioGroup
          defaultValue={option}
          onValueChange={(val) => setOption(val)}
        >
          {poll.options.map((option) => (
            <div
              key={option}
              className="flex items-center gap-2 justify-between w-full"
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem
                  value={option}
                  id={option}
                  disabled={alreadyVoted.length > 0}
                />
                <Label htmlFor={option}>{option}</Label>
              </div>
              <div className="w-full flex-1 flex items-center gap-1">
                <Progress
                  className="bg-gray-200"
                  value={
                    (poll.votes.filter((vote) => vote.vote === option).length /
                      poll.votes.length) *
                    100
                  }
                />
                <span className="text-xs">
                  {(poll.votes.filter((vote) => vote.vote === option).length /
                    poll.votes.length) *
                    100 || 0}
                  %
                </span>
              </div>
            </div>
          ))}
        </RadioGroup>
        <div className="flex items-center gap-3 justify-between w-full">
          <span className="opacity-50 font-medium text-xs">
            {poll.votesCount} votes
          </span>
          <Button
            onClick={handleVote}
            className="bg-purple-800 text-white hover:bg-purple-800/80"
            size={"xs"}
            disabled={voteMutation.isPending || alreadyVoted.length > 0}
          >
            {alreadyVoted.length > 0 ? "Voted" : "Vote"}
          </Button>
        </div>
      </div>
      <div className="border-t border-line w-full"></div>
      <span className="opacity-50 text-xs ml-auto">
        {`${new Date() < poll.closeDate ? "Closes in" : "Closed"} ${formatDistanceToNow(toDate(poll.closeDate))} ${new Date() > poll.closeDate ? "ago" : ""}`}
      </span>
    </div>
  );
}
