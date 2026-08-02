/**
 * Firestore document -> domain model mappers.
 *
 * Field names mirror the shared School Portal (SchoolOS) Firestore schema and
 * tolerate small naming differences so the parent portal never crashes on a
 * missing field.
 */
import type {
  AttendanceDay,
  AttendanceStatus,
  AttendanceSummary,
  Classroom,
  Classwork,
  ClassworkKind,
  Complaint,
  ComplaintCategory,
  ComplaintMessage,
  ComplaintStatus,
  GalleryAlbum,
  GalleryAlbumKind,
  GalleryPhoto,
  Homework,
  HomeworkStatus,
  Notice,
  NoticeCategory,
  NoticePriority,
  NoticeScope,
  Parent,
  ParentRelation,
  Student,
  Teacher,
} from "@/models";

import { num, str, strList, toIso, type RawDoc } from "./firestore.utils";

const pick = <T extends string>(value: unknown, allowed: readonly T[], fallback: T): T =>
  allowed.includes(value as T) ? (value as T) : fallback;

/** First non-empty string among School Portal field aliases. */
const firstStr = (raw: RawDoc, keys: string[], fallback = ""): string => {
  for (const key of keys) {
    const value = str(raw[key]).trim();
    if (value) return value;
  }
  return fallback;
};

export const mapStudent = (raw: RawDoc): Student => ({
  id: raw.id,
  admissionNumber: str(raw["admissionNumber"] ?? raw["admissionNo"]),
  fullName: str(raw["fullName"] ?? raw["name"]),
  photoUrl: str(raw["photoUrl"]) || null,
  classroomId: str(raw["classroomId"] ?? raw["classId"]),
  className: str(raw["className"] ?? raw["class"]),
  section: str(raw["section"]),
  rollNumber: str(raw["rollNumber"] ?? raw["rollNo"]),
  parentId: str(raw["parentId"]),
  parentName: firstStr(
    raw,
    ["parentName", "fatherName", "guardianName", "motherName"],
    "Parent",
  ),
  parentMobile: firstStr(
    raw,
    ["parentMobile", "parentPhone", "phone", "mobile", "contactNumber"],
    "N/A",
  ),
  dateOfBirth: raw["dateOfBirth"] ? toIso(raw["dateOfBirth"]) : null,
  bloodGroup: str(raw["bloodGroup"]) || null,
  isActive: raw["isActive"] !== false,
});


export const mapParent = (raw: RawDoc): Parent => ({
  id: raw.id,
  fullName: str(raw["fullName"] ?? raw["name"]),
  relation: pick<ParentRelation>(raw["relation"], ["father", "mother", "guardian"], "guardian"),
  mobileNumber: str(raw["mobileNumber"] ?? raw["phone"]),
  email: str(raw["email"]) || null,
  photoUrl: str(raw["photoUrl"]) || null,
  studentIds: strList(raw["studentIds"]),
});

export const mapClassroom = (raw: RawDoc): Classroom => ({
  id: raw.id,
  className: str(raw["className"] ?? raw["name"]),
  section: str(raw["section"]),
  classTeacherId: str(raw["classTeacherId"] ?? raw["teacherId"]),
  academicYear: str(raw["academicYear"]),
});

export const mapTeacher = (raw: RawDoc): Teacher => ({
  id: raw.id,
  fullName: str(raw["fullName"] ?? raw["name"]),
  photoUrl: str(raw["photoUrl"]) || null,
  subjectIds: strList(raw["subjectIds"]),
  designation: str(raw["designation"], "Teacher"),
});

export const mapHomework = (raw: RawDoc): Homework => ({
  id: raw.id,
  classroomId: str(raw["classroomId"] ?? raw["classId"]),
  subjectId: str(raw["subjectId"]),
  subjectName: str(raw["subjectName"] ?? raw["subject"]),
  teacherId: str(raw["teacherId"]),
  teacherName: str(raw["teacherName"] ?? raw["assignedBy"]),
  title: str(raw["title"]),
  description: str(raw["description"]),
  dueAt: toIso(raw["dueAt"] ?? raw["dueDate"]),
  assignedAt: toIso(raw["assignedAt"] ?? raw["createdAt"]),
  status: pick<HomeworkStatus>(
    raw["status"],
    ["new", "in_progress", "submitted", "overdue"],
    "new",
  ),
  attachmentUrls: strList(raw["attachmentUrls"] ?? raw["attachments"]),
});

export const mapClasswork = (raw: RawDoc): Classwork => ({
  id: raw.id,
  classroomId: str(raw["classroomId"] ?? raw["classId"]),
  subjectId: str(raw["subjectId"]),
  subjectName: str(raw["subjectName"] ?? raw["subject"]),
  teacherId: str(raw["teacherId"]),
  teacherName: str(raw["teacherName"]),
  title: str(raw["title"]),
  description: str(raw["description"]),
  kind: pick<ClassworkKind>(
    raw["kind"] ?? raw["type"],
    ["notes", "explanation", "activity", "assessment"],
    "notes",
  ),
  conductedAt: toIso(raw["conductedAt"] ?? raw["date"] ?? raw["createdAt"]),
  attachmentUrls: strList(raw["attachmentUrls"] ?? raw["attachments"]),
});

export const mapNotice = (raw: RawDoc): Notice => ({
  id: raw.id,
  scope: pick<NoticeScope>(raw["scope"], ["school", "class"], "school"),
  classroomId: str(raw["classroomId"] ?? raw["classId"]) || null,
  title: str(raw["title"]),
  body: str(raw["body"] ?? raw["description"] ?? raw["content"]),
  category: pick<NoticeCategory>(
    raw["category"],
    ["holiday", "event", "fee", "policy", "academic", "general"],
    "general",
  ),
  priority: pick<NoticePriority>(raw["priority"], ["high", "medium", "low"], "medium"),
  publishedAt: toIso(raw["publishedAt"] ?? raw["createdAt"]),
  publishedBy: str(raw["publishedBy"] ?? raw["author"], "School Office"),
  attachmentUrls: strList(raw["attachmentUrls"] ?? raw["attachments"]),
});

export const mapComplaint = (raw: RawDoc): Complaint => ({
  id: raw.id,
  ticketNumber: str(raw["ticketNumber"] ?? raw["ticketId"], raw.id.slice(0, 8).toUpperCase()),
  studentId: str(raw["studentId"]),
  subject: str(raw["subject"] ?? raw["title"]),
  description: str(raw["description"]),
  category: pick<ComplaintCategory>(
    raw["category"],
    [
      "academics",
      "transport",
      "fees",
      "infrastructure",
      "discipline",
      "wellbeing",
      "administration",
      "other",
    ],
    "other",
  ),
  status: pick<ComplaintStatus>(
    raw["status"],
    ["open", "in_progress", "resolved", "closed"],
    "open",
  ),
  createdAt: toIso(raw["createdAt"]),
  updatedAt: toIso(raw["updatedAt"] ?? raw["createdAt"]),
  messageCount: num(raw["messageCount"], 1),
});

export const mapComplaintMessage = (complaintId: string) => (raw: RawDoc): ComplaintMessage => ({
  id: raw.id,
  complaintId,
  authorRole: raw["authorRole"] === "school" ? "school" : "parent",
  authorName: str(raw["authorName"], "School"),
  body: str(raw["body"] ?? raw["message"]),
  sentAt: toIso(raw["sentAt"] ?? raw["createdAt"]),
});

export const mapGalleryAlbum = (raw: RawDoc): GalleryAlbum => ({
  id: raw.id,
  name: str(raw["name"] ?? raw["title"]),
  kind: pick<GalleryAlbumKind>(raw["kind"], ["events", "activities", "classroom"], "events"),
  coverPhotoId: str(raw["coverPhotoId"]),
  photoCount: num(raw["photoCount"]),
});

export const mapGalleryPhoto = (raw: RawDoc): GalleryPhoto => ({
  id: raw.id,
  albumId: str(raw["albumId"]),
  title: str(raw["title"]),
  imageUrl: str(raw["imageUrl"] ?? raw["url"]),
  capturedAt: toIso(raw["capturedAt"] ?? raw["createdAt"]),
  aspect: pick(raw["aspect"], ["portrait", "landscape", "square"] as const, "landscape"),
});

export const mapAttendanceSummary = (
  studentId: string,
  month: string,
  docs: RawDoc[],
): AttendanceSummary => {
  const days: AttendanceDay[] = docs.map((raw) => ({
    date: toIso(raw["date"]),
    status: pick<AttendanceStatus>(
      raw["status"],
      ["present", "absent", "late", "holiday", "unmarked"],
      "unmarked",
    ),
  }));
  const count = (status: AttendanceStatus) => days.filter((day) => day.status === status).length;
  const presentDays = count("present");
  const lateDays = count("late");
  const absentDays = count("absent");
  const workingDays = days.filter((day) => day.status !== "holiday").length;
  const subjects: SubjectAttendance[] = [];

  return {
    studentId,
    month,
    presentDays,
    absentDays,
    lateDays,
    workingDays,
    percentage: workingDays ? Math.round(((presentDays + lateDays) / workingDays) * 100) : null,
    days,
    subjects,
    isAvailable: days.length > 0,
  };
};
