import { useQuery } from "@tanstack/react-query";

import { APP_CONFIG } from "@/constants/config";
import { classworkService } from "@/services/classworkService";
import { homeworkService } from "@/services/homeworkService";

import { queryKeys } from "./queryKeys";

export function useHomework(classroomId: string | null, className?: string | null) {
  return useQuery({
    queryKey: [...queryKeys.homework(classroomId ?? "none"), className ?? ""],
    queryFn: () => homeworkService.listByClassroom(classroomId!, className ?? null),
    enabled: Boolean(classroomId),
    staleTime: APP_CONFIG.queryStaleTimeMs,
  });
}

export function useClasswork(classroomId: string | null, className?: string | null) {
  return useQuery({
    queryKey: [...queryKeys.classwork(classroomId ?? "none"), className ?? ""],
    queryFn: () => classworkService.listByClassroom(classroomId!, className ?? null),
    enabled: Boolean(classroomId),
    staleTime: APP_CONFIG.queryStaleTimeMs,
  });
}
