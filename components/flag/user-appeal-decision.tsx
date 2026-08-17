import { CheckCircle2Icon, MessageSquareMoreIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { TbGavel } from "react-icons/tb";
import { Appeal, Decision } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { downloadFile, toDate } from "@/lib/utils";
import { Button } from "../ui/button";
import Image from "next/image";

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
    message: {
      id: string;
      body: string;
      media: string[];
      messageAttachments: {
        id: string;
        messageId: string | null;
        fileName: string;
        fileKey: string;
        fileSize: number;
        fileType: string;
        fileUrl: string;
      }[];
    } | null;
    appeal: Appeal | null;
    decision: {
      id: string;
      createdAt: Date;
      status: "dismiss" | "uphold";
      memberId: string;
      reportId: string;
      reasoning: string;
      member: {
        name: string;
        status: "Mod" | "Admin" | "Member";
      } | null;
    } | null;
    group: {
      name: string;
    } | null;
  };
}

export default function UserAppealDecision({ flag }: Props) {
  return (
    <div className="p-4 shadow-[-3px_0px] shadow-green bg-white flex flex-col items-start gap-3 rounded-lg border border-line w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-start gap-2">
          <div className="p-2 bg-green-light text-green flex items-center justify-center rounded-md">
            <CheckCircle2Icon className="size-4" />
          </div>
          <div className="flex flex-col items-start gap-0">
            <h4 className="font-semibold">
              Appeal {flag.decision?.status === "dismiss" ? "won" : "lost"}{" "}
              &mdash; post{" "}
              {flag.decision?.status === "dismiss" ? "restored" : "removed"}
            </h4>
            <span className="text-xs opacity-50">
              Posted in <strong>{flag.group?.name}</strong>. Resolved{" "}
              {formatDistanceToNow(toDate(flag.decision?.createdAt ?? ""))} ago
            </span>
          </div>
        </div>
        <Badge
          size={"xs"}
          className="rounded-sm h-5 pointer-events-none text-green"
        >
          Flag {flag.decision?.status === "dismiss" ? "removed" : "upheld"}
        </Badge>
      </div>
      <div className="w-full flex flex-col items-start gap-2">
        <div className="bg-green-light p-4 border border-green-200 rounded-md flex flex-col items-start gap-2 w-full">
          <div className="flex items-start gap-2 text-sm text-green">
            <MessageSquareMoreIcon className="size-4" />
            <span className="uppercase font-medium text-xs">
              Your{" "}
              {flag.decision?.status === "dismiss" ? "restored" : "removed"}{" "}
              post
            </span>
          </div>
          <p className="text-sm">&quot;{flag.message?.body}&quot;</p>
          {flag.message && flag.message?.media.length > 0 && (
            <div className="flex items-center flex-wrap gap-4">
              {flag.message.media.map((image) => (
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
          {flag.message?.messageAttachments &&
            flag.message?.messageAttachments.length > 0 && (
              <div className="bg-accent rounded-md border border-gray-300 flex flex-col items-start gap-2 p-3 w-full">
                {flag.message.messageAttachments.map((attachment) => (
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
        <div className="bg-green-light p-4 border border-green-200 rounded-md flex flex-col items-start gap-1 w-full">
          <div className="flex items-start gap-2 text-sm text-green">
            <TbGavel className="size-4" />
            <span className="uppercase font-medium text-xs">
              moderator decision
            </span>
          </div>
          <p className="text-sm">&quot;{flag?.decision?.reasoning}&quot;</p>
          <span className="text-xs text-muted-foreground">
            Decided by {flag.decision?.member?.name} (
            {flag.decision?.member?.status}).{" "}
            {formatDistanceToNow(toDate(flag.decision?.createdAt ?? ""))} ago
          </span>
        </div>
      </div>
      <div className="border-t border-line w-full"></div>
      <div className="text-xs opacity-50 flex justify-end w-full">
        Resolved {formatDistanceToNow(toDate(flag.decision?.createdAt ?? ""))}{" "}
        ago
      </div>
    </div>
  );
}
