"use client";

import { Badge } from "../ui/badge";
import { UsersIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Field, FieldDescription, FieldLabel, FieldError } from "../ui/field";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateGroupSchema } from "@/lib/types";
import { createGroupFormSchema } from "@/lib/zod-schema";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { cn, truncateWord } from "@/lib/utils";
import { fraunces } from "@/lib/fonts";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createGroupFn } from "@/actions/group/create-group";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function CreateGroupForm() {
  const route = useRouter();

  const queryClient = useQueryClient();

  const form = useForm<CreateGroupSchema>({
    mode: "onChange",
    resolver: zodResolver(createGroupFormSchema),
    defaultValues: {
      name: "",
      cityMunicipality: "",
      description: "",
      suburb: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createGroupFn,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["groups"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["limited-groups"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["group-count"],
        }),
      ]);
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    watch,
  } = form;

  const handleCreateGroup = async (values: CreateGroupSchema) => {
    try {
      const res = await mutation.mutateAsync(values);

      if (res?.success) {
        toast.success("Success", {
          description: res.success,
        });
        route.push("/home");
      }
    } catch (e) {
      toast.error("Error", {
        description: e instanceof Error ? e.message : "Unknown",
      });
    }
  };

  return (
    <main className="flex items-center justify-center min-h-dvh">
      <form
        id="create-group-form"
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
        onSubmit={handleSubmit(handleCreateGroup)}
      >
        <Card className="w-full max-w-150">
          <CardContent>
            <div className="flex flex-col items-start gap-6">
              <Badge>
                <UsersIcon />
                New Community Group
              </Badge>

              <div className="flex flex-col items-start gap-1">
                <h2
                  className={cn(fraunces.className, "text-2xl font-semibold")}
                >
                  Create your community
                </h2>
                <span className="text-muted-foreground">
                  Fill in the details below. Your group will be publicly visible
                  so anyone in the area can find and join it.
                </span>
              </div>
              <div className="border-t border-line"></div>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-group-form-name">
                      Group name
                    </FieldLabel>
                    <Input
                      id="create-group-form-name"
                      placeholder="e.g. Soweto West Residents"
                      {...field}
                      maxLength={60}
                    />
                    <FieldDescription>
                      Use your suburb or area name so people can find it easily.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-group-form-description">
                      Description
                    </FieldLabel>
                    <Textarea
                      id="create-group-form-description"
                      placeholder="What is this community group for? What kinds of issues will you track? Who should join?"
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Separator />
              <Controller
                name="suburb"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-group-form-suburb">
                      Suburb / area
                    </FieldLabel>
                    <Input
                      id="create-group-form-suburb"
                      {...field}
                      placeholder="e.g. Soweto West"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="cityMunicipality"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-group-form-city">
                      City / municipality
                    </FieldLabel>
                    <Input
                      id="create-group-form-city"
                      {...field}
                      placeholder="e.g. City of Johannesburg"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Separator />
              <div className="flex items-center gap-4 justify-between">
                <Button
                  type="button"
                  variant={"outline"}
                  disabled={isSubmitting}
                  size={"lg"}
                  onClick={() => route.push("/home")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} size={"lg"}>
                  Create community group
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex flex-col items-start gap-4">
          <Card className="w-full max-w-80">
            <CardContent className="flex flex-col items-start gap-2">
              <div className="size-9 rounded-md bg-green-light text-green flex items-center justify-center font-semibold uppercase">
                {watch("name").length === 0 ? "?" : truncateWord(watch("name"))}
              </div>
              <div className="flex flex-col items-start gap-1">
                <span className="text-base">
                  {watch("name").length === 0
                    ? "Your group name"
                    : watch("name")}
                </span>
                <span className="text-sm">
                  {watch("suburb").length === 0
                    ? "Suburb, City"
                    : watch("suburb")}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {watch("description").length === 0
                  ? "Your description will appear here..."
                  : watch("description")}
              </p>
              <div className="flex items-center gap-3">
                <Badge className="h-6">Public</Badge>
                <span className="text-xs text-muted-foreground tracking-tight">
                  0 members
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full max-w-80">
            <CardContent className="flex flex-col items-start gap-1">
              <h4 className="font-semibold text-base">
                Tips for a great group
              </h4>
              <ul className="text-sm text-muted-foreground list-disc ml-5">
                <li>
                  Use the full suburb name so residents can search for it easily
                </li>
                <li>
                  A short, specific description gets more joins than a vague one
                </li>
                <li>
                  Add a recognisable local landmark or street as your cover
                  photo
                </li>
                <li>
                  Start public &mdash; you can switch to moderated anytime
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </form>
    </main>
  );
}
