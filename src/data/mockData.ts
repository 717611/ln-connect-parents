/**
 * SINGLE placeholder-data source.
 *
 * ONLY files in src/repositories may import this module. Components, hooks and
 * services must never read it directly. When Firestore is connected, the
 * repository bodies change and this file is deleted.
 */
import { ASSETS } from "@/assets";
import type {
  AttendanceSummary,
  AuthSession,
  Classroom,
  Classwork,
  Complaint,
  ComplaintMessage,
  GalleryAlbum,
  GalleryPhoto,
  Homework,
  Notice,
  Parent,
  Student,
  Subject,
  Teacher,
} from "@/models";

const iso = (value: string): string => new Date(value).toISOString();

export const mockClassroom: Classroom = {
  id: "cls-5a",
  className: "V",
  section: "A",
  classTeacherId: "tch-1",
  academicYear: "2026-27",
};

export const mockStudent: Student = {
  id: "stu-1",
  admissionNumber: "20260021",
  fullName: "Aarav Kumar",
  photoUrl: ASSETS.studentPlaceholder,
  classroomId: mockClassroom.id,
  className: mockClassroom.className,
  section: mockClassroom.section,
  rollNumber: "14",
  parentId: "par-1",
  parentName: "Rajesh Kumar",
  parentMobile: "+91 98350 12345",
  dateOfBirth: iso("2015-06-12"),
  bloodGroup: "B+",
  isActive: true,
};

export const mockParent: Parent = {
  id: "par-1",
  fullName: "Rajesh Kumar",
  relation: "father",
  mobileNumber: "98XXXXXXXX",
  email: "rajesh.kumar@example.com",
  photoUrl: null,
  studentIds: [mockStudent.id],
};

export const mockSession: AuthSession = {
  user: {
    uid: "usr-par-1",
    parentId: mockParent.id,
    role: "parent",
    admissionNumber: mockStudent.admissionNumber,
    displayName: mockParent.fullName,
  },
  issuedAt: iso("2026-07-20T09:00:00"),
};

export const mockTeachers: Teacher[] = [
  { id: "tch-1", fullName: "Meera Sharma", photoUrl: null, subjectIds: ["sub-eng"], designation: "Class Teacher" },
  { id: "tch-2", fullName: "Anil Verma", photoUrl: null, subjectIds: ["sub-math"], designation: "Mathematics" },
  { id: "tch-3", fullName: "Priya Das", photoUrl: null, subjectIds: ["sub-evs"], designation: "EVS" },
  { id: "tch-4", fullName: "Sunita Mishra", photoUrl: null, subjectIds: ["sub-hin"], designation: "Hindi" },
  { id: "tch-5", fullName: "Rakesh Singh", photoUrl: null, subjectIds: ["sub-sci"], designation: "Science" },
];

export const mockSubjects: Subject[] = [
  { id: "sub-eng", name: "English", shortCode: "ENG", colorToken: "primary" },
  { id: "sub-math", name: "Mathematics", shortCode: "MAT", colorToken: "accent" },
  { id: "sub-evs", name: "EVS", shortCode: "EVS", colorToken: "success" },
  { id: "sub-hin", name: "Hindi", shortCode: "HIN", colorToken: "warning" },
  { id: "sub-sci", name: "Science", shortCode: "SCI", colorToken: "secondary" },
];

export const mockHomework: Homework[] = [
  {
    id: "hw-1",
    classroomId: mockClassroom.id,
    subjectId: "sub-eng",
    subjectName: "English",
    teacherId: "tch-1",
    teacherName: "Meera Sharma",
    title: "Chapter 4 — Reading Comprehension",
    description: "Read pages 60 to 61 and answer the questions in the exercise book.",
    dueAt: iso("2026-07-22T23:59:00"),
    assignedAt: iso("2026-07-21T10:20:00"),
    status: "new",
    attachmentUrls: [],
  },
  {
    id: "hw-2",
    classroomId: mockClassroom.id,
    subjectId: "sub-math",
    subjectName: "Mathematics",
    teacherId: "tch-2",
    teacherName: "Anil Verma",
    title: "Exercise 7.1",
    description: "Complete questions 1 to 10 in the notebook. Show all working steps.",
    dueAt: iso("2026-07-24T23:59:00"),
    assignedAt: iso("2026-07-21T09:15:00"),
    status: "in_progress",
    attachmentUrls: [],
  },
  {
    id: "hw-3",
    classroomId: mockClassroom.id,
    subjectId: "sub-sci",
    subjectName: "Science",
    teacherId: "tch-5",
    teacherName: "Rakesh Singh",
    title: "Water — A Precious Resource",
    description: "Learn and write short notes on the three ways to conserve water.",
    dueAt: iso("2026-07-26T23:59:00"),
    assignedAt: iso("2026-07-20T14:40:00"),
    status: "submitted",
    attachmentUrls: [],
  },
  {
    id: "hw-4",
    classroomId: mockClassroom.id,
    subjectId: "sub-hin",
    subjectName: "Hindi",
    teacherId: "tch-4",
    teacherName: "Sunita Mishra",
    title: "पाठ 4 — प्रश्न अभ्यास",
    description: "कहानी पढ़कर दिए गए प्रश्नों के उत्तर लिखें।",
    dueAt: iso("2026-07-19T23:59:00"),
    assignedAt: iso("2026-07-17T11:00:00"),
    status: "overdue",
    attachmentUrls: [],
  },
];

export const mockClasswork: Classwork[] = [
  {
    id: "cw-1",
    classroomId: mockClassroom.id,
    subjectId: "sub-eng",
    subjectName: "English",
    teacherId: "tch-1",
    teacherName: "Meera Sharma",
    title: "Figures of Speech",
    description: "Classwork notes copied and discussed in class with examples.",
    kind: "notes",
    conductedAt: iso("2026-07-21T10:30:00"),
    attachmentUrls: [],
  },
  {
    id: "cw-2",
    classroomId: mockClassroom.id,
    subjectId: "sub-math",
    subjectName: "Mathematics",
    teacherId: "tch-2",
    teacherName: "Anil Verma",
    title: "Linear Equations",
    description: "Step-by-step explanation with three solved examples on the board.",
    kind: "explanation",
    conductedAt: iso("2026-07-21T09:15:00"),
    attachmentUrls: [],
  },
  {
    id: "cw-3",
    classroomId: mockClassroom.id,
    subjectId: "sub-evs",
    subjectName: "EVS",
    teacherId: "tch-3",
    teacherName: "Priya Das",
    title: "Water Cycle",
    description: "Diagram drawing activity followed by a short class discussion.",
    kind: "activity",
    conductedAt: iso("2026-07-20T12:00:00"),
    attachmentUrls: [],
  },
  {
    id: "cw-4",
    classroomId: mockClassroom.id,
    subjectId: "sub-hin",
    subjectName: "Hindi",
    teacherId: "tch-4",
    teacherName: "Sunita Mishra",
    title: "व्याकरण — संज्ञा",
    description: "कक्षा में अभ्यास प्रश्न हल किए गए।",
    kind: "assessment",
    conductedAt: iso("2026-07-20T11:00:00"),
    attachmentUrls: [],
  },
];

export const mockNotices: Notice[] = [
  {
    id: "nt-1",
    scope: "school",
    classroomId: null,
    title: "Holiday Notice",
    body: "School will remain closed on 26th July 2026 on account of Kargil Vijay Diwas. Regular classes resume the following working day.",
    category: "holiday",
    priority: "high",
    publishedAt: iso("2026-07-20T09:00:00"),
    publishedBy: "Principal's Office",
    attachmentUrls: [],
  },
  {
    id: "nt-2",
    scope: "school",
    classroomId: null,
    title: "Annual Day Celebration",
    body: "Annual Day will be celebrated on 15th August 2026. Rehearsal schedules and participation details will follow shortly.",
    category: "event",
    priority: "medium",
    publishedAt: iso("2026-07-18T15:30:00"),
    publishedBy: "Cultural Committee",
    attachmentUrls: [],
  },
  {
    id: "nt-3",
    scope: "school",
    classroomId: null,
    title: "Fee Reminder",
    body: "This is a friendly reminder to complete the pending second-quarter fee payment before the due date.",
    category: "fee",
    priority: "medium",
    publishedAt: iso("2026-07-15T10:00:00"),
    publishedBy: "Accounts Department",
    attachmentUrls: [],
  },
  {
    id: "nt-4",
    scope: "school",
    classroomId: null,
    title: "New Transport Policy",
    body: "Revised bus routes and pick-up timings come into effect from 1st August 2026. Please review the attached route chart.",
    category: "policy",
    priority: "low",
    publishedAt: iso("2026-07-12T08:45:00"),
    publishedBy: "Transport Office",
    attachmentUrls: [],
  },
  {
    id: "nt-5",
    scope: "class",
    classroomId: mockClassroom.id,
    title: "Bring Colour Papers",
    body: "Please bring colour papers for tomorrow's art activity. Scissors will be provided in class.",
    category: "academic",
    priority: "medium",
    publishedAt: iso("2026-07-21T08:30:00"),
    publishedBy: "Meera Sharma",
    attachmentUrls: [],
  },
  {
    id: "nt-6",
    scope: "class",
    classroomId: mockClassroom.id,
    title: "Maths Worksheet",
    body: "A practice worksheet will be given in class tomorrow. Please ensure the geometry box is brought along.",
    category: "academic",
    priority: "low",
    publishedAt: iso("2026-07-21T08:15:00"),
    publishedBy: "Anil Verma",
    attachmentUrls: [],
  },
  {
    id: "nt-7",
    scope: "class",
    classroomId: mockClassroom.id,
    title: "PTM Reminder",
    body: "Parent Teacher Meeting is scheduled on 25th July 2026 from 10:00 AM to 1:00 PM in the class V-A room.",
    category: "event",
    priority: "high",
    publishedAt: iso("2026-07-20T18:00:00"),
    publishedBy: "Meera Sharma",
    attachmentUrls: [],
  },
];

export const mockComplaints: Complaint[] = [
  {
    id: "cmp-024",
    ticketNumber: "CMP-024",
    studentId: mockStudent.id,
    subject: "Math notebook issue",
    description: "My child did not receive today's Mathematics notebook after correction.",
    category: "academics",
    status: "in_progress",
    createdAt: iso("2026-07-20T10:15:00"),
    updatedAt: iso("2026-07-20T17:35:00"),
    messageCount: 3,
  },
  {
    id: "cmp-021",
    ticketNumber: "CMP-021",
    studentId: mockStudent.id,
    subject: "Water bottle leakage",
    description: "The water bottle provided in the classroom rack keeps leaking.",
    category: "infrastructure",
    status: "resolved",
    createdAt: iso("2026-07-10T09:05:00"),
    updatedAt: iso("2026-07-12T12:20:00"),
    messageCount: 2,
  },
  {
    id: "cmp-018",
    ticketNumber: "CMP-018",
    studentId: mockStudent.id,
    subject: "Bus timing query",
    description: "The evening bus has been arriving 15 minutes late for the past week.",
    category: "transport",
    status: "closed",
    createdAt: iso("2026-07-06T08:30:00"),
    updatedAt: iso("2026-07-09T16:00:00"),
    messageCount: 2,
  },
  {
    id: "cmp-015",
    ticketNumber: "CMP-015",
    studentId: mockStudent.id,
    subject: "ID card not received",
    description: "The replacement identity card has not been handed over yet.",
    category: "other",
    status: "open",
    createdAt: iso("2026-07-05T11:10:00"),
    updatedAt: iso("2026-07-05T11:10:00"),
    messageCount: 1,
  },
];

export const mockComplaintMessages: ComplaintMessage[] = [
  {
    id: "msg-1",
    complaintId: "cmp-024",
    authorRole: "parent",
    authorName: mockParent.fullName,
    body: "My child did not receive today's Mathematics notebook after correction.",
    sentAt: iso("2026-07-20T10:15:00"),
  },
  {
    id: "msg-2",
    complaintId: "cmp-024",
    authorRole: "school",
    authorName: "Class Teacher",
    body: "Thank you for informing us. We will send it tomorrow and confirm once handed over.",
    sentAt: iso("2026-07-20T13:20:00"),
  },
  {
    id: "msg-3",
    complaintId: "cmp-024",
    authorRole: "parent",
    authorName: mockParent.fullName,
    body: "Thank you so much.",
    sentAt: iso("2026-07-20T17:35:00"),
  },
  {
    id: "msg-4",
    complaintId: "cmp-021",
    authorRole: "parent",
    authorName: mockParent.fullName,
    body: "The water bottle provided in the classroom rack keeps leaking.",
    sentAt: iso("2026-07-10T09:05:00"),
  },
  {
    id: "msg-5",
    complaintId: "cmp-021",
    authorRole: "school",
    authorName: "Admin Office",
    body: "The bottle has been replaced. Marking this as resolved.",
    sentAt: iso("2026-07-12T12:20:00"),
  },
  {
    id: "msg-6",
    complaintId: "cmp-018",
    authorRole: "parent",
    authorName: mockParent.fullName,
    body: "The evening bus has been arriving 15 minutes late for the past week.",
    sentAt: iso("2026-07-06T08:30:00"),
  },
  {
    id: "msg-7",
    complaintId: "cmp-018",
    authorRole: "school",
    authorName: "Transport Office",
    body: "Route timings have been revised. Closing this ticket.",
    sentAt: iso("2026-07-09T16:00:00"),
  },
  {
    id: "msg-8",
    complaintId: "cmp-015",
    authorRole: "parent",
    authorName: mockParent.fullName,
    body: "The replacement identity card has not been handed over yet.",
    sentAt: iso("2026-07-05T11:10:00"),
  },
];

export const mockGalleryAlbums: GalleryAlbum[] = [
  { id: "alb-events", name: "Events", kind: "events", coverPhotoId: "ph-1", photoCount: 4 },
  { id: "alb-activities", name: "Activities", kind: "activities", coverPhotoId: "ph-5", photoCount: 4 },
  { id: "alb-classroom", name: "Classroom", kind: "classroom", coverPhotoId: "ph-9", photoCount: 4 },
];

const galleryAspects: GalleryPhoto["aspect"][] = ["landscape", "portrait", "square"];

export const mockGalleryPhotos: GalleryPhoto[] = Array.from({ length: 12 }, (_, index) => {
  const album = mockGalleryAlbums[Math.floor(index / 4)] ?? mockGalleryAlbums[0]!;
  return {
    id: `ph-${index + 1}`,
    albumId: album.id,
    title: `${album.name} moment ${(index % 4) + 1}`,
    imageUrl: ASSETS.galleryPlaceholder,
    capturedAt: iso("2026-07-14T10:00:00"),
    aspect: galleryAspects[index % galleryAspects.length]!,
  };
});

export const mockAttendanceSummary: AttendanceSummary = {
  studentId: mockStudent.id,
  month: "2026-07",
  presentDays: 0,
  absentDays: 0,
  lateDays: 0,
  workingDays: 0,
  percentage: null,
  days: [],
  isAvailable: false,
};
