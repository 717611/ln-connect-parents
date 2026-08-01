import { useQuery } from "@tanstack/react-query";

import { APP_CONFIG } from "@/constants/config";
import { classworkService } from "@/services/classworkService";
import { homeworkService } from "@/services/homeworkService";

import { queryKeys } from "./queryKeys";

export function useHomework(classroomId: string | null) {
  return useQuery({
    queryKey: queryKeys.homework(classroomId ?? "none"),
    queryFn: () => homeworkService.listByClassroom(classroomId!),
    enabled: Boolean(classroomId),
    staleTime: APP_CONFIG.queryStaleTimeMs,
  });
}

export function useClasswork(classroomId: string | null) {
  return useQuery({
    queryKey: queryKeys.classwork(classroomId ?? "none"),
    queryFn: () => classworkService.listByClassroom(classroomId!),
    enabled: Boolean(classroomId),
    staleTime: APP_CONFIG.queryStaleTimeMs,
  });
}
