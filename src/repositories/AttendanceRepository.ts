import { COLLECTIONS } from "@/constants/config";
import { mockAttendanceSummary } from "@/data/mockData";
import type { AttendanceSummary } from "@/models";

import {
  listDocs,
  str,
  subscribeCollection,
  useFirebase,
  where,
  type RawDoc,
} from "./firestore/firestore.utils";
import { expandAttendanceDocs, mapAttendanceSummary } from "./firestore/mappers";
import { resolveMock } from "./repository.utils";

export interface IAttendanceRepository {
  getMonthlySummary(
    studentId: string,
    month: string,
    admissionNumber?: string | null,
  ): Promise<AttendanceSummary>;
  /** Live listener on the `attendance` collection. Returns the unsubscribe handle. */
  subscribeMonthlySummary(
    studentId: string,
    month: string,
    admissionNumber: string | null,
    onChange: (summary: AttendanceSummary) => void,
  ): () => void;
}

/** Identifier fields the School Portal may use on an attendance record. */
const ID_FIELDS = [
  "studentId",
  "student_id",
  "admissionNo",
  "admissionNumber",
  "admission_no",
  "admission_number",
  "studentAdmissionNo",
  "studentAdmissionNumber",
  "rollNumber",
] as const;

const matchesStudent = (raw: RawDoc, identifiers: string[]): boolean =>
  ID_FIELDS.some((field) => {
    const value = str(raw[field]).trim();
    return Boolean(value) && identifiers.includes(value);
  });

/** Flatten class-day documents first, so nested student rows can match too. */
const matchingRows = (docs: RawDoc[], identifiers: string[]): RawDoc[] =>
  expandAttendanceDocs(docs).filter((raw) => matchesStudent(raw, identifiers));

const identifiersFor = (studentId: string, admissionNumber?: string | null): string[] =>
  [studentId, admissionNumber ?? ""].map((value) => value.trim()).filter(Boolean);

export const AttendanceRepository: IAttendanceRepository = {
  async getMonthlySummary(studentId, month, admissionNumber) {
    if (!useFirebase()) {
      return resolveMock({ ...mockAttendanceSummary, studentId, month });
    }

    const identifiers = identifiersFor(studentId, admissionNumber);
    const byId = new Map<string, RawDoc>();

    for (const identifier of identifiers) {
      for (const field of ID_FIELDS) {
        try {
          const docs = await listDocs(COLLECTIONS.attendance, [where(field, "==", identifier)]);
          docs.forEach((raw) => byId.set(raw.id, raw));
        } catch (error) {
          console.error(`[attendance] failed reading by ${field}`, error);
        }
      }
    }

    // Never show an empty month because of an unexpected field name: fall back to
    // scanning the collection and filtering client-side.
    if (byId.size === 0) {
      try {
        const docs = await listDocs(COLLECTIONS.attendance);
        matchingRows(docs, identifiers).forEach((raw) => byId.set(raw.id, raw));
      } catch (error) {
        console.error("[attendance] failed scanning collection", error);
      }
    }

    return mapAttendanceSummary(studentId, month, [...byId.values()]);
  },

  subscribeMonthlySummary(studentId, month, admissionNumber, onChange) {
    if (!useFirebase()) {
      onChange({ ...mockAttendanceSummary, studentId, month });
      return () => undefined;
    }

    const identifiers = identifiersFor(studentId, admissionNumber);
    const byId = new Map<string, RawDoc>();
    const emit = () => onChange(mapAttendanceSummary(studentId, month, [...byId.values()]));
    const unsubscribers: Array<() => void> = [];

    for (const identifier of identifiers) {
      for (const field of ID_FIELDS) {
        unsubscribers.push(
          subscribeCollection(
            COLLECTIONS.attendance,
            [where(field, "==", identifier)],
            (docs) => {
              docs.forEach((raw) => byId.set(raw.id, raw));
              emit();
            },
            (error) => console.error(`[attendance] live listener failed on ${field}`, error),
          ),
        );
      }
    }

    // Schema-agnostic safety net: a full listener filtered client-side.
    unsubscribers.push(
      subscribeCollection(
        COLLECTIONS.attendance,
        [],
        (docs) => {
          matchingRows(docs, identifiers).forEach((raw) => byId.set(raw.id, raw));
          emit();
        },
        (error) => console.error("[attendance] live collection scan failed", error),
      ),
    );

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  },
};
