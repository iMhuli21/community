"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { signUpUserFn } from "@/app/auth/actions";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { fraunces, instrument, inter } from "@/lib/fonts";
import { signUpFormSchema } from "@/lib/zod-schema";
import { SignUpFormSchema } from "@/lib/types";

export default function SignUp() {
  const route = useRouter();
  const form = useForm<SignUpFormSchema>({
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
    mode: "onChange",
    resolver: zodResolver(signUpFormSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const signUpUser = async (values: SignUpFormSchema) => {
    const res = await signUpUserFn(values);

    if (res?.error) {
      return toast.error("Error", {
        description: res.error,
      });
    } else if (res?.success) {
      toast.success("Success", {
        description: res.success,
      });

      return route.push("/auth/sign-in");
    }
  };

  return (
    <Card className={cn("max-w-md w-full", inter.className)}>
      <CardContent>
        <form
          id="sign-up-form"
          onSubmit={handleSubmit(signUpUser)}
          className="space-y-4"
        >
          <div className="flex flex-col items-start gap-3">
            <h1
              className={cn(
                "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold",
                fraunces.className,
              )}
            >
              Sign Up
            </h1>
            <span
              className={cn(
                instrument.className,
                "text-muted-foreground font-medium",
              )}
            >
              Welcome to community, sign up to connect with your community.
            </span>
          </div>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="sign-up-form-name">Name</FieldLabel>
                <Input
                  {...field}
                  id="sign-up-form-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="John Doe"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="sign-up-form-email">Email</FieldLabel>
                <Input
                  type="email"
                  {...field}
                  id="sign-up-form-email"
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
                <FieldLabel htmlFor="sign-up-form-password">
                  Password
                </FieldLabel>
                <Input
                  {...field}
                  type="password"
                  id="sign-up-form-password"
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
            href="/auth/sign-in"
            className="ml-auto block text-right underline text-green"
          >
            Already have an account?
          </Link>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Sign up
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
