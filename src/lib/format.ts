/** Formatting helpers shared by presentation components. */

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const dayMonthFormatter = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" });

const timeFormatter = new Intl.DateTimeFormat("en-IN", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

export const formatDate = (iso: string): string => dateFormatter.format(new Date(iso));
export const formatDayMonth = (iso: string): string => dayMonthFormatter.format(new Date(iso));
export const formatTime = (iso: string): string => timeFormatter.format(new Date(iso));
export const formatDateTime = (iso: string): string => `${formatDate(iso)}, ${formatTime(iso)}`;

export const relativeTime = (iso: string): string => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  return formatDate(iso);
};

/**
 * Defensive date parser for values coming from Firestore, which may be a
 * Timestamp, a `{ seconds }` object, an ISO string, epoch millis or garbage.
 * Never throws and never silently reports "just now" for an unparseable value.
 */
export const parseFirestoreDate = (dateVal: unknown): Date => {
  const valid = (date: Date): Date | null =>
    Number.isNaN(date.getTime()) ? null : date;

  if (dateVal instanceof Date) return valid(dateVal) ?? new Date();

  const maybe = dateVal as { toDate?: () => Date; seconds?: number } | null | undefined;
  if (maybe && typeof maybe.toDate === "function") {
    const parsed = valid(maybe.toDate());
    if (parsed) return parsed;
  }
  if (maybe && typeof maybe.seconds === "number") {
    const parsed = valid(new Date(maybe.seconds * 1000));
    if (parsed) return parsed;
  }
  if (typeof dateVal === "string" || typeof dateVal === "number") {
    const parsed = valid(new Date(dateVal));
    if (parsed) return parsed;
  }
  return new Date();
};

const longDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

/**
 * "3 hr ago" for anything posted in the last 24 hours, otherwise the exact
 * "MMM dd, yyyy • hh:mm a" stamp so older notices never read as "just now".
 */
export const formatFirestoreDateTime = (dateVal: unknown): string => {
  const date = parseFirestoreDate(dateVal);
  const diffMs = Date.now() - date.getTime();
  if (diffMs >= 0 && diffMs < 86_400_000) {
    const minutes = Math.round(diffMs / 60_000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.round(minutes / 60);
    return `${hours} hr ago`;
  }
  return `${longDateFormatter.format(date)} • ${timeFormatter.format(date)}`;
};


export const greeting = (date: Date = new Date()): string => {
  const hour = date.getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

export const initials = (name: string | null | undefined): string =>
  (name || "Student")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

/**
 * Notice timing: pre-formatted School Portal stamps win, otherwise parse
 * whichever timestamp field exists and render relative time only within 24h.
 */
export const parseNoticeDate = (notice: {
  displayDate?: string | null;
  displayTime?: string | null;
  publishedAt?: unknown;
}): string => {
  if (notice.displayDate) {
    return notice.displayTime ? `${notice.displayDate} • ${notice.displayTime}` : notice.displayDate;
  }
  return formatFirestoreDateTime(notice.publishedAt);
};
