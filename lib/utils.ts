import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateWord(word: string) {
  const words = word.split(" ");

  if (words.length > 1) {
    if (words[1].trim().length !== 0) {
      return `${words[0].split("")[0]}${words[1].split("")[0]}`;
    }
  }
  return words[0].split("")[0];
}

export function generateSlug(text: string): string {
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  const random = Math.floor(100000 + Math.random() * 900000);

  return `${slug}-${random}`;
}

export function getRandomPaletteColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
}
