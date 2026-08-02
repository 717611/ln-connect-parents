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
  /** Resolved from parentName / fatherName / guardianName / motherName. */
  parentName: string;
  /** Resolved from parentMobile / parentPhone / phone / mobile / contactNumber. */
  parentMobile: string;
  dateOfBirth: IsoDateTime | null;
  bloodGroup: string | null;
  isActive: boolean;
}

/** Strips any "Class " prefix the backend already stored, avoiding "Class Class 6-A". */
export const cleanClassName = (className: string | null | undefined): string =>
  (className || "").replace(/^\s*class\s+/i, "").trim();

export const formatClassSection = (
  student: Pick<Student, "className" | "section"> | null | undefined,
): string => {
  const base = cleanClassName(student?.className).split("-")[0]?.trim() || "—";
  const section = (student?.section || "").trim();
  return `Class ${base}${section && !base.includes(section) ? `-${section}` : ""}`;
};

/**
 * Comparable class key: "Class 6 - A", "class6a" and "6-A" all become "6a", so
 * casing and separator differences between portals never hide work items.
 */
export const normalizeClass = (cls: string | null | undefined): string =>
  cls ? cls.toLowerCase().replace(/^class\s+/i, "").replace(/[-\s_]/g, "") : "";

