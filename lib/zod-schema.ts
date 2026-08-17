import * as z from "zod";

export const categories = [
  "harassment_bullying",
  "hate_speech",
  "threats_violence",
  "misinformation",
  "spam_unwanted",
  "scam_fraud",
  "sexual_explicit",
  "child_safety",
  "self_harm",
  "illegal",
  "privacy_violation",
  "impersonation",
  "malicious",
  "copyright",
  "other",
];

export const signUpFormSchema = z.object({
  name: z
    .string({ error: "Name is required." })
    .min(1, { error: "Name should atleast be 1 character long." }),
  email: z.email({ error: "Invalid email." }),
  password: z
    .string({ error: "Password is required" })
    .min(8, { error: "Password should atleast be 8 characters long." }),
});

export const signInFormSchema = z.object({
  email: z.email({ error: "Invalid email." }),
  password: z
    .string({ error: "Password is required" })
    .min(8, { error: "Password should atleast be 8 characters long." }),
});

export const createGroupFormSchema = z.object({
  name: z
    .string({ error: "Name is required." })
    .min(1, { error: "Name cannot be less the 1 character." }),
  description: z
    .string({ error: "Description is required." })
    .min(1, { error: "Description cannot be less the 1 character." })
    .max(300, { error: "Description cannot be more the 300 characters." }),
  suburb: z
    .string({ error: "Suburb/area is required." })
    .min(1, { error: "Suburb / area cannot be less the 1 character." }),
  cityMunicipality: z
    .string({ error: "City/Municipality is required." })
    .min(1, { error: "City / Municpality cannot be less the 1 character." }),
});

export const createMessageSchema = z.object({
  message: z
    .string()
    .min(1, { error: "Message cannot be less than 1 character." })
    .max(1000, { error: "Content cannot be more than 1000 characters." }),
});

export const createCommentSchema = z.object({
  comment: z
    .string()
    .min(1, { error: "Message cannot be less than 1 character." })
    .max(1000, { error: "Content cannot be more than 1000 characters." }),
});

export const createReasonSchema = z.object({
  reason: z
    .string()
    .refine((val) => categories.includes(val), { error: "Invalid selection." }),
});
export const editProfileSchema = z.object({
  name: z.string().min(1, { error: "Name cannot be less than 1 character." }),
  location: z
    .string()
    .min(1, { error: "Location cannot be less than 1 character." }),
});
export const editEmailSchema = z.object({
  email: z.email({ error: "Invalid email." }),
});
export const editPasswordSchema = z.object({
  newPassword: z
    .string({ error: "New Password is required." })
    .min(8, { error: "New Password should atleast be 8 characters long." }),
  oldPassword: z.string({ error: "Old Password is required." }),
});
export const createReasoningSchema = z.object({
  reasoning: z
    .string({ error: "Reason is required." })
    .min(1, { error: "Reason cannot be less than 1 character" })
    .max(500, { error: "Reason cannot be more than 500 characters." }),
});
