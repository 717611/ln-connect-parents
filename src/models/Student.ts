import type { IsoDateTime } from "./common";

export interface Student {
  id: string;
  admissionNumber: string;
  fullName: string;
  photoUrl: string | null;
  classroomId: string;
  className: string;
  section: string;
  rollNumber: string;
  parentId: string;
  dateOfBirth: IsoDateTime | null;
  bloodGroup: string | null;
  isActive: boolean;
}

export const formatClassSection = (student: Pick<Student, "className" | "section">): string =>
  `Class ${(student.className || "").split("-")[0] || "—"}${
    student.section ? `-${student.section}` : ""
  }`;
