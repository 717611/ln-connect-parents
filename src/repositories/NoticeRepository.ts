import { COLLECTIONS } from "@/constants/config";
import { mockNotices } from "@/data/mockData";
import type { Notice, NoticeScope } from "@/models";

import { getDocById, listDocs, str, useFirebase, type RawDoc } from "./firestore/firestore.utils";
import { mapNotice } from "./firestore/mappers";
import { byNewest, resolveMock } from "./repository.utils";

export interface INoticeRepository {
  listByScope(scope: NoticeScope, classroomId: string | null): Promise<Notice[]>;
  getById(noticeId: string): Promise<Notice | null>;
}

/** Newest first, tolerating docs that only carry `date` or nothing at all. */
const rawTimestamp = (raw: RawDoc): string => {
  const value = raw["publishedAt"] ?? raw["createdAt"] ?? raw["date"] ?? "";
  if (typeof value === "string") return value;
  const maybe = value as { toDate?: () => Date; seconds?: number };
  if (typeof maybe?.toDate === "function") return maybe.toDate().toISOString();
  if (typeof maybe?.seconds === "number") return new Date(maybe.seconds * 1000).toISOString();
  return "";
};

/**
 * A notice is visible when it targets everyone, carries no audience field at
 * all, or explicitly mentions the student's class. Never filter it out just
 * because the School Portal used a different field name.
 */
const isForAudience = (raw: RawDoc, classroomId: string | null): boolean => {
  const audience = str(raw["targetAudience"] ?? raw["audience"] ?? raw["target"]).trim();
  if (!audience) return true;
  const upper = audience.toUpperCase();
  if (upper === "ALL" || upper === "EVERYONE" || upper === "PARENTS") return true;
  if (!classroomId) return false;
  return upper.includes(classroomId.toUpperCase());
};

const matchesScope = (raw: RawDoc, scope: NoticeScope, classroomId: string | null): boolean => {
  const noticeClass = str(raw["classroomId"] ?? raw["classId"]).trim();
  const declaredScope = str(raw["scope"]).trim().toLowerCase();
  if (scope === "class") {
    if (declaredScope === "class") return !noticeClass || !classroomId || noticeClass === classroomId;
    return Boolean(noticeClass) && (!classroomId || noticeClass === classroomId);
  }
  if (declaredScope === "class") return false;
  return !noticeClass;
};

export const NoticeRepository: INoticeRepository = {
  async listByScope(scope, classroomId) {
    if (useFirebase()) {
      // Read the whole collection with no Firestore constraints: field names vary
      // between School Portal releases and a strict query silently returns 0 docs.
      const docs = await listDocs(COLLECTIONS.notices);
      const sorted = [...docs].sort((a, b) => rawTimestamp(b).localeCompare(rawTimestamp(a)));
      const visible = sorted.filter((raw) => isForAudience(raw, classroomId));
      const scoped = visible.filter((raw) => matchesScope(raw, scope, classroomId));
      // Never show an empty school feed when notices exist but carry odd metadata.
      const chosen = scoped.length === 0 && scope === "school" ? visible : scoped;
      return chosen.map(mapNotice);
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
