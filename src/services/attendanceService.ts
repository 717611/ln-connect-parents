import type { AttendanceSummary } from "@/models";
import { AttendanceRepository } from "@/repositories/AttendanceRepository";

const currentMonth = (): string => new Date().toISOString().slice(0, 7);

export const attendanceService = {
  getMonthlySummary(
    studentId: string,
    month: string = currentMonth(),
    admissionNumber?: string | null,
  ): Promise<AttendanceSummary> {
    return AttendanceRepository.getMonthlySummary(studentId, month, admissionNumber);
  },

  /** Live monthly attendance. Returns the unsubscribe handle. */
  subscribeMonthlySummary(
    studentId: string,
    month: string,
    admissionNumber: string | null,
    onChange: (summary: AttendanceSummary) => void,
  ): () => void {
    return AttendanceRepository.subscribeMonthlySummary(
      studentId,
      month,
      admissionNumber,
      onChange,
    );
  },
};
