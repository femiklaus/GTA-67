import clsx from "clsx";
import { AgentActionEvent } from "@/lib/types";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

export function StampCard({
  event,
  isNew,
}: {
  event: AgentActionEvent;
  isNew?: boolean;
}) {
  const approved = event.verdict === "approved";

  return (
    <li
      className={clsx(
        "relative flex flex-col gap-3 rounded-2xl border bg-paper px-5 py-4 sm:flex-row sm:items-center sm:justify-between",
        "border-line shadow-[0_1px_0_0_rgba(27,27,20,0.04)]",
        isNew && "animate-[stamp-in_0.4s_ease-out]"
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        {/* the stamp mark */}
        <div
          className={clsx(
            "flex h-14 w-16 shrink-0 -rotate-6 items-center justify-center rounded-[10px] border-2",
            approved
              ? "border-leaf text-leaf"
              : "border-brick text-brick"
          )}
          style={{
            borderStyle: "double",
          }}
          aria-hidden
        >
          <span className="font-display text-[10px] font-semibold tracking-[0.14em] uppercase">
            {approved ? "Passed" : "Held"}
          </span>
        </div>

        <div className="min-w-0">
          <p className="truncate font-display text-base font-medium text-ink">
            {event.requestText}
          </p>
          <p className="mt-0.5 truncate text-sm text-ink-soft">
            {event.reason}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center sm:text-right">
        <span
          className={clsx(
            "rounded-full px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide",
            approved ? "bg-leaf-soft text-leaf" : "bg-brick-soft text-brick"
          )}
        >
          {approved ? "Approved" : "Denied"}
        </span>
        <div className="text-right">
          <p className="font-mono text-xs text-ash">
            {event.txHash.slice(0, 10)}…{event.txHash.slice(-6)}
          </p>
          <p className="mt-0.5 text-xs text-ash">{timeAgo(event.timestamp)}</p>
        </div>
      </div>
    </li>
  );
}
