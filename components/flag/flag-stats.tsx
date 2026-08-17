import { cn } from "@/lib/utils";
import { fraunces } from "@/lib/fonts";

interface Props {
  data: {
    id: string;
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
    createdAt: Date;
    groupId: string;
    memberId: string;
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
    appeal: {
      id: string;
      createdAt: Date;
      memberId: string;
      reportId: string;
      reasoning: string;
    } | null;
  }[];
}

export default function FlagStats({ data }: Props) {
  const totalReports = data.length;
  return (
    <section className="bg-white border border-gray-300 grid grid-cols-2 divide-y md:divide-y-0 md:grid-cols-4  rounded-lg divide-x divide-gray-300 ">
      <div className="p-4">
        <h4
          className={cn(
            fraunces.className,
            "text-2xl font-medium text-red-500",
          )}
        >
          {
            data?.filter((report) => report?.decision?.status === "uphold")
              .length
          }
        </h4>
        <span className="text-muted-foreground font-medium text-sm tracking-tight">
          Appeals Rejected
        </span>
      </div>
      <div className="p-4">
        <h4
          className={cn(fraunces.className, "text-2xl font-medium text-amber")}
        >
          {data?.filter((report) => report.appeal && !report?.decision).length}
        </h4>
        <span className="text-muted-foreground font-medium text-sm tracking-tight">
          Appeals pending
        </span>
      </div>
      <div className="p-4">
        <h4
          className={cn(fraunces.className, "text-2xl font-medium text-green")}
        >
          {
            data?.filter((report) => report?.decision?.status === "dismiss")
              .length
          }
        </h4>
        <span className="text-muted-foreground font-medium text-sm tracking-tight">
          Appeals won
        </span>
      </div>
      <div className="p-4">
        <h4 className={cn(fraunces.className, "text-2xl font-medium")}>
          {totalReports}
        </h4>
        <span className="text-muted-foreground font-medium text-sm tracking-tight">
          Total flags received
        </span>
      </div>
    </section>
  );
}
