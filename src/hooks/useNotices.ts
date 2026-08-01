import { useQuery } from "@tanstack/react-query";

import { APP_CONFIG } from "@/constants/config";
import type { NoticeScope } from "@/models";
import { noticeService } from "@/services/noticeService";

import { queryKeys } from "./queryKeys";

export function useNotices(scope: NoticeScope, classroomId: string | null) {
  return useQuery({
    queryKey: queryKeys.notices(scope, classroomId),
    queryFn: () => noticeService.listByScope(scope, classroomId),
    staleTime: APP_CONFIG.queryStaleTimeMs,
  });
}
