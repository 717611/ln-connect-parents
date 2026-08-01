import { useQuery } from "@tanstack/react-query";

import { APP_CONFIG } from "@/constants/config";
import { authService } from "@/services/authService";
import { studentService } from "@/services/studentService";

import { queryKeys } from "./queryKeys";
import { useAuth } from "./useAuth";

/** Resolves the signed-in parent and their student in one place. */
export function useStudentProfile() {
  const { session } = useAuth();
  const parentId = session?.user.parentId ?? null;

  const parentQuery = useQuery({
    queryKey: queryKeys.parent(parentId ?? "anonymous"),
    queryFn: () => authService.getParent(parentId!),
    enabled: Boolean(parentId),
    staleTime: APP_CONFIG.queryStaleTimeMs,
  });

  const studentQuery = useQuery({
    queryKey: queryKeys.student(parentId ?? "anonymous"),
    queryFn: () => studentService.getStudentByParent(parentId!),
    enabled: Boolean(parentId),
    staleTime: APP_CONFIG.queryStaleTimeMs,
  });

  return {
    parent: parentQuery.data ?? null,
    student: studentQuery.data ?? null,
    isLoading: parentQuery.isPending || studentQuery.isPending,
    isError: parentQuery.isError || studentQuery.isError,
    refetch: () => {
      void parentQuery.refetch();
      void studentQuery.refetch();
    },
  };
}
