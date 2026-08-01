import type { IsoDateTime } from "./common";

export type ComplaintStatus = "open" | "in_progress" | "resolved" | "closed";
export type ComplaintCategory =
  | "academics"
  | "transport"
  | "fees"
  | "infrastructure"
  | "discipline"
  | "other";
export type ComplaintAuthorRole = "parent" | "school";

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
  discipline: "Discipline",
  other: "Other",
};
