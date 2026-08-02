import { COLLECTIONS } from "@/constants/config";
import { mockAttendanceSummary } from "@/data/mockData";
import type { AttendanceSummary } from "@/models";

import { listDocs, str, useFirebase, where, type RawDoc } from "./firestore/firestore.utils";
import { mapAttendanceSummary } from "./firestore/mappers";
import { resolveMock } from "./repository.utils";

export interface IAttendanceRepository {
  getMonthlySummary(
    studentId: string,
    month: string,
    admissionNumber?: string | null,
  ): Promise<AttendanceSummary>;
}

/** Identifier fields the School Portal may use on an attendance record. */
const ID_FIELDS = ["studentId", "admissionNo", "admissionNumber", "studentAdmissionNo"] as const;

const matchesStudent = (raw: RawDoc, identifiers: string[]): boolean =>
  ID_FIELDS.some((field) => {
    const value = str(raw[field]).trim();
    return Boolean(value) && identifiers.includes(value);
  });

export const AttendanceRepository: IAttendanceRepository = {
  async getMonthlySummary(studentId, month, admissionNumber) {
    if (!useFirebase()) {
      return resolveMock({ ...mockAttendanceSummary, studentId, month });
    }

    const identifiers = [studentId, admissionNumber ?? ""].map((v) => v.trim()).filter(Boolean);
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
        docs
          .filter((raw) => matchesStudent(raw, identifiers))
          .forEach((raw) => byId.set(raw.id, raw));
      } catch (error) {
        console.error("[attendance] failed scanning collection", error);
      }
    }

    return mapAttendanceSummary(studentId, month, [...byId.values()]);
  },
};
