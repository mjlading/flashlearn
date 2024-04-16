export const i18n = {
  defaultLocale: "no",
  locales: ["no"],
} as const;

export type Locale = (typeof i18n)["locales"][number];