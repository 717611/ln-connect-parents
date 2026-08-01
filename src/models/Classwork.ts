import type { IsoDateTime } from "./common";

export type ClassworkKind = "notes" | "explanation" | "activity" | "assessment";

export interface Classwork {
  id: string;
  classroomId: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  title: string;
  description: string;
  kind: ClassworkKind;
  conductedAt: IsoDateTime;
  attachmentUrls: string[];
}

export const CLASSWORK_KIND_LABEL: Record<ClassworkKind, string> = {
  notes: "Notes",
  explanation: "Explanation",
  activity: "Activity",
  assessment: "Assessment",
};
