import { useMemo } from "react";
import { Badge } from "../ui/badge";
import { TbCancel, TbMessageForward } from "react-icons/tb";
import { Button } from "../ui/button";
import { Check } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Appeal, Decision } from "@/lib/types";
import { downloadFile, toDate, truncateWord } from "@/lib/utils";
import { formatDistanceToNow, formatRelative } from "date-fns";
import { flagCategories } from "@/lib/constants";
import ModAcceptAppealDialog from "./mod-accept-appeal-dialog";
import ModRejectAppealDialog from "./mod-reject-appeal-dialog";
import Image from "next/image";

interface Props {
  flag: {
    id: string;
    body: string;
    media: string[];
    createdAt: Date;
    type: "report" | "notice" | "announcement" | "normal";
    isUrgent: boolean;
    status: "resolved" | "none";
    groupId: string;
    memberId: string;
    isReported: boolean;
    messageAttachments: {
      id: string;
      messageId: string | null;
      fileName: string;
      fileKey: string;
      fileSize: number;
      fileType: string;
      fileUrl: string;
    }[];
    report: {
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
      member: {
        name: string;
      } | null;
      appeal: Appeal | null;
      decision: Decision | null;
    } | null;
    member: {
      name: string;
    } | null;
    group: {
      name: string;
    } | null;
  };
}

export default function ModAppealView({ flag }: Props) {
  const flagCategory = useMemo(() => {
    return flagCategories.filter((cat) => cat.value === flag.report?.reason)[0];
  }, [flag]);

  return (
    <div className="p-4 shadow-[-3px_0px] shadow-purple-800 bg-white flex flex-col items-start gap-3 rounded-lg border border-line w-full">
      <div className="flex items-center gap-4 justify-between w-full">
        <div className="flex items-start gap-2">
          <div className="p-2 text-purple-800 bg-accent rounded-md">
            <TbMessageForward className="size-4" />
          </div>
          <div className="flex flex-col items-start gap-0">
            <p className="font-semibold text-sm">
              {flag.member?.name} is appealing your decision
            </p>
            <span className="text-xs opacity-50">
              Flagged in <strong>{flag.group?.name}</strong>
            </span>
          </div>
        </div>
        <Badge
          size={"xs"}
          variant={"notice"}
          className="rounded-sm h-5 pointer-events-none text-purple-800"
        >
          Appealed
        </Badge>
      </div>
      <div className="p-4 rounded-md bg-c-bg border border-line flex flex-col items-start gap-2 w-full">
        <div className="flex items-center gap-2">
          <Avatar size="sm">
            <AvatarFallback className="bg-red-100 text-red-800 text-xs">
              {truncateWord(flag.member?.name ?? "")}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold">
            {flag.member?.name} &mdash; original flagged post
          </span>
          <span className="text-xs opacity-50">
            {formatRelative(toDate(flag.createdAt), new Date())}
          </span>
        </div>
        <p className="text-sm">&quot;{flag.body}&quot;</p>
        {flag.media.length > 0 && (
          <div className="flex items-center flex-wrap gap-4">
            {flag.media.map((image) => (
              <Image
                key={image}
                src={image}
                width={500}
                height={500}
                className="rounded-lg h-40 w-70"
                alt="uploaded image1"
                loading="lazy"
              />
            ))}
          </div>
        )}
        {flag.messageAttachments && flag.messageAttachments.length > 0 && (
          <div className="bg-accent rounded-md border border-gray-300 flex flex-col items-start gap-2 p-3 w-full">
            {flag.messageAttachments.map((attachment) => (
              <div
                key={attachment.fileKey}
                className="w-full flex items-center gap-3"
              >
                <div className="size-9 rounded-md bg-red-100"></div>
                <div className="flex items-center gap-4 w-full justify-between">
                  <div className="flex flex-col items-start gap-0">
                    <span className="text-sm font-semibold tracking-tight">
                      {attachment.fileName}
                    </span>
                    <span className="text-xs opacity-50">
                      PDF {`${(attachment.fileSize / 1024).toFixed(0)} KB`}
                    </span>
                  </div>
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    className="text-green font-medium text-xs"
                    onClick={() =>
                      downloadFile(attachment.fileUrl, attachment.fileName)
                    }
                  >
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          Original flag reason:
        </span>
        <Badge
          size={"xs"}
          variant={"secondary"}
          className="rounded-sm h-5 pointer-events-none text-ink2/70"
        >
          {flagCategory.label}
        </Badge>
      </div>
      <div className="p-4 rounded-md bg-c-bg border border-line flex flex-col items-start gap-2 w-full">
        <div className="flex items-center gap-2 text-sm text-purple-800">
          <TbMessageForward />
          <span className="uppercase text-xs font-medium">
            appeal statement
          </span>
        </div>
        <p className="text-sm">&quot;{flag.report?.appeal?.reasoning}&quot;</p>
      </div>
      <div className="border-t border-line w-full"></div>
      <div className="flex items-center gap-4 justify-between w-full">
        <div className="flex items-center gap-2">
          {flag.report && (
            <ModAcceptAppealDialog reportId={flag.report.id}>
              <Button
                size="xs"
                className="bg-blue-light text-purple-800 border border-line hover:bg-blue-light/80"
              >
                <Check />
                Overturn &mdash; restore post
              </Button>
            </ModAcceptAppealDialog>
          )}
          {flag.report && (
            <ModRejectAppealDialog reportId={flag.report.id}>
              <Button
                size="xs"
                className="bg-red-100 text-red-800 border border-red-200 hover:bg-red-100/80"
              >
                <TbCancel />
                Maintain flag
              </Button>
            </ModRejectAppealDialog>
          )}
        </div>
        <span className="text-xs opacity-50">
          Flagged {formatDistanceToNow(toDate(flag.report?.createdAt ?? ""))}{" "}
          ago
        </span>
      </div>
    </div>
  );
}
