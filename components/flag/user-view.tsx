import { useQuery } from "@tanstack/react-query";
import { getUserFlaggedPostFn } from "@/actions/flag/get-user-flagged-posts";
import ErrorMessage from "../error-message";
import UserFlaggedPost from "./user-flagged-post";
import FlagStats from "./flag-stats";
import AppealPost from "./appeal-post";
import { getUserResolvedFlagsFn } from "@/actions/flag/get-user-resolved-flags";
import { useSearchParams } from "next/navigation";
import UserAppealDecision from "./user-appeal-decision";

export default function UserView() {
  const searchParams = useSearchParams();

  const toggle = searchParams.get("active");

  const { data, isLoading, error } = useQuery({
    queryKey: ["user-flags", toggle],
    queryFn: getUserFlaggedPostFn,
  });

  const {
    data: resolvedFlags,
    isLoading: resolvedLoading,
    error: resolvedError,
  } = useQuery({
    queryKey: ["resolved-flags", toggle],
    queryFn: getUserResolvedFlagsFn,
  });

  if (isLoading || resolvedLoading) {
    return <div>Loading...</div>;
  }

  if (error || resolvedError) {
    return <ErrorMessage message={error?.message || resolvedError?.message} />;
  }

  return (
    <div className="space-y-6">
      {resolvedFlags && <FlagStats data={resolvedFlags} />}
      <section className="space-y-3">
        <div className="w-full flex items-center gap-2">
          <span className="uppercase font-medium w-65 text-sm text-muted-foreground tracking-wide">
            active flags on your posts
          </span>
          <div className="border-t border-line w-11/12"></div>
        </div>
        <div className="flex flex-col items-start gap-3">
          {data &&
            data
              ?.filter((post) => !post.report?.appeal && !post.report?.decision)
              .map((flag) => <UserFlaggedPost key={flag.id} flag={flag} />)}
          {data &&
            data
              ?.filter((post) => post.report?.appeal && !post.report?.decision)
              .map((flag) => <AppealPost key={flag.id} flag={flag} />)}
        </div>
      </section>
      <section className="space-y-3">
        <div className="w-full flex items-center gap-2">
          <span className="uppercase font-medium w-20 text-sm text-muted-foreground tracking-wide">
            resolved
          </span>
          <div className="border-t border-line w-11/12"></div>
        </div>
        <div className="flex flex-col items-start gap-3">
          {resolvedFlags &&
            resolvedFlags
              ?.filter((post) => post.decision)
              .map((flag) => <UserAppealDecision key={flag.id} flag={flag} />)}
        </div>
      </section>
    </div>
  );
}
