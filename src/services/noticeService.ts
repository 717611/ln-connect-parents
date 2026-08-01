import type { Notice, NoticeScope } from "@/models";
import { NoticeRepository } from "@/repositories/NoticeRepository";

export const noticeService = {
  listByScope(scope: NoticeScope, classroomId: string | null): Promise<Notice[]> {
    return NoticeRepository.listByScope(scope, classroomId);
  },
  async listRecent(scope: NoticeScope, classroomId: string | null, limit: number): Promise<Notice[]> {
    const notices = await NoticeRepository.listByScope(scope, classroomId);
    return notices.slice(0, limit);
  },
  getById(noticeId: string): Promise<Notice | null> {
    return NoticeRepository.getById(noticeId);
  },
};
