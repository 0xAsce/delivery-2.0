import { getWilayas } from "./locations";

export const WILAYAS = getWilayas().map(
  (wilaya) => wilaya.name
);

export type Wilaya =
  (typeof WILAYAS)[number];

export function isValidWilaya(
  value: unknown
): value is Wilaya {
  return (
    typeof value === "string" &&
    WILAYAS.includes(
      value as Wilaya
    )
  );
}