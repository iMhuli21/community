"use client";

import {
  ShieldAlertIcon,
  Trash2,
  TriangleAlert,
  UserCircleIcon,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { fraunces } from "@/lib/fonts";
import ErrorMessage from "../error-message";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn, toDate, truncateWord } from "@/lib/utils";
import { Field, FieldError } from "@/components/ui/field";
import { getProfileFn } from "@/actions/user/get-profile";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { EditProfileSchema } from "@/lib/types";
import { editProfileSchema } from "@/lib/zod-schema";
import { updateProfileFn } from "@/actions/user/update-profile";
import { toast } from "sonner";
import ChangeEmailDialog from "./change-email-dialog";
import { useRouter } from "next/navigation";
import ChangePasswordDialog from "./change-password-dialog";

export default function SettingsContent() {
  const route = useRouter();
  const queryClient = useQueryClient();
  const profileRef = useRef<HTMLDivElement | null>(null);
  const accountRef = useRef<HTMLDivElement | null>(null);
  const dangerRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfileFn,
  });

  const form = useForm<EditProfileSchema>({
    mode: "onChange",
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: data?.name ?? "",
      location: data?.location ?? "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = form;

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name ?? "",
        location: data.location ?? "",
      });
    }
  }, [data, form]);

  const profileMutation = useMutation({
    mutationFn: updateProfileFn,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["profile"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["client-auth"],
        }),
      ]);
    },
  });

  const handleEditProfile = async (values: EditProfileSchema) => {
    if (data) {
      try {
        const res = await profileMutation.mutateAsync(values);

        if (res?.success) {
          toast.success("Success", {
            description: res.success,
          });

          route.refresh();
        }
      } catch (e) {
        toast.error("Error", {
          description: e instanceof Error ? e.message : "Unknown",
        });
      }
    }
  };

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-start gap-4 bg-c-bg w-full min-h-dvh p-6 justify-center">
      <div className="w-50 p-2 space-y-4">
        <ToggleGroup
          type="single"
          className="flex flex-col items-start gap-2"
          defaultValue="profile"
        >
          <span className="uppercase text-xs text-muted-foreground font-medium">
            Account
          </span>
          <ToggleGroupItem
            value="profile"
            className="flex items-center gap-2 text-sm font-medium px-3 py-1 data-[state=on]:bg-white w-full rounded-md justify-start text-muted-foreground data-[state=on]:text-black"
            onClick={() => scrollTo({ top: profileRef.current?.offsetTop })}
          >
            <UserCircleIcon className="size-4" />
            Profile
          </ToggleGroupItem>
          <ToggleGroupItem
            value="account&security"
            className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 data-[state=on]:bg-white w-full rounded-md justify-start text-muted-foreground data-[state=on]:text-black"
            onClick={() => scrollTo({ top: accountRef.current?.offsetTop })}
          >
            <ShieldAlertIcon className="size-4" />
            Account & security
          </ToggleGroupItem>
        </ToggleGroup>
        <div className="border-t border-line"></div>
        <div className="flex flex-col items-start gap-2">
          <div
            onClick={() => scrollTo({ top: dangerRef.current?.offsetTop })}
            className="flex items-center gap-2 px-3 py-1 text-sm text-red-500 font-medium"
          >
            <TriangleAlert className="size-4" />
            Danger Zone
          </div>
        </div>
      </div>
      <div className="w-200 space-y-6">
        <div
          id="profile"
          className="bg-white border border-line rounded-md w-200"
          ref={profileRef}
        >
          <div className="border-b border-line p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-light rounded-md flex items-center justify-center text-green">
                <UserCircleIcon className="size-5" />
              </div>
              <div className="flex flex-col items-start gap-0">
                <h4 className={cn(fraunces.className, "font-semibold")}>
                  Profile
                </h4>
                <p className="text-xs text-muted-foreground">
                  How you appear to other community members
                </p>
              </div>
            </div>
          </div>
          <div className="border-b border-line p-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-20">
                <AvatarFallback className="text-xl text-green bg-green-light font-medium">
                  {truncateWord(data?.name ?? "")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start gap-0">
                <h3 className={cn(fraunces.className, "text-lg font-medium")}>
                  {data?.name}
                </h3>
                <span className="text-xs">{data?.email}</span>
                <span className="text-xs opacity-50">
                  Member since{" "}
                  {format(toDate(data?.createdAt ?? ""), "MMMM yyyy")}
                </span>
              </div>
            </div>
          </div>
          {data && (
            <form onSubmit={handleSubmit(handleEditProfile)}>
              <div className="border-b border-line p-4">
                <Controller
                  name="name"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex items-center gap-3 justify-between">
                        <div className="flex flex-col items-start gap-0">
                          <h6 className="font-medium text-sm">Display name</h6>
                          <span className="text-xs text-muted-foreground">
                            This is how your name appears on posts and comments
                          </span>
                        </div>
                        <Input
                          className="max-w-sm w-full bg-c-bg shadow-none"
                          {...field}
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
              <div className="p-4">
                <Controller
                  name="location"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex items-center gap-3 justify-between">
                        <div className="flex flex-col items-start gap-0">
                          <h6 className="font-medium text-sm">Location</h6>
                          <span className="text-xs text-muted-foreground">
                            Your general area &mdash; helps others know which
                            community you&apos;re from
                          </span>
                        </div>
                        <Input
                          className="max-w-sm w-full bg-c-bg shadow-none"
                          {...field}
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              {isDirty && (
                <div className="flex items-center justify-end w-full p-4">
                  <Button size={"sm"} type="submit" disabled={isSubmitting}>
                    Save changes
                  </Button>
                </div>
              )}
            </form>
          )}
        </div>
        <div
          id="account&security"
          className="bg-white border border-line rounded-md w-200"
          ref={accountRef}
        >
          <div className="border-b border-line p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-light rounded-md flex items-center justify-center text-blue">
                <ShieldAlertIcon className="size-5" />
              </div>
              <div className="flex flex-col items-start gap-0">
                <h4 className={cn(fraunces.className, "font-semibold")}>
                  Account & Security
                </h4>
                <p className="text-xs text-muted-foreground">
                  Manage your login credentials and account access
                </p>
              </div>
            </div>
          </div>

          <div className="border-b border-line p-4">
            <div className="flex items-center gap-3 justify-between">
              <div className="flex flex-col items-start gap-0">
                <h6 className="font-medium text-sm">Email Address</h6>
                <span className="text-xs text-muted-foreground">
                  {data?.email} &mdash; used for sign-in and notifications
                </span>
              </div>
              {data && <ChangeEmailDialog email={data.email} />}
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-3 justify-between">
              <div className="flex flex-col items-start gap-0">
                <h6 className="font-medium text-sm">Password</h6>
                <span className="text-xs text-muted-foreground">
                  Change password
                </span>
              </div>
              <ChangePasswordDialog />
            </div>
          </div>
        </div>
        <div
          id="danger"
          className="bg-white border border-red-200 rounded-md w-200 relative overflow-hidden"
          ref={dangerRef}
        >
          <div className="flex items-center gap-2 text-red-800 bg-red-100/30 p-4 absolute top-0 left-0 w-full border-b border-red-200">
            <TriangleAlert className="size-4" />
            <span className={cn(fraunces.className)}>Danger zone</span>
          </div>
          <div className="mt-15 p-4">
            <div className="flex items-center gap-3 justify-between">
              <div className="flex flex-col items-start gap-0">
                <h6 className="font-medium text-sm">Delete account</h6>
                <span className="text-xs text-muted-foreground">
                  Permanently delete your account and all associated data. This
                  action cannot be undone &mdash; your post will remain but
                  anonymised.
                </span>
              </div>
              <Button
                className="bg-red-100 text-red-800 border border-red-200 flex items-center gap-2 text-xs"
                size={"sm"}
              >
                <Trash2 className="size-4" />
                Delete account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
