import { FlagIcon, RotateCwIcon } from "lucide-react";
import { TbMessageForward } from "react-icons/tb";
import { Badge } from "../ui/badge";
import { Appeal } from "@/lib/types";
import { formatRelative } from "date-fns";
import { downloadFile, toDate } from "@/lib/utils";
import { useMemo } from "react";
import { flagCategories } from "@/lib/constants";
import { Button } from "../ui/button";
import Image from "next/image";

interface Props {
  flag: {
    status: "resolved" | "none";
    id: string;
    createdAt: Date;
    groupId: string;
    body: string;
    media: string[];
    type: "report" | "notice" | "announcement" | "normal";
    isUrgent: boolean;
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
    group: {
      name: string;
    } | null;
    report: {
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
      appeal: Appeal | null;
    } | null;
  };
}

export default function AppealPost({ flag }: Props) {
  const reason = useMemo(() => {
    return flagCategories.filter((cat) => cat.value === flag.report?.reason)[0]
      .label;
  }, [flag]);
  return (
    <div className="p-4 shadow-[-3px_0px] shadow-blue bg-white flex flex-col items-start gap-3 rounded-lg border border-line w-full">
      <div className="flex items-center gap-4 justify-between w-full">
        <div className="flex items-start gap-2">
          <div className="p-2 text-blue bg-purple-100 rounded-md">
            <RotateCwIcon className="size-4 -rotate-180" />
          </div>
          <div className="flex flex-col items-start gap-0">
            <p className="font-semibold text-sm">
              Appeal submitted &mdash; under review
            </p>
            <span className="text-xs opacity-50">
              Posted in <strong>{flag.group?.name}</strong>
            </span>
          </div>
        </div>
        <Badge
          size={"xs"}
          variant={"notice"}
          className="rounded-sm h-5 pointer-events-none text-blue"
        >
          under review
        </Badge>
      </div>
      <div className="p-4 rounded-md bg-red-100 border border-red-200 flex flex-col items-start gap-2 w-full">
        <div className="flex items-center gap-2">
          <FlagIcon className="size-4 text-red-800" />
          <span className="text-sm font-semibold text-red-800 uppercase tracking-wide">
            Your flagged post
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
        <p className="text-xs text-red-800 font-medium">
          Removed for: {reason}
        </p>
      </div>

      <div className="border-t border-line w-full"></div>
      <div className="p-4 rounded-md bg-blue-light border border-blue-200 flex flex-col items-start gap-2 w-full">
        <div className="flex items-center gap-2 text-blue">
          <TbMessageForward />
          <span className="text-sm font-semibold uppercase">your appeal</span>
        </div>
        <p className="text-sm">&quot;{flag.report?.appeal?.reasoning}&quot;</p>
      </div>
      <div className="flex items-center gap-4 justify-end w-full">
        <span className="text-xs opacity-50">waiting for response</span>
      </div>
    </div>
  );
}
