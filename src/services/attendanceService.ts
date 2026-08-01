import type { AttendanceSummary } from "@/models";
import { AttendanceRepository } from "@/repositories/AttendanceRepository";

const currentMonth = (): string => new Date().toISOString().slice(0, 7);

export const attendanceService = {
  getMonthlySummary(studentId: string, month: string = currentMonth()): Promise<AttendanceSummary> {
    return AttendanceRepository.getMonthlySummary(studentId, month);
  },
};
