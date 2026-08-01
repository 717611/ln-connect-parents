/** Shared primitives used across every domain model. */

/** ISO-8601 timestamp string. Firestore Timestamps are mapped to this on read. */
export type IsoDateTime = string;

export interface EntityRef {
  id: string;
  name: string;
}

export interface Paginated<T> {
  items: T[];
  nextCursor: string | null;
}

export type LoadState = "idle" | "loading" | "success" | "error";
