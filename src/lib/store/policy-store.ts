import { AgentActionEvent, PolicyState } from "@/lib/types";

/**
 * DEMO STORE — stands in for two real Midnight pieces:
 *
 * 1. `policy` (budget/spent) stands in for the Compact contract's PRIVATE STATE.
 *    In the real build this never lives in a Next.js server process — it lives
 *    inside the deployed contract, and is only ever touched via a proof
 *    generated against private inputs (see /lib/midnight/contract.ts).
 *
 * 2. `events` stands in for what the Midnight Indexer's `contractActions`
 *    subscription would stream to the dashboard. Swap `emit`/`subscribe`
 *    below for a real GraphQL WS subscription against the deployed contract
 *    address and the rest of the app (SSE route, LiveFeed component) barely
 *    has to change — it already only consumes verdict/reason/txHash/timestamp.
 */

declare global {
  var __sentinelPolicy: PolicyState | undefined;
  var __sentinelEvents: AgentActionEvent[] | undefined;
  var __sentinelSubscribers: Set<(e: AgentActionEvent) => void> | undefined;
}

function getPolicy(): PolicyState {
  if (!global.__sentinelPolicy) {
    global.__sentinelPolicy = { isSet: false, budget: 0, spent: 0 };
  }
  return global.__sentinelPolicy;
}

function getEvents(): AgentActionEvent[] {
  if (!global.__sentinelEvents) global.__sentinelEvents = [];
  return global.__sentinelEvents;
}

function getSubscribers(): Set<(e: AgentActionEvent) => void> {
  if (!global.__sentinelSubscribers) global.__sentinelSubscribers = new Set();
  return global.__sentinelSubscribers;
}

export function setBudget(budget: number) {
  const policy = getPolicy();
  policy.isSet = true;
  policy.budget = budget;
  policy.spent = 0;
}

export function getPublicPolicySummary() {
  return { isSet: getPolicy().isSet };
}

/**
 * Stand-in for calling the Compact contract's `requestAction` entry point.
 * Real version: build + prove + submit a transaction via midnight-js, then
 * let the Indexer subscription (not this function) report the verdict back.
 */
export function evaluatePolicyAction(amount: number): {
  verdict: "approved" | "denied";
  reason: string;
} {
  const policy = getPolicy();
  if (!policy.isSet) {
    return { verdict: "denied", reason: "No policy set yet" };
  }
  const wouldBe = policy.spent + amount;
  if (wouldBe <= policy.budget) {
    policy.spent = wouldBe;
    return { verdict: "approved", reason: "Within policy limit" };
  }
  return { verdict: "denied", reason: "Would exceed policy limit" };
}

function fakeTxHash(): string {
  const bytes = Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0")
  );
  return "0x" + bytes.join("");
}

export function recordEvent(
  input: Omit<AgentActionEvent, "id" | "txHash" | "timestamp">
): AgentActionEvent {
  const event: AgentActionEvent = {
    ...input,
    id: crypto.randomUUID(),
    txHash: fakeTxHash(),
    timestamp: new Date().toISOString(),
  };
  const events = getEvents();
  events.unshift(event);
  if (events.length > 100) events.length = 100;
  for (const sub of getSubscribers()) sub(event);
  return event;
}

export function listEvents(): AgentActionEvent[] {
  return getEvents();
}

export function subscribe(cb: (e: AgentActionEvent) => void): () => void {
  const subs = getSubscribers();
  subs.add(cb);
  return () => subs.delete(cb);
}
