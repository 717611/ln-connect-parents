import type { IsoDateTime } from "./common";

export type NoticeScope = "school" | "class";
export type NoticePriority = "high" | "medium" | "low";
export type NoticeCategory = "holiday" | "event" | "fee" | "policy" | "academic" | "general";

export interface Notice {
  id: string;
  scope: NoticeScope;
  classroomId: string | null;
  title: string;
  body: string;
  category: NoticeCategory;
  priority: NoticePriority;
  publishedAt: IsoDateTime;
  publishedBy: string;
  attachmentUrls: string[];
}

export const NOTICE_PRIORITY_LABEL: Record<NoticePriority, string> = {
  high: "High Priority",
  medium: "Important",
  low: "Information",
};

export const NOTICE_CATEGORY_LABEL: Record<NoticeCategory, string> = {
  holiday: "Holiday",
  event: "Event",
  fee: "Fees",
  policy: "Policy",
  academic: "Academic",
  general: "General",
};
