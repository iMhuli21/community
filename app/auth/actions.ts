"use server";

import { auth } from "@/lib/auth/server";
import {
  SignUpFormSchema,
  signUpFormSchema,
  signInFormSchema,
  SignInFormSchema,
} from "@/lib/zod-schema";

export async function signUpUserFn(values: SignUpFormSchema) {
  try {
    const result = signUpFormSchema.safeParse(values);

    if (result.error) {
      throw new Error("Invalid form data sent.");
    } else if (result.success) {
      const { email, name, password } = result.data;

      const { error } = await auth.signUp.email({
        email,
        name,
        password,
      });

      if (error) {
        throw new Error("Failed to create account.");
      }

      return {
        success: "Successfully created account.",
      };
    }
  } catch (e) {
    if (e instanceof Error) {
      return {
        error: e.message,
      };
    }
  }
}

export async function signInUserFn(values: SignInFormSchema) {
  try {
    const result = signInFormSchema.safeParse(values);

    if (result.error) {
      throw new Error("Invalid form data sent.");
    } else if (result.success) {
      const { email, password } = result.data;

      const { error } = await auth.signIn.email({
        email,
        password,
      });

      if (error) {
        throw new Error("Failed to sign in. Try again");
      }

      return {
        success: "Successfully signed in..",
      };
    }
  } catch (e) {
    if (e instanceof Error) {
      return {
        error: e.message,
      };
    }
  }
}
