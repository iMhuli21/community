"use client";

import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { TbMessageForward } from "react-icons/tb";
import { Controller, useForm } from "react-hook-form";
import { CreateReasoningSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createReasoningSchema } from "@/lib/zod-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { sendAppealFn } from "@/actions/appeal/send-appeal";

export default function SubmitAppealDialog({ reportId }: { reportId: string }) {
  const queryClient = useQueryClient();

  const form = useForm<CreateReasoningSchema>({
    mode: "onChange",
    resolver: zodResolver(createReasoningSchema),
    defaultValues: {
      reasoning: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  const appealMutation = useMutation({
    mutationFn: sendAppealFn,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["user-flags"],
        }),
      ]);
    },
  });

  const handleAppeal = async (values: CreateReasoningSchema) => {
    try {
      const res = await appealMutation.mutateAsync({ reportId, values });

      if (res?.success) {
        toast.success("Success", {
          description: res.success,
        });

        reset({ reasoning: "" });
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
        <Button
          size="xs"
          className="bg-blue-light text-blue border border-blue-200 hover:bg-blue-light/80"
        >
          <TbMessageForward />
          Submit appeal
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogHeader>
            <DialogTitle>Submit an Appeal</DialogTitle>
            <DialogDescription>
              Provide a reason for your post.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAppeal)} className="space-y-3">
            <Controller
              name="reasoning"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Appeal</FieldLabel>
                  <Textarea
                    {...field}
                    placeholder="This is my reason for the post...."
                    className="resize-none"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <DialogFooter className="flex items-center gap-2">
              <DialogClose asChild>
                <Button
                  variant={"secondary"}
                  size={"sm"}
                  type="button"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" size={"sm"} disabled={isSubmitting}>
                <TbMessageForward />
                Make appeal
              </Button>
            </DialogFooter>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
