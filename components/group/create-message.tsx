"use client";

import { authClient } from "@/lib/auth/auth-client";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { cn, truncateWord } from "@/lib/utils";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { TbSpeakerphone } from "react-icons/tb";
import { InfoIcon, StarIcon, ImageIcon, SendIcon, X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateMessageSchema, MessageType } from "@/lib/types";
import { createMessageSchema } from "@/lib/zod-schema";
import { Field, FieldError } from "../ui/field";
import { toast } from "sonner";
import { sendMessageFn } from "@/actions/message/create-message";
import {} from "@tanstack/react-query";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useUploadThing } from "@/lib/uploadthing";
import Image from "next/image";

export default function CreateMessage({ groupId }: { groupId: string }) {
  const queryClient = useQueryClient();

  const [activeToggle, setActiveToggle] = useState<MessageType>("normal");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [uploadStatus, setUploadStatus] = useState(false);

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

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      setUploadStatus(false);
      toast.info("Info", {
        description: "Uploaded successfully!",
      });
      console.log(res);
      setUploadedFiles(res.map((file) => file.ufsUrl));
    },
    onUploadError: () => {
      toast.error("Error", {
        description: "Error occurred while uploading",
      });
    },
    onUploadBegin: () => {
      setUploadStatus(true);
      toast.info("Info", {
        description: "Uploading image...",
      });
    },
  });

  const session = data?.data;

  const handleSendMessage = async (values: CreateMessageSchema) => {
    const res = await sendMessageFn(
      values,
      groupId,
      activeToggle,
      uploadedFiles,
    );

    if (res?.error) {
      return toast.error("Error", {
        description: res.error,
      });
    }
    if (res?.success) {
      await queryClient.invalidateQueries({ queryKey: ["group-messages"] });
      //remove the text after sending the message
      reset({ message: "" });
      setUploadedFiles([]);
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
              disabled={uploadStatus}
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
