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
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editEmailSchema } from "@/lib/zod-schema";
import { EditEmailSchema } from "@/lib/types";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateEmailFn } from "@/actions/user/update-profile";
import { useRouter } from "next/navigation";
export default function ChangeEmailDialog({ email }: { email: string }) {
  const route = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<EditEmailSchema>({
    mode: "onChange",
    resolver: zodResolver(editEmailSchema),
    defaultValues: {
      email,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  const emailMutation = useMutation({
    mutationFn: updateEmailFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
    },
  });

  const handleUpdateEmail = async (values: EditEmailSchema) => {
    try {
      const res = await emailMutation.mutateAsync(values);

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
          Change email
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Email</DialogTitle>
          <DialogDescription>Update your email</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleUpdateEmail)} className="space-y-3">
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Email</FieldLabel>
                <Input {...field} type="email" />
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
