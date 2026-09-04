"use client";

import { useState } from "react";

const SUGGESTIONS = [
  "Book a flight for $450",
  "Approve a $900 invoice",
  "Order office supplies for $120",
];

interface LogLine {
  id: string;
  text: string;
  kind: "request" | "response" | "error";
}

export function AgentConsole() {
  const [input, setInput] = useState("");
  const [log, setLog] = useState<LogLine[]>([]);
  const [busy, setBusy] = useState(false);

  async function send(requestText: string) {
    if (!requestText.trim() || busy) return;
    setBusy(true);
    const reqId = crypto.randomUUID();
    setLog((prev) => [
      ...prev,
      { id: reqId, text: requestText, kind: "request" },
    ]);
    setInput("");

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");

      setLog((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: `${data.verdict === "approved" ? "Approved" : "Denied"} — ${
            data.reason
          }`,
          kind: "response",
        },
      ]);
    } catch (err) {
      setLog((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: err instanceof Error ? err.message : "Something went wrong",
          kind: "error",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-line bg-paper-deep p-5">
      <h2 className="font-display text-lg font-medium text-ink">
        Agent console
      </h2>
      <p className="mt-1 text-sm text-ink-soft">
        Type a request the agent might receive. It decides, checks in with
        the policy, and the ledger updates live.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            disabled={busy}
            className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:border-zest hover:text-ink disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-4 flex-1 space-y-2 overflow-y-auto rounded-xl border border-line bg-paper p-3 font-mono text-xs">
        {log.length === 0 ? (
          <p className="text-ash">Console is quiet. Try a suggestion above.</p>
        ) : (
          log.map((line) => (
            <p
              key={line.id}
              className={
                line.kind === "request"
                  ? "text-ink"
                  : line.kind === "error"
                  ? "text-brick"
                  : "text-leaf"
              }
            >
              {line.kind === "request" ? "› " : "  ↳ "}
              {line.text}
            </p>
          ))
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-3 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the agent to do something…"
          className="flex-1 rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-zest"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-xl bg-ink px-4 py-2 font-display text-sm font-medium text-paper transition hover:bg-ink-soft disabled:opacity-60"
        >
          {busy ? "…" : "Send"}
        </button>
      </form>
    </div>
  );
}
