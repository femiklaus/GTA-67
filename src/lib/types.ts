export type ActionVerdict = "approved" | "denied";

export interface AgentActionEvent {
  id: string;
  requestText: string; // the natural-language request the agent received
  amount: number; // parsed spend amount — private in the real contract, shown here only for the local demo store, NEVER surfaced to the dashboard UI
  verdict: ActionVerdict;
  reason: string; // short agent-facing reason, safe to display (no totals)
  txHash: string;
  timestamp: string; // ISO string
}

export interface PolicyState {
  isSet: boolean;
  // In the real build these two numbers live ONLY inside Compact private state
  // and are never sent to the client. Kept here server-side only, for the demo store.
  budget: number;
  spent: number;
}

export interface PublicPolicySummary {
  isSet: boolean;
  // Deliberately excludes budget/spent — dashboard only ever learns pass/fail.
}
