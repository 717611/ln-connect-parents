import { COLLECTIONS } from "@/constants/config";
import { mockNotices } from "@/data/mockData";
import type { Notice, NoticeScope } from "@/models";

import { getDocById, listDocs, orderBy, useFirebase, where } from "./firestore/firestore.utils";
import { mapNotice } from "./firestore/mappers";
import { byNewest, resolveMock } from "./repository.utils";

export interface INoticeRepository {
  listByScope(scope: NoticeScope, classroomId: string | null): Promise<Notice[]>;
  getById(noticeId: string): Promise<Notice | null>;
}

export const NoticeRepository: INoticeRepository = {
  async listByScope(scope, classroomId) {
    if (useFirebase()) {
      const docs = await listDocs(COLLECTIONS.notices, [
        where("scope", "==", scope),
        orderBy("publishedAt", "desc"),
      ]);
      const notices = docs.map(mapNotice);
      return scope === "class" && classroomId
        ? notices.filter((notice) => !notice.classroomId || notice.classroomId === classroomId)
        : notices;
    }
    const filtered = mockNotices.filter((notice) => notice.scope === scope);
    return resolveMock(byNewest(filtered, "publishedAt"));
  },

  async getById(noticeId) {
    if (useFirebase()) {
      const raw = await getDocById(COLLECTIONS.notices, noticeId);
      return raw ? mapNotice(raw) : null;
    }
    return resolveMock(mockNotices.find((notice) => notice.id === noticeId) ?? null);
  },
};
