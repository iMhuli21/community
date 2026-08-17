"use client";

import { flagMessageFn } from "@/actions/message/flag-message";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { flagCategories } from "@/lib/constants";
import { CreateReasonSchema } from "@/lib/types";
import { createReasonSchema } from "@/lib/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FlagTriangleRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ReportDropdown({
  disabled,
  messageId,
  groupId,
}: {
  disabled: boolean;
  messageId: string;
  groupId: string;
}) {
  const route = useRouter();

  const queryClient = useQueryClient();

  const form = useForm<CreateReasonSchema>({
    mode: "onChange",
    resolver: zodResolver(createReasonSchema),
    defaultValues: {
      reason: "",
    },
  });

  const flagMessageMutation = useMutation({
    mutationFn: flagMessageFn,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["group"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["group-messages"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["mod-flags"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["user-flags"],
        }),
      ]);
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isDirty },
    control,
    reset,
  } = form;

  const handleFlagMessage = async (values: CreateReasonSchema) => {
    try {
      const res = await flagMessageMutation.mutateAsync({
        messageId,
        values,
        groupId,
      });

      if (res?.success) {
        toast.success("Success", {
          description: res.success,
        });

        route.push(`/group/${encodeURIComponent(groupId)}`);
        reset({
          reason: "",
        });
      }
    } catch (e) {
      toast.error("Error", {
        description: e instanceof Error ? e.message : "Unknown",
      });
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="w-full flex items-center gap-2 border border-line hover:bg-muted/80 text-[.78rem] px-[.9rem] py-2 font-semibold rounded-sm bg-c-bg text-ink2 disabled:pointer-events-none disabled:opacity-50"
          disabled={disabled}
        >
          <FlagTriangleRightIcon className="size-4" />
          Report Message
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Message</DialogTitle>
          <DialogDescription>
            Please provide a reason for reporting message.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFlagMessage)} className="space-y-3">
          <Controller
            name="reason"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="reason">Reason</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason...." />
                  </SelectTrigger>
                  <SelectContent>
                    {flagCategories.map((flag) => (
                      <div
                        key={flag.value}
                        className="flex flex-col items-start gap-0 p-2"
                      >
                        <SelectItem value={flag.value}>{flag.label}</SelectItem>
                        <p className="text-xs opacity-50">{flag.description}</p>
                      </div>
                    ))}
                  </SelectContent>
                </Select>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <DialogFooter className="flex items-center gap-2">
            <DialogClose disabled={isSubmitting} asChild>
              <Button variant={"secondary"}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              Flag
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
