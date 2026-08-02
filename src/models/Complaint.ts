import type { IsoDateTime } from "./common";

export type ComplaintStatus = "open" | "in_progress" | "resolved" | "closed";
export type ComplaintCategory =
  | "academics"
  | "transport"
  | "fees"
  | "infrastructure"
  | "discipline"
  | "wellbeing"
  | "administration"
  | "other";
export type ComplaintAuthorRole = "parent" | "school" | "admin";

export interface ComplaintMessage {
  id: string;
  complaintId: string;
  authorRole: ComplaintAuthorRole;
  authorName: string;
  body: string;
  sentAt: IsoDateTime;
}


export interface Complaint {
  id: string;
  ticketNumber: string;
  studentId: string;
  subject: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
  messageCount: number;
}

export interface NewComplaintInput {
  subject: string;
  category: ComplaintCategory;
  description: string;
}

/** Student details stored alongside a ticket so the School Portal can triage it. */
export interface ComplaintStudentContext {
  studentName?: string;
  admissionNumber?: string;
  className?: string;
}

export const COMPLAINT_STATUS_LABEL: Record<ComplaintStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

export const COMPLAINT_CATEGORY_LABEL: Record<ComplaintCategory, string> = {
  academics: "Academics",
  transport: "Transport",
  fees: "Fees",
  infrastructure: "Infrastructure",
  discipline: "Behaviour",
  wellbeing: "Student Wellbeing",
  administration: "Administration",
  other: "Other",
};
