import { useMemo } from "react";
import ModResolved from "./mod-resolved";
import FlagStatsMod from "./flag-stats-mod";
import ErrorMessage from "../error-message";
import ModAppealView from "./mod-appeal-view";
import ModFlaggedPost from "./mod-flagged-post";
import { useQuery } from "@tanstack/react-query";
import { getResolvedFlagsFn } from "@/actions/flag/get-resolved-flags";
import { getModViewFlagPostsFn } from "@/actions/flag/get-mod-view-flag-posts";
import { useSearchParams } from "next/navigation";

export default function ModView() {
  const searchParams = useSearchParams();

  const toggle = searchParams.get("active");

  const { data, isLoading, error } = useQuery({
    queryKey: ["mod-flags", toggle],
    queryFn: getModViewFlagPostsFn,
  });

  const {
    data: resolvedFlags,
    isLoading: resolvedLoading,
    error: resolvedError,
  } = useQuery({
    queryKey: ["resolved-flags", toggle],
    queryFn: getResolvedFlagsFn,
  });

  if (isLoading || resolvedLoading) {
    return <div>Loading...</div>;
  }

  if (error || resolvedError) {
    return <ErrorMessage message={error?.message || resolvedError?.message} />;
  }

  return (
    <div className="space-y-6">
      {resolvedFlags && <FlagStatsMod data={resolvedFlags} />}
      <section className="space-y-3">
        <div className="w-full flex items-center gap-2">
          <span className="uppercase font-medium w-28 text-sm text-muted-foreground tracking-wide">
            needs action
          </span>
          <div className="border-t border-line w-11/12"></div>
        </div>
        <div className="flex flex-col items-start gap-3">
          {data &&
            data
              ?.filter((flag) => !flag.report?.appeal && !flag.report?.decision)
              .map((flag) => <ModFlaggedPost key={flag.id} flag={flag} />)}
        </div>
      </section>
      <section className="space-y-3">
        <div className="w-full flex items-center gap-2">
          <span className="uppercase font-medium w-42 text-sm text-muted-foreground tracking-wide">
            appeals to review
          </span>
          <div className="border-t border-line w-11/12"></div>
        </div>
        <div className="flex flex-col items-start gap-3">
          {data &&
            data
              ?.filter((flag) => flag.report?.appeal && !flag.report.decision)
              .map((post) => <ModAppealView key={post.id} flag={post} />)}
        </div>
      </section>
      <section className="space-y-3">
        <div className="w-full flex items-center gap-2">
          <span className="uppercase font-medium w-44 text-sm text-muted-foreground tracking-wide">
            recently resolved
          </span>
          <div className="border-t border-line w-11/12"></div>
        </div>
        <div className="flex flex-col items-start gap-3">
          {resolvedFlags &&
            resolvedFlags.map((flag) => (
              <ModResolved key={flag.id} flag={flag} />
            ))}
        </div>
      </section>
    </div>
  );
}
