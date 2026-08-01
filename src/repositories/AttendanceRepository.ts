import { COLLECTIONS } from "@/constants/config";
import { mockAttendanceSummary } from "@/data/mockData";
import type { AttendanceSummary } from "@/models";

import { listDocs, useFirebase, where } from "./firestore/firestore.utils";
import { mapAttendanceSummary } from "./firestore/mappers";
import { resolveMock } from "./repository.utils";

export interface IAttendanceRepository {
  getMonthlySummary(studentId: string, month: string): Promise<AttendanceSummary>;
}

export const AttendanceRepository: IAttendanceRepository = {
  async getMonthlySummary(studentId, month) {
    if (useFirebase()) {
      const docs = await listDocs(COLLECTIONS.attendance, [
        where("studentId", "==", studentId),
        where("month", "==", month),
      ]);
      return mapAttendanceSummary(studentId, month, docs);
    }
    // Parent-facing attendance is not published by the School Portal yet, so the
    // mock resolves with isAvailable: false and the UI renders its empty state.
    return resolveMock({ ...mockAttendanceSummary, studentId, month });
  },
};
