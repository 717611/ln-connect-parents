export type AttendanceStatus =
  | "present"
  | "absent"
  | "late"
  | "half_day"
  | "holiday"
  | "unmarked";

export interface AttendanceDay {
  /** Local calendar day as `YYYY-MM-DD` — never a timestamp, to avoid TZ drift. */
  date: string;
  status: AttendanceStatus;
  remark?: string;
}

export interface AttendanceSummary {
  studentId: string;
  month: string;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  halfDays: number;
  /** Days the school actually marked (present + absent + late + half day). */
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
  half_day: "Half Day",
  holiday: "Holiday",
  unmarked: "Not marked",
};
