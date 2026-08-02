import { useQuery } from "@tanstack/react-query";

import { APP_CONFIG } from "@/constants/config";
import { attendanceService } from "@/services/attendanceService";

import { queryKeys } from "./queryKeys";

export const currentMonth = (): string => new Date().toISOString().slice(0, 7);

export function useAttendanceSummary(
  studentId: string | null,
  month: string = currentMonth(),
  admissionNumber?: string | null,
) {
  return useQuery({
    queryKey: queryKeys.attendance(studentId ?? "none", month),
    queryFn: () => attendanceService.getMonthlySummary(studentId!, month, admissionNumber ?? null),
    enabled: Boolean(studentId),
    staleTime: APP_CONFIG.queryStaleTimeMs,
  });
}
