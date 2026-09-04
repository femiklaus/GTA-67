import { NextRequest } from "next/server";
import { listEvents, subscribe } from "@/lib/store/policy-store";
import { AgentActionEvent } from "@/lib/types";

/**
 * Server-Sent Events stream of verified agent actions.
 *
 * This plays the exact role the Midnight Indexer's
 * `subscription { contractActions(address: $addr) { ... } }` WebSocket
 * subscription will play in the real build: push new verified events to
 * the dashboard as they land on-chain. The LiveFeed component only cares
 * about the event shape, so swapping this for a real GraphQL WS client
 * later doesn't require touching the UI.
 */
export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: AgentActionEvent) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
        );
      };

      // replay recent history first, oldest to newest
      for (const e of [...listEvents()].reverse()) send(e);

      const unsubscribe = subscribe(send);

      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(`: ping\n\n`));
      }, 15000);

      req.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        unsubscribe();
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
