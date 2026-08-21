import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CreatePollSchema, Option } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { createPollSchema } from "@/lib/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { voting_close_times } from "@/lib/constants";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPollFn } from "@/actions/polls/create-poll";

export default function CreatePollDialog({ groupId }: { groupId: string }) {
  const queryClient = useQueryClient();

  const [options, setOptions] = useState<Option[]>([
    {
      id: 0,
      value: "",
    },
    {
      id: 1,
      value: "",
    },
  ]);

  const form = useForm<CreatePollSchema>({
    mode: "onChange",
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      question: "",
      close_date: "In 3 days",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
    reset,
  } = form;

  const createPollMutation = useMutation({
    mutationFn: createPollFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["polls", groupId],
      });
    },
  });

  const handleCreatePoll = async (values: CreatePollSchema) => {
    try {
      const validOptions = options.filter(
        (option) => option.value.trim().length !== 0,
      );

      if (validOptions.length < 2) {
        throw new Error(
          "Invalid options. Options for the questions have to be a minimum of 2.",
        );
      }

      const res = await createPollMutation.mutateAsync({
        values,
        options: validOptions,
        groupId,
      });

      if (res?.success) {
        toast.success("Success", {
          description: res.success,
        });

        reset({
          close_date: "In 3 days",
          question: "",
        });

        setOptions([
          {
            id: 0,
            value: "",
          },
          {
            id: 1,
            value: "",
          },
        ]);
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
        <Button size={"sm"}>New poll</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Poll</DialogTitle>
          <DialogDescription>Create new poll for the group.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleCreatePoll)} className="space-y-3">
          <Controller
            name="question"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Question</FieldLabel>
                <Textarea
                  {...field}
                  placeholder="What do you want to ask the group?"
                  className="resize-none bg-c-bg"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <div className="w-full space-y-3">
            <Label>Options (2 minimum)</Label>
            <div className="w-full flex flex-col items-start gap-1.5">
              {options.map((option) => (
                <Input
                  value={option.value}
                  key={option.id}
                  placeholder={`Option ${option.id + 1}`}
                  onChange={(e) =>
                    setOptions((prev) =>
                      prev.map((item) =>
                        item.id === option.id
                          ? {
                              ...item,
                              value: e.target.value,
                            }
                          : item,
                      ),
                    )
                  }
                />
              ))}
            </div>
            <Button
              type="button"
              className="text-green border-line border-dashed w-full flex justify-start"
              variant={"ghost"}
              onClick={() =>
                setOptions((prev) => [
                  ...prev,
                  { id: options.length, value: "" },
                ])
              }
            >
              Add option
            </Button>
          </div>
          <Controller
            name="close_date"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Voting closes</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="select time..." />
                  </SelectTrigger>
                  <SelectContent>
                    {voting_close_times.map((time) => (
                      <SelectItem value={time} key={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <DialogFooter className="w-full flex items-center gap-3">
            <DialogClose asChild>
              <Button type="button" variant={"outline"} disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              Post poll
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
