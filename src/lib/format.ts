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
