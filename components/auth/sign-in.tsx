"use client";

import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { signInUserFn } from "@/app/auth/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { fraunces, instrument, inter } from "@/lib/fonts";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { signInFormSchema } from "@/lib/zod-schema";
import { SignInFormSchema } from "@/lib/types";

export default function SignIn() {
  const route = useRouter();
  const form = useForm<SignInFormSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
    resolver: zodResolver(signInFormSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  const signInUser = async (values: SignInFormSchema) => {
    const res = await signInUserFn(values);

    if (res?.error) {
      return toast.error("Error", {
        description: res.error,
      });
    } else if (res?.success) {
      toast.success("Success", {
        description: res.success,
      });

      reset({
        email: "",
        password: "",
      });

      return route.push("/home");
    }
  };

  return (
    <Card className={cn("max-w-md w-full", inter.className)}>
      <CardContent>
        <form
          id="sign-in-form"
          onSubmit={handleSubmit(signInUser)}
          className="space-y-4"
        >
          <div className="flex flex-col items-start gap-3">
            <h1
              className={cn(
                "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold",
                fraunces.className,
              )}
            >
              Sign In
            </h1>
            <span
              className={cn(
                instrument.className,
                "text-muted-foreground font-medium",
              )}
            >
              Welcome back to community, sign in to connect with your community.
            </span>
          </div>

          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="sign-in-form-email">Email</FieldLabel>
                <Input
                  type="email"
                  {...field}
                  id="sign-in-form-email"
                  aria-invalid={fieldState.invalid}
                  placeholder="johndoe@gmail.com"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="sign-in-form-password">
                  Password
                </FieldLabel>
                <Input
                  {...field}
                  type="password"
                  id="sign-in-form-password"
                  aria-invalid={fieldState.invalid}
                  placeholder="****************"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Link
            href="/auth/sign-up"
            className="ml-auto block text-right underline text-green"
          >
            Don&apos;t have an account
          </Link>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Sign In
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
