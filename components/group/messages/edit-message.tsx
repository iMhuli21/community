"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn, truncateWord } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TbSpeakerphone } from "react-icons/tb";
import { useUploadThing } from "@/lib/uploadthing";
import { authClient } from "@/lib/auth/auth-client";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createMessageSchema } from "@/lib/zod-schema";
import { Field, FieldError } from "@/components/ui/field";
import { CreateMessageSchema, MessageType } from "@/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InfoIcon, StarIcon, ImageIcon, SendIcon, X } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getMessageFn } from "@/actions/message/get-message";
import { updateMessageFn } from "@/actions/message/update-message";

export default function EditMessage({ messageId }: { messageId: string }) {
  const queryClient = useQueryClient();

  //get the current message
  const { data, isLoading: authLoading } = useQuery({
    queryKey: ["client-auth"],
    queryFn: () => authClient.getSession(),
  });

  const { data: message, isLoading: messageLoading } = useQuery({
    queryKey: ["message", messageId],
    queryFn: () => getMessageFn(messageId),
  });

  const [activeToggle, setActiveToggle] = useState<MessageType>(
    message?.type ?? "normal",
  );
  const [uploadedFiles, setUploadedFiles] = useState<string[]>(
    message?.media ?? [],
  );
  const [isPending, setIsPending] = useState(false);

  const form = useForm<CreateMessageSchema>({
    mode: "onChange",
    defaultValues: {
      message: message?.body,
    },
    resolver: zodResolver(createMessageSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
    reset,
  } = form;

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      setIsPending(false);
      toast.info("Info", {
        description: "Uploaded successfully!",
      });
      const ufiles = res.map((file) => file.ufsUrl);
      setUploadedFiles((prev) => [...ufiles, ...prev]);
    },
    onUploadError: () => {
      toast.error("Error", {
        description: "Error occurred while uploading",
      });
    },
    onUploadBegin: () => {
      setIsPending(true);
      toast.info("Info", {
        description: "Uploading image...",
      });
    },
  });

  const session = data?.data;

  const messageMutation = useMutation({
    mutationFn: updateMessageFn,
  });

  const handleUpdateMessage = async (values: CreateMessageSchema) => {
    const res = await messageMutation.mutateAsync({
      data: values,
      toggle: activeToggle,
      files: uploadedFiles,
      messageId,
    });

    if (messageMutation.error) {
      return toast.error("Error", {
        description: messageMutation.error?.message,
      });
    }
    if (res?.success) {
      //remove the text after sending the message
      await queryClient.invalidateQueries({ queryKey: ["group-messages"] });
      reset({ message: "" });
      setUploadedFiles([]);
      setActiveToggle("normal");

      return toast.success("Success", {
        description: res.success,
      });
    }
  };

  if (messageLoading || authLoading) {
    return <div>Loading...</div>;
  }
  return (
    <form
      className="py-4 px-5 flex items-start gap-4 w-full"
      onSubmit={handleSubmit(handleUpdateMessage)}
    >
      <Avatar>
        <AvatarFallback className="bg-green-light text-green text-xs font-medium border-2 border-green-light">
          {truncateWord(session?.user.name ?? "")}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-3 w-full">
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
        {uploadedFiles.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            {uploadedFiles.map((file) => (
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
                    setUploadedFiles(
                      uploadedFiles.filter((upF) => upF !== file),
                    )
                  }
                >
                  <X />
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
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
                    ? " text-xs font-medium text-green bg-green-light border-green border"
                    : "bg-c-bg text-xs text-muted-foreground font-medium hover:text-green hover:bg-green-light hover:border-green border-gray-300 border",
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
              disabled={isPending}
            >
              <Label htmlFor="media">
                <ImageIcon />
              </Label>
              <Input
                type="file"
                hidden
                id="media"
                onChange={(e) => {
                  if (e.target.files) {
                    startUpload(Array.from(e.target.files));
                  }
                }}
                multiple
              />
            </Button>
          </div>
          <Button
            size="sm"
            className="pl-4 flex items-center gap-2"
            type="submit"
            disabled={isSubmitting}
          >
            <SendIcon className="size-3" /> Post
          </Button>
        </div>
      </div>
    </form>
  );
}
