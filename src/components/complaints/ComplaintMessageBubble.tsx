import { ShieldCheck } from "lucide-react";

import { formatDateTime } from "@/lib/format";
import type { ComplaintMessage } from "@/models";

const SCHOOL_NAME_RE = /school|admin|teacher|office|staff|principal/i;
const PARENT_NAME_RE = /parent|guardian|father|mother/i;

/** Defensive: role mapping first, then a name heuristic as a final safety net. */
function isSchoolMessage(message: ComplaintMessage, parentName?: string): boolean {
  if (message.authorRole === "school" || message.authorRole === "admin") return true;
  const name = (message.authorName ?? "").trim();
  if (!name) return false;
  if (parentName && name.toLowerCase() === parentName.trim().toLowerCase()) return false;
  if (PARENT_NAME_RE.test(name)) return false;
  return SCHOOL_NAME_RE.test(name);
}

export function ComplaintMessageBubble({
  message,
  parentName,
}: {
  message: ComplaintMessage;
  parentName?: string;
}) {
  const messageText = message.body || "";
  const messageTime = message.sentAt || new Date().toISOString();

  if (isSchoolMessage(message, parentName)) {
    return (
      <div className="my-3.5 flex items-start justify-start gap-2.5">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
          <ShieldCheck className="size-4" />
        </span>
        <div className="max-w-[85%] rounded-2xl rounded-tl-none border border-slate-200 bg-white p-4 shadow-sm md:max-w-[75%] dark:border-slate-800 dark:bg-slate-900">
          <span className="mb-2 inline-block rounded-full border border-blue-200/60 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
            LN International School • Administration
          </span>
          <p className="text-sm leading-relaxed text-slate-900 dark:text-slate-100">{messageText}</p>
          <span className="mt-2 block text-[11px] font-normal text-slate-400">
            {formatDateTime(messageTime)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="my-3.5 flex justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-amber-500 p-3.5 font-medium shadow-sm md:max-w-[75%]">
        <p className="text-sm leading-relaxed text-slate-950">{messageText}</p>
        <span className="mt-1 block text-right text-[11px] font-normal text-slate-800/80">
          {formatDateTime(messageTime)}
        </span>
      </div>
    </div>
  );
}
