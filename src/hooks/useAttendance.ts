import { useEffect, useState } from "react";

import type { AttendanceSummary } from "@/models";
import { attendanceService } from "@/services/attendanceService";

export const currentMonth = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

export interface AttendanceQueryResult {
  data: AttendanceSummary | null;
  isPending: boolean;
  isError: boolean;
}

/**
 * Live monthly attendance for a student. Subscribes to the `attendance`
 * collection through Firestore `onSnapshot` and always tears the listener down
 * on unmount or when the student/month changes.
 */
export function useAttendanceSummary(
  studentId: string | null,
  month: string = currentMonth(),
  admissionNumber?: string | null,
): AttendanceQueryResult {
  const [data, setData] = useState<AttendanceSummary | null>(null);
  const [isPending, setIsPending] = useState<boolean>(Boolean(studentId));
  const [isError, setIsError] = useState(false);

  const admission = admissionNumber ?? null;

  useEffect(() => {
    if (!studentId) {
      setData(null);
      setIsPending(false);
      return;
    }

    setIsPending(true);
    setIsError(false);

    let unsubscribe: () => void = () => undefined;

    try {
      unsubscribe = attendanceService.subscribeMonthlySummary(
        studentId,
        month,
        admission,
        (summary) => {
          setData(summary);
          setIsPending(false);
        },
      );
    } catch (error) {
      console.error("[attendance] failed to subscribe", error);
      setIsError(true);
      setIsPending(false);
    }

    return () => unsubscribe();
  }, [studentId, month, admission]);

  return { data, isPending, isError };
}
