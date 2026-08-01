import { mockAttendanceSummary } from "@/data/mockData";
import type { AttendanceSummary } from "@/models";

import { resolveMock } from "./repository.utils";

export interface IAttendanceRepository {
  getMonthlySummary(studentId: string, month: string): Promise<AttendanceSummary>;
}

export const AttendanceRepository: IAttendanceRepository = {
  // TODO(firebase): query(collection(db, COLLECTIONS.attendance),
  //   where("studentId", "==", studentId), where("month", "==", month))
  // Parent-facing attendance is not exposed by the shared backend yet, so this
  // resolves with isAvailable: false and the UI renders its empty state.
  async getMonthlySummary(studentId, month) {
    return resolveMock({ ...mockAttendanceSummary, studentId, month });
  },
};
