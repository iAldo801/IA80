import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateText(text: any, maxLength: any) {
  if (text && text.length > maxLength) {
    return text.substring(0, maxLength - 3) + "...";
  }
  return text;
}