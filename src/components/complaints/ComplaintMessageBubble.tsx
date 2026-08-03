import { ShieldCheck } from "lucide-react";

import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ComplaintMessage } from "@/models";

export function ComplaintMessageBubble({ message }: { message: ComplaintMessage }) {
  const isSchoolReply = message.authorRole !== "parent";

  if (isSchoolReply) {
    return (
      <div className="my-3 flex items-start justify-start gap-2.5">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700 dark:bg-slate-800 dark:text-blue-300">
          <ShieldCheck className="size-4" />
        </span>
        <div className="max-w-[85%] rounded-2xl rounded-tl-none border border-slate-200 bg-white p-4 shadow-sm md:max-w-[70%] dark:border-slate-800 dark:bg-slate-900">
          <span className="mb-1.5 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-slate-800 dark:text-blue-300">
            LN International School • Administration
          </span>
          <p className="text-sm leading-relaxed text-slate-900 dark:text-slate-100">
            {message.body}
          </p>
          <span className="mt-2 block text-[11px] text-slate-400">
            {formatDateTime(message.sentAt)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="my-3 flex justify-end">
      <div
        className={cn(
          "max-w-[85%] rounded-2xl rounded-tr-none bg-amber-500 p-3.5 font-medium shadow-sm md:max-w-[70%]",
        )}
      >
        <p className="text-sm text-slate-950">{message.body}</p>
        <span className="mt-1 block text-right text-[11px] text-slate-800/80">
          {formatDateTime(message.sentAt)}
        </span>
      </div>
    </div>
  );
}
