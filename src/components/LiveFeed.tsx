"use client";

import { useEffect, useState } from "react";
import { AgentActionEvent } from "@/lib/types";
import { StampCard } from "./StampCard";

export function LiveFeed() {
  const [events, setEvents] = useState<AgentActionEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const [latestId, setLatestId] = useState<string | null>(null);

  useEffect(() => {
    const source = new EventSource("/api/feed");

    source.onopen = () => setConnected(true);
    source.onerror = () => setConnected(false);

    source.onmessage = (e) => {
      const event: AgentActionEvent = JSON.parse(e.data);
      setLatestId(event.id);
      setEvents((prev) => {
        if (prev.some((p) => p.id === event.id)) return prev;
        return [event, ...prev].slice(0, 50);
      });
    };

    return () => source.close();
  }, []);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-medium text-ink">
          Verified action ledger
        </h2>
        <span className="flex items-center gap-1.5 text-xs text-ash">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              connected ? "bg-leaf" : "bg-ash"
            }`}
          />
          {connected ? "Live" : "Connecting…"}
        </span>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-line px-6 py-16 text-center">
          <p className="max-w-xs text-sm text-ash">
            No actions yet. Set a policy, then send the agent a request below
            — every check it runs shows up here, stamped, in real time.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {events.map((event) => (
            <StampCard
              key={event.id}
              event={event}
              isNew={event.id === latestId}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
