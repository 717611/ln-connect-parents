import { normalizeClass } from "@/models";

import { str, type RawDoc } from "./firestore/firestore.utils";

/** Field names the School Portal uses to target a class on work documents. */
const CLASS_FIELDS = [
  "classroomId",
  "classId",
  "targetClass",
  "className",
  "class",
  "classSection",
] as const;

/**
 * A work item belongs to the student when any class-ish field matches the
 * classroom id or the student's class name, ignoring casing, the "Class "
 * prefix and separators ("Class 6-A" === "6a"). Items with no class field at
 * all are treated as school-wide and kept.
 */
export const matchesStudentClass = (
  raw: RawDoc,
  classroomId: string | null,
  className: string | null,
): boolean => {
  const wanted = [classroomId, className]
    .map((value) => normalizeClass(value))
    .filter((value) => value.length > 0);
  if (wanted.length === 0) return true;

  const present = CLASS_FIELDS.map((field) => str(raw[field]).trim()).filter(Boolean);
  if (present.length === 0) return true;

  return present.some((value) => {
    const normalized = normalizeClass(value);
    return wanted.some((target) => normalized === target || normalized.startsWith(target));
  });
};
