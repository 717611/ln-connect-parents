/**
 * Repository helpers.
 *
 * Repositories are the ONLY layer that knows where data comes from. Today they
 * read from src/data/mockData.ts; later each method body becomes a Firestore
 * query against the shared SchoolOS project. Signatures never change.
 */
import { APP_CONFIG } from "@/constants/config";

export const simulateLatency = <T>(payload: T): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(payload), APP_CONFIG.simulatedLatencyMs);
  });

/** Deep clone so consumers can never mutate the shared placeholder arrays. */
export const clone = <T>(value: T): T => structuredClone(value);

export const resolveMock = <T>(payload: T): Promise<T> => simulateLatency(clone(payload));

export const byNewest = <T>(items: T[], key: keyof T): T[] =>
  [...items].sort((a, b) => String(b[key]).localeCompare(String(a[key])));
