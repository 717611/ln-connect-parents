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
  publishedAt: toIso(
    raw["publishedAt"] ?? raw["createdAt"] ?? raw["date"] ?? raw["updatedAt"],
  ),
  displayDate: str(raw["displayDate"]) || null,
  displayTime: str(raw["displayTime"]) || null,
  publishedBy: str(raw["publishedBy"] ?? raw["author"], "School Office"),
  attachmentUrls: strList(raw["attachmentUrls"] ?? raw["attachments"]),
});

/** School Portal writes "Pending" / "In Progress" / "Resolved" labels. */
const complaintStatus = (value: unknown): ComplaintStatus => {
  const raw = str(value).trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (raw === "pending" || raw === "new" || raw === "open") return "open";
  if (raw === "in_progress" || raw === "active" || raw === "ongoing") return "in_progress";
  if (raw === "resolved") return "resolved";
  if (raw === "closed") return "closed";
  return pick<ComplaintStatus>(raw, ["open", "in_progress", "resolved", "closed"], "open");
};

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
  status: complaintStatus(raw["status"] ?? raw["statusLabel"]),
  createdAt: toIso(raw["createdAt"]),
  updatedAt: toIso(raw["updatedAt"] ?? raw["createdAt"]),
  messageCount: num(
    raw["messageCount"],
    Array.isArray(raw["messages"]) ? (raw["messages"] as unknown[]).length : 1,
  ),
});

/**
 * Defensive sender classification. The School Portal writes the author under
 * several different keys (`sender`, `senderRole`, `senderType`, `authorRole`,
 * `role`, `from`), so inspect them all and only treat a message as a parent
 * message when it explicitly says so.
 */
const SCHOOL_ROLE_RE = /school|admin|teacher|office|staff|principal/i;
const PARENT_ROLE_RE = /parent|guardian|father|mother|student/i;

const authorRole = (raw: RawDoc): ComplaintMessage["authorRole"] => {
  const candidates = [
    raw["senderRole"],
    raw["senderType"],
    raw["authorRole"],
    raw["role"],
    raw["sender"],
    raw["from"],
    raw["authorType"],
  ]
    .map((value) => str(value).trim().toLowerCase())
    .filter(Boolean);

  for (const value of candidates) {
    if (value === "school") return "school";
    if (value === "admin" || value === "staff" || value === "teacher" || value === "office") {
      return "admin";
    }
    if (PARENT_ROLE_RE.test(value)) return "parent";
    if (SCHOOL_ROLE_RE.test(value)) return "admin";
  }

  const name = str(raw["senderName"] ?? raw["authorName"] ?? raw["name"]).trim();
  if (name && SCHOOL_ROLE_RE.test(name) && !PARENT_ROLE_RE.test(name)) return "admin";

  return "parent";
};

export const mapComplaintMessage = (complaintId: string) => (raw: RawDoc): ComplaintMessage => ({
  id: raw.id,
  authorRole: authorRole(raw),
  complaintId,
  authorName: str(raw["senderName"] ?? raw["authorName"] ?? raw["name"], "School"),
  body: str(raw["text"] ?? raw["body"] ?? raw["content"] ?? raw["message"]),
  sentAt: toIso(
    raw["createdAt"] ?? raw["sentAt"] ?? raw["timestamp"] ?? raw["date"] ?? raw["updatedAt"],
  ),
});

/**
 * School Portal parity: conversation messages live in a `messages` array field
 * on the ticket document, shaped
 * `{ id, sender, senderName, text, createdAt }`.
 */
export const mapTicketMessages = (complaintId: string, value: unknown): ComplaintMessage[] => {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry): entry is Record<string, unknown> => Boolean(entry) && typeof entry === "object")
    .map((entry, index) =>
      mapComplaintMessage(complaintId)({
        ...entry,
        id: str(entry["id"], `${complaintId}-msg-${index}`),
      }),
    )
    .sort((a, b) => a.sentAt.localeCompare(b.sentAt));
};



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

/** School Portal writes "P"/"Present"/"present"/"A" — normalise them all. */
const attendanceStatus = (value: unknown): AttendanceStatus => {
  const raw = str(value).trim().toLowerCase();
  if (!raw) return "unmarked";
  if (raw.startsWith("p")) return "present";
  if (raw.startsWith("a") || raw === "ab") return "absent";
  if (raw.startsWith("l") || raw.startsWith("t")) return "late";
  if (raw.startsWith("h") || raw.startsWith("w")) return "holiday";
  return pick<AttendanceStatus>(raw, ["present", "absent", "late", "holiday", "unmarked"], "unmarked");
};

/**
 * Resolve the calendar day of a record as `YYYY-MM-DD` without timezone drift:
 * plain date strings are used verbatim, timestamps are read in local time.
 */
const attendanceDateKey = (raw: RawDoc): string => {
  const candidates = [
    raw["date"],
    raw["attendanceDate"],
    raw["day"],
    raw["dateKey"],
    raw.id,
    raw["createdAt"],
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string") {
      const match = /(\d{4})-(\d{2})-(\d{2})/.exec(candidate.trim());
      if (match) return `${match[1]}-${match[2]}-${match[3]}`;
    }
  }

  for (const candidate of candidates) {
    if (candidate === undefined || candidate === null || candidate === "") continue;
    const parsed = new Date(toIso(candidate));
    if (!Number.isNaN(parsed.getTime())) {
      const month = String(parsed.getMonth() + 1).padStart(2, "0");
      const day = String(parsed.getDate()).padStart(2, "0");
      return `${parsed.getFullYear()}-${month}-${day}`;
    }
  }

  return "";
};

export const mapAttendanceDay = (raw: RawDoc): AttendanceDay => {
  const remark = str(raw["remark"] ?? raw["note"] ?? raw["reason"]).trim();
  return {
    date: attendanceDateKey(raw),
    status: attendanceStatus(raw["status"] ?? raw["attendanceStatus"] ?? raw["present"]),
    ...(remark ? { remark } : {}),
  };
};

export const mapAttendanceSummary = (
  studentId: string,
  month: string,
  docs: RawDoc[],
): AttendanceSummary => {
  const byDate = new Map<string, AttendanceDay>();
  docs
    .map(mapAttendanceDay)
    .filter((day) => Boolean(day.date) && day.date.slice(0, 7) === month)
    .forEach((day) => byDate.set(day.date, day));

  const days = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));

  const count = (status: AttendanceStatus) => days.filter((day) => day.status === status).length;
  const presentDays = count("present");
  const lateDays = count("late");
  const absentDays = count("absent");
  const halfDays = count("half_day");
  // Recorded days only: holidays and unmarked days never affect the percentage.
  const workingDays = presentDays + lateDays + absentDays + halfDays;
  const credited = presentDays + lateDays + halfDays * 0.5;

  return {
    studentId,
    month,
    presentDays,
    absentDays,
    lateDays,
    halfDays,
    workingDays,
    percentage: workingDays ? Math.round((credited / workingDays) * 100) : null,
    days,
    isAvailable: days.length > 0,
  };
};

