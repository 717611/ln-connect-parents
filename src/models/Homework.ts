import type { IsoDateTime } from "./common";

export type HomeworkStatus = "new" | "in_progress" | "submitted" | "overdue";

export interface Homework {
  id: string;
  classroomId: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  title: string;
  description: string;
  dueAt: IsoDateTime;
  assignedAt: IsoDateTime;
  status: HomeworkStatus;
  attachmentUrls: string[];
}

export const HOMEWORK_STATUS_LABEL: Record<HomeworkStatus, string> = {
  new: "New",
  in_progress: "In Progress",
  submitted: "Submitted",
  overdue: "Overdue",
};
