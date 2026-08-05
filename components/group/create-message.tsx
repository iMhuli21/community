"use client";

import { authClient } from "@/lib/auth/auth-client";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cn, truncateWord } from "@/lib/utils";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { TbSpeakerphone } from "react-icons/tb";
import {
  InfoIcon,
  StarIcon,
  ImageIcon,
  SendIcon,
  X,
  PaperclipIcon,
  XIcon,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateMessageSchema, MessageType, UploadDocsType } from "@/lib/types";
import { createMessageSchema } from "@/lib/zod-schema";
import { Field, FieldError } from "../ui/field";
import { toast } from "sonner";
import { sendMessageFn } from "@/actions/message/create-message";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useUploadThing } from "@/lib/uploadthing";
import Image from "next/image";
import ShowProgress from "../show-progress";

export default function CreateMessage({ groupId }: { groupId: string }) {
  const queryClient = useQueryClient();

  const [activeToggle, setActiveToggle] = useState<MessageType>("normal");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedDocs, setUploadedDocs] = useState<UploadDocsType[]>([]);
  const [uploadStatus, setUploadStatus] = useState(false);
  const [controller, setController] = useState<AbortController | null>(null);
  const [progress, setProgress] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["client-auth"],
    queryFn: () => authClient.getSession(),
  });

  const form = useForm<CreateMessageSchema>({
    mode: "onChange",
    defaultValues: {
      message: "",
    },
    resolver: zodResolver(createMessageSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
    reset,
  } = form;

  const { startUpload: uploadImages } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      setUploadStatus(false);
      toast.info("Info", {
        description: "Uploaded successfully!",
      });
      setUploadedImages(res.map((file) => file.ufsUrl));
      setProgress(0);
    },

    onUploadError: (e) => {
      toast.error("Error", {
        description: e.message,
      });
      setProgress(0);
    },

    signal: controller?.signal,
    onUploadProgress(p) {
      setProgress(p);
    },
  });
  const { startUpload: uploadDocs } = useUploadThing("docUploader", {
    onClientUploadComplete: (res) => {
      setUploadStatus(false);
      toast.info("Info", {
        description: "Uploaded successfully!",
      });

      setUploadedDocs(
        res.map(({ key, name, ufsUrl, type, size }) => {
          return { key, name, ufsUrl, type, size };
        }),
      );

      setProgress(0);
    },
    onUploadError: (e) => {
      toast.error("Error", {
        description:
          e.code === "BAD_REQUEST"
            ? "Invalid document type. Only pdf extensions permitted."
            : e.message,
      });
      setProgress(0);
    },

    signal: controller?.signal,
    onUploadProgress(p) {
      setProgress(p);
    },
  });

  const session = data?.data;

  const messageMutation = useMutation({
    mutationFn: sendMessageFn,
  });

  const handleSendMessage = async (values: CreateMessageSchema) => {
    const res = await messageMutation.mutateAsync({
      values,
      groupId,
      messageType: activeToggle,
      images: uploadedImages,
      docs: uploadedDocs,
    });

    if (messageMutation.error) {
      return toast.error("Error", {
        description: messageMutation.error?.message,
      });
    }
    if (res?.success) {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["group-messages", groupId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["group", groupId],
        }),
      ]);
      //remove the text after sending the message
      reset({ message: "" });
      setUploadedImages([]);
      setUploadedDocs([]);
      setActiveToggle("normal");

      return toast.success("Success", {
        description: res.success,
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form
      className="py-4 px-5 flex items-start gap-4"
      onSubmit={handleSubmit(handleSendMessage)}
    >
      <Avatar>
        <AvatarFallback className="bg-green-light text-green text-xs font-medium border-2 border-green-light">
          {truncateWord(session?.user.name ?? "")}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-3 flex-1">
        <Controller
          name="message"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Textarea
                className="resize-none bg-c-bg min-h-11"
                {...field}
                placeholder="Share an update, report an issue, or post a notice for your community..."
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {uploadedImages.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            {uploadedImages.map((file) => (
              <div key={file} className="relative">
                <Image
                  src={file}
                  width={500}
                  height={500}
                  alt="uploaded image."
                  className="aspect-video rounded-lg"
                />
                <div
                  className="absolute right-2 top-2 text-white bg-white/10 rounded-full flex items-center justify-center p-1"
                  onClick={() =>
                    setUploadedImages(
                      uploadedImages.filter((upF) => upF !== file),
                    )
                  }
                >
                  <X />
                </div>
              </div>
            ))}
          </div>
        )}
        {uploadedDocs.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {uploadedDocs.map((doc) => (
              <Button
                size={"sm"}
                type="button"
                key={doc.key}
                variant={"outline"}
                className="relative"
              >
                {doc.name}
                <div
                  className="absolute -top-2 -right-2 flex items-center justify-center size-5 rounded-full text-destructive p-1 bg-red-100"
                  onClick={() =>
                    setUploadedDocs((prev) =>
                      prev.filter((item) => item !== doc),
                    )
                  }
                >
                  <XIcon className="size-3" />
                </div>
              </Button>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ToggleGroup
              type="single"
              defaultValue={activeToggle}
              onValueChange={(val: MessageType) => setActiveToggle(val)}
              size={"sm"}
            >
              <ToggleGroupItem
                value="report"
                className={cn(
                  activeToggle === "report"
                    ? "text-xs font-medium text-destructive/80 bg-destructive/10 border-destructive border"
                    : "bg-c-bg text-xs text-muted-foreground font-medium hover:text-destructive/80 hover:bg-destructive/10 hover:border-destructive border-gray-300 border",
                )}
              >
                <InfoIcon />
                Report
              </ToggleGroupItem>
              <ToggleGroupItem
                value="notice"
                className={cn(
                  activeToggle === "notice"
                    ? " text-xs  font-medium text-blue bg-blue-light border-blue border"
                    : "bg-c-bg text-xs text-muted-foreground font-medium hover:text-blue hover:bg-blue-light hover:border-blue border-gray-300 border",
                )}
              >
                <TbSpeakerphone />
                Notice
              </ToggleGroupItem>
              <ToggleGroupItem
                value="announcement"
                className={cn(
                  activeToggle === "announcement"
                    ? " text-xs font-medium text-amber bg-amber-light border-amber border"
                    : "bg-c-bg text-xs text-muted-foreground font-medium hover:text-amber hover:bg-amber-light hover:border-amber border-gray-300 border",
                )}
              >
                <StarIcon />
                Announce
              </ToggleGroupItem>
            </ToggleGroup>
            <Button
              size={"sm"}
              value="latest"
              variant={"outline"}
              className="bg-c-bg text-xs text-muted-foreground font-medium"
              type="button"
              disabled={uploadStatus}
            >
              <Label htmlFor="media">
                <ImageIcon />
              </Label>
              <Input
                type="file"
                hidden
                id="media"
                onChange={async (e) => {
                  if (e.target.files) {
                    const new_controller = new AbortController();
                    setController(new_controller);
                    await uploadImages(Array.from(e.target.files));

                    setTimeout(() => controller?.abort(), 30_000);
                  }
                }}
                multiple
              />
            </Button>
            <Button
              size={"sm"}
              value="latest"
              variant={"outline"}
              className="bg-c-bg text-xs text-muted-foreground font-medium relative"
              type="button"
              disabled={uploadStatus}
            >
              {uploadedDocs.length > 0 && (
                <div className="absolute -right-3 -top-2 bg-green-light text-green p-1 size-5 rounded-full flex items-center justify-center font-bold">
                  {uploadedDocs.length}
                </div>
              )}
              <Label htmlFor="docs">
                <PaperclipIcon />
              </Label>
              <Input
                type="file"
                hidden
                id="docs"
                onChange={async (e) => {
                  if (e.target.files) {
                    const new_controller = new AbortController();
                    setController(new_controller);

                    await uploadDocs(Array.from(e.target.files));

                    setTimeout(() => controller?.abort(), 30_000);
                  }
                }}
                multiple
              />
            </Button>
          </div>
          <Button
            className="pl-4 flex items-center gap-2"
            type="submit"
            disabled={isSubmitting}
          >
            <SendIcon className="size-3" /> Post
          </Button>
        </div>
      </div>
      {progress > 0 && <ShowProgress value={50} />}
    </form>
  );
}
