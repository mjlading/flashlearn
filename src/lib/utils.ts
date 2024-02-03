import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
