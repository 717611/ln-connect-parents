import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ComplaintMessage } from "@/models";

export function ComplaintMessageBubble({ message }: { message: ComplaintMessage }) {
  const isParent = message.authorRole === "parent";

  return (
    <div className={cn("flex", isParent ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-[var(--shadow-card)]",
          isParent
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-card text-foreground",
        )}
      >
        {!isParent ? (
          <p className="mb-1 text-[11px] font-semibold text-accent">{message.authorName}</p>
        ) : null}
        <p>{message.body}</p>
        <p
          className={cn(
            "mt-1.5 text-[10px]",
            isParent ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          {formatDateTime(message.sentAt)}
        </p>
      </div>
    </div>
  );
}
