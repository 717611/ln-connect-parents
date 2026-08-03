/**
 * Firestore read/write helpers.
 *
 * The ONLY module that talks to Firestore. Repositories call these helpers and
 * map raw documents to domain models, so the rest of the app never sees
 * Firestore types.
 */
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  limit as fbLimit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  type DocumentData,
  type QueryConstraint,
} from "firebase/firestore";

import { getFirestoreDb, isFirebaseConfigured } from "@/config/firebase";
import type { IsoDateTime } from "@/models";

export { arrayUnion, orderBy, where, fbLimit as limit };
export type { QueryConstraint };


/** True when the shared Firebase backend should be used instead of mock data. */
export const useFirebase = (): boolean => isFirebaseConfigured();

export interface RawDoc extends DocumentData {
  id: string;
}

/** Firestore Timestamp | string | Date -> ISO string. */
export const toIso = (value: unknown, fallback: IsoDateTime = new Date().toISOString()): IsoDateTime => {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  const maybe = value as { toDate?: () => Date; seconds?: number };
  if (typeof maybe.toDate === "function") return maybe.toDate().toISOString();
  if (typeof maybe.seconds === "number") return new Date(maybe.seconds * 1000).toISOString();
  return fallback;
};

export const str = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

export const num = (value: unknown, fallback = 0): number =>
  typeof value === "number" ? value : fallback;

export const strList = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

/** Read a collection (or subcollection path segments) with constraints. */
export const listDocs = async (
  path: string | string[],
  constraints: QueryConstraint[] = [],
): Promise<RawDoc[]> => {
  const segments = Array.isArray(path) ? path : [path];
  const [first, ...rest] = segments as [string, ...string[]];
  const ref = collection(getFirestoreDb(), first, ...rest);
  const snapshot = await getDocs(constraints.length ? query(ref, ...constraints) : ref);
  return snapshot.docs.map((snap) => ({ id: snap.id, ...snap.data() }));
};

export const getDocById = async (path: string | string[], id: string): Promise<RawDoc | null> => {
  const segments = Array.isArray(path) ? path : [path];
  const [first, ...rest] = segments as [string, ...string[]];
  const snap = await getDoc(doc(getFirestoreDb(), first, ...rest, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const createDoc = async (
  path: string | string[],
  payload: DocumentData,
): Promise<string> => {
  const segments = Array.isArray(path) ? path : [path];
  const [first, ...rest] = segments as [string, ...string[]];
  const ref = await addDoc(collection(getFirestoreDb(), first, ...rest), payload);
  return ref.id;
};

export const patchDoc = async (
  path: string | string[],
  id: string,
  payload: DocumentData,
): Promise<void> => {
  const segments = Array.isArray(path) ? path : [path];
  const [first, ...rest] = segments as [string, ...string[]];
  await updateDoc(doc(getFirestoreDb(), first, ...rest, id), payload);
};

/** Live document subscription. Returns the unsubscribe handle. */
export const subscribeDoc = (
  path: string | string[],
  id: string,
  onNext: (raw: RawDoc | null) => void,
  onError?: (error: unknown) => void,
): (() => void) => {
  const segments = Array.isArray(path) ? path : [path];
  const [first, ...rest] = segments as [string, ...string[]];
  const ref = doc(getFirestoreDb(), first, ...rest, id);
  return onSnapshot(
    ref,
    (snap) => onNext(snap.exists() ? { id: snap.id, ...snap.data() } : null),
    (error) => {
      console.error("[firestore] snapshot failed", error);
      onError?.(error);
    },
  );
};

/** Live collection subscription. Returns the unsubscribe handle. */
export const subscribeCollection = (
  path: string | string[],
  constraints: QueryConstraint[],
  onNext: (docs: RawDoc[]) => void,
  onError?: (error: unknown) => void,
): (() => void) => {
  const segments = Array.isArray(path) ? path : [path];
  const [first, ...rest] = segments as [string, ...string[]];
  const ref = collection(getFirestoreDb(), first, ...rest);
  return onSnapshot(
    constraints.length ? query(ref, ...constraints) : ref,
    (snap) => onNext(snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }))),
    (error) => {
      console.error("[firestore] collection snapshot failed", error);
      onError?.(error);
    },
  );
};
