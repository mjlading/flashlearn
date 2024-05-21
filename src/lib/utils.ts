import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";
import "moment/locale/nb";
import "moment/locale/en-gb";
import { Locale } from "../../i18n-config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Transforms specified date properties of a type from `Date` to `string`.
 *
 * @template T The original type that contains a `Date` property that needs to be serialized.
 * @template U The key(s) in type `T` that should be serialized to a string.
 *
 * @example
 * type OriginalType = {
 *   date: Date;
 *   name: string;
 * }
 *
 * type SerializedType = SerializedStateDates<OriginalType, 'date'>;
 * // Resulting type:
 * // type SerializedDeck = {
 * //    date: string;
 * //    name: string;
 * // }
 */
export type SerializedStateDates<T, U extends string> = Omit<T, U> & {
  [key in U]: string;
};

export function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

// Returns a string like '2 dager siden'
export function dateDifferenceFromNow(locale: string, date: string) {
  if (locale === "no") moment.locale("nb"); // Set the locale  to norwegian
  else if (locale === "en") moment.locale("en-gb"); // Set the locale  to english (gb) // Hardcoded solution needs case for each supported language
  return moment(date).fromNow();
}

/**
 * Returns a color on a spectrum
 * @param percentage a number between 0 and 1
 * @param hue0 start color of spectrum, when percentage is 0
 * @param hue1 end color of spectrum, when percentage is 1
 * @param lightness the hsl lightness
 */
export function percentageToHsl(
  percentage: number,
  hue0: number,
  hue1: number,
  lightness = 50
) {
  var hue = percentage * (hue1 - hue0) + hue0;
  return "hsl(" + hue + `, 100%, ${lightness}%)`;
}

export function percentageToTwBgColor(percentage: number): string {
  if (percentage >= 100) {
    return "bg-green-500/90"; // Green for 100
  } else if (percentage <= 0) {
    return "bg-red-500/90"; // Red for 0
  } else if (percentage < 25) {
    return "bg-red-500/90";
  } else if (percentage < 50) {
    return "bg-orange-500/90";
  } else if (percentage < 70) {
    return "bg-yellow-500/90";
  } else {
    return "bg-lime-500/90";
  }
}
