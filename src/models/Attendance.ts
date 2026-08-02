import type { IsoDateTime } from "./common";

export type AttendanceStatus = "present" | "absent" | "late" | "holiday" | "unmarked";

export interface AttendanceDay {
  date: IsoDateTime;
  status: AttendanceStatus;
  remark?: string;
}

export interface AttendanceSummary {
  studentId: string;
  month: string;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  workingDays: number;
  percentage: number | null;
  days: AttendanceDay[];
  /** False when the School Portal has not marked any attendance for the month. */
  isAvailable: boolean;
}

export const ATTENDANCE_STATUS_LABEL: Record<AttendanceStatus, string> = {
  present: "Present",
  absent: "Absent",
  late: "Late",
  holiday: "Holiday",
  unmarked: "Not marked",
};
