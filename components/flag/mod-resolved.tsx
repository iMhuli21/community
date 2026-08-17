import { CheckCircle2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Appeal, Decision } from "@/lib/types";
import { useMemo } from "react";
import { flagCategories } from "@/lib/constants";
import { formatRelative } from "date-fns";
import { toDate } from "@/lib/utils";

interface Props {
  flag: {
    id: string;
    createdAt: Date;
    groupId: string;
    memberId: string;
    reason:
      | "harassment_bullying"
      | "hate_speech"
      | "threats_violence"
      | "misinformation"
      | "spam_unwanted"
      | "scam_fraud"
      | "sexual_explicit"
      | "child_safety"
      | "self_harm"
      | "illegal"
      | "privacy_violation"
      | "impersonation"
      | "malicious"
      | "copyright"
      | "other";
    messageId: string;
    decision: {
      id: string;
      createdAt: Date;
      status: "dismiss" | "uphold";
      memberId: string;
      reportId: string;
      reasoning: string;
      member: {
        name: string;
      } | null;
    } | null;
  };
}

export default function ModResolved({ flag }: Props) {
  const flagCategory = useMemo(() => {
    return flagCategories.filter((cat) => cat.value === flag.reason)[0];
  }, [flag]);
  return (
    <div className="border border-line shadow-[-3px_0px] shadow-green rounded-md p-6 flex items-center gap-3 justify-between bg-white w-full">
      <div className="flex items-start gap-2">
        <div className="p-2 flex items-center justify-center rounded-md bg-green-light text-green">
          <CheckCircle2 className="size-4" />
        </div>
        <div className="flex flex-col gap-0 items-start">
          <h4 className="font-semibold text-sm text-ink2">
            {flagCategory.label} - flag {flag.decision?.status}
          </h4>
          <div className="flex items-center gap-1 text-xs opacity-50">
            <span>
              Resolved by <strong>{flag.decision?.member?.name}</strong>
            </span>
            {flag.decision && (
              <span>
                {formatRelative(toDate(flag.decision.createdAt), new Date())}
              </span>
            )}
          </div>
        </div>
      </div>
      <Badge
        size={"xs"}
        className="rounded-sm h-5 pointer-events-none"
        variant={
          flag.decision?.status === "dismiss" ? "default" : "destructive"
        }
      >
        {flag.decision?.status === "dismiss" ? "dismissed" : "upheld"}
      </Badge>
    </div>
  );
}
