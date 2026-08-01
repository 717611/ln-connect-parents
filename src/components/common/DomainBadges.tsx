import {
  COMPLAINT_STATUS_LABEL,
  HOMEWORK_STATUS_LABEL,
  NOTICE_PRIORITY_LABEL,
  type ComplaintStatus,
  type HomeworkStatus,
  type NoticePriority,
} from "@/models";

import { StatusBadge, type BadgeTone } from "./StatusBadge";

const HOMEWORK_TONE: Record<HomeworkStatus, BadgeTone> = {
  new: "accent",
  in_progress: "warning",
  submitted: "success",
  overdue: "danger",
};

const COMPLAINT_TONE: Record<ComplaintStatus, BadgeTone> = {
  open: "accent",
  in_progress: "warning",
  resolved: "success",
  closed: "neutral",
};

const PRIORITY_TONE: Record<NoticePriority, BadgeTone> = {
  high: "danger",
  medium: "primary",
  low: "neutral",
};

export const HomeworkStatusBadge = ({ status }: { status: HomeworkStatus }) => (
  <StatusBadge label={HOMEWORK_STATUS_LABEL[status]} tone={HOMEWORK_TONE[status]} />
);

export const ComplaintStatusBadge = ({ status }: { status: ComplaintStatus }) => (
  <StatusBadge label={COMPLAINT_STATUS_LABEL[status]} tone={COMPLAINT_TONE[status]} />
);

export const PriorityBadge = ({ priority }: { priority: NoticePriority }) => (
  <StatusBadge label={NOTICE_PRIORITY_LABEL[priority]} tone={PRIORITY_TONE[priority]} />
);
