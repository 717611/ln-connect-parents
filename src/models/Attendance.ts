import type { IsoDateTime } from "./common";

export type AttendanceStatus = "present" | "absent" | "late" | "holiday" | "unmarked";

export interface AttendanceDay {
  date: IsoDateTime;
  status: AttendanceStatus;
}

export interface SubjectAttendance {
  subjectId: string;
  subjectName: string;
  presentCount: number;
  totalCount: number;
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
  subjects: SubjectAttendance[];
  /** The shared backend does not expose parent-facing attendance yet. */
  isAvailable: boolean;
}

export const ATTENDANCE_STATUS_LABEL: Record<AttendanceStatus, string> = {
  present: "Present",
  absent: "Absent",
  late: "Late",
  holiday: "Holiday",
  unmarked: "Not marked",
};
