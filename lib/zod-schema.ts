import * as z from "zod";

export const signUpFormSchema = z.object({
  name: z
    .string({ error: "Name is required." })
    .min(1, { error: "Name should atleast be 1 character long." }),
  email: z.email({ error: "Invalid email." }),
  password: z
    .string({ error: "Password is required" })
    .min(8, { error: "Password shoudl atleast be 8 characters long." }),
});

export type SignUpFormSchema = z.infer<typeof signUpFormSchema>;

export const signInFormSchema = z.object({
  email: z.email({ error: "Invalid email." }),
  password: z
    .string({ error: "Password is required" })
    .min(8, { error: "Password shoudl atleast be 8 characters long." }),
});

export type SignInFormSchema = z.infer<typeof signInFormSchema>;
