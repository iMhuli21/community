import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogFooter,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ReactNode } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "@/components/ui/button";
import { CreateReasoningSchema } from "@/lib/types";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createReasoningSchema } from "@/lib/zod-schema";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { rejectAppealFn } from "@/actions/appeal/reject-appeal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export default function ModRejectAppealDialog({
  reportId,

  children,
}: {
  reportId: string;
  children: ReactNode;
}) {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const toggle = searchParams.get("active");

  const form = useForm<CreateReasoningSchema>({
    mode: "onChange",
    resolver: zodResolver(createReasoningSchema),
    defaultValues: {
      reasoning: "",
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectAppealFn,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["user-flags", toggle],
        }),
        queryClient.invalidateQueries({
          queryKey: ["mod-flags", toggle],
        }),
      ]);
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  const handleAcceptAppeal = async (values: CreateReasoningSchema) => {
    try {
      const res = await rejectMutation.mutateAsync({ reportId, values });

      if (res?.success) {
        toast.success("Success", {
          description: res.success,
        });

        reset({
          reasoning: "",
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
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dismiss Flag</DialogTitle>
          <DialogDescription>
            Provide your reason for dismissing this flag.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleAcceptAppeal)} className="space-y-3">
          <Controller
            name="reasoning"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Reasoning</FieldLabel>
                <Textarea {...field} placeholder="This is my reason...." />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <DialogFooter className="flex items-center gap-2">
            <DialogClose asChild>
              <Button variant={"secondary"} size={"sm"} disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={isSubmitting}>Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
