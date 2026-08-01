import { mockNotices } from "@/data/mockData";
import type { Notice, NoticeScope } from "@/models";

import { byNewest, resolveMock } from "./repository.utils";

export interface INoticeRepository {
  listByScope(scope: NoticeScope, classroomId: string | null): Promise<Notice[]>;
  getById(noticeId: string): Promise<Notice | null>;
}

export const NoticeRepository: INoticeRepository = {
  // TODO(firebase): query(collection(db, COLLECTIONS.notices),
  //   where("scope", "==", scope), where("classroomId", "in", [null, classroomId]),
  //   orderBy("publishedAt", "desc"))
  async listByScope(scope, _classroomId) {
    const filtered = mockNotices.filter((notice) => notice.scope === scope);
    return resolveMock(byNewest(filtered, "publishedAt"));
  },

  // TODO(firebase): getDoc(doc(db, COLLECTIONS.notices, noticeId))
  async getById(noticeId) {
    return resolveMock(mockNotices.find((notice) => notice.id === noticeId) ?? null);
  },
};
