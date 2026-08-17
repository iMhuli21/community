import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { EditPasswordSchema } from "@/lib/types";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editPasswordSchema } from "@/lib/zod-schema";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePasswordFn } from "@/actions/user/update-profile";

export default function ChangePasswordDialog() {
  const route = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<EditPasswordSchema>({
    mode: "onChange",
    resolver: zodResolver(editPasswordSchema),
    defaultValues: {
      newPassword: "",
      oldPassword: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  const passwordMutation = useMutation({
    mutationFn: updatePasswordFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
    },
  });

  const handleUpdatePassword = async (values: EditPasswordSchema) => {
    try {
      const res = await passwordMutation.mutateAsync(values);

      if (res?.success) {
        toast.success("Success", {
          description: res.success,
        });

        return route.push("/auth/sign-in");
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
          size={"sm"}
          className="bg-green-light border border-green-200 text-green text-xs hover:bg-green-light/80"
        >
          Change password
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>Update your password</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleUpdatePassword)}
          className="space-y-3"
        >
          <Controller
            name="oldPassword"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Old Password</FieldLabel>
                <Input {...field} type="password" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="newPassword"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>New Password</FieldLabel>
                <Input {...field} type="password" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <DialogFooter className="flex items-center gap-2">
            <DialogClose asChild>
              <Button variant="secondary" type="button" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
