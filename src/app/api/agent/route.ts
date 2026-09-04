import { NextRequest, NextResponse } from "next/server";
import { extractSpendIntent } from "@/lib/ai/deepseek";
import { evaluatePolicyAction, recordEvent } from "@/lib/store/policy-store";

export async function POST(req: NextRequest) {
  try {
    const { requestText } = (await req.json()) as { requestText?: string };
    if (!requestText || typeof requestText !== "string") {
      return NextResponse.json(
        { error: "requestText is required" },
        { status: 400 }
      );
    }

    // 1. Agent brain: parse the natural-language ask into a spend intent.
    const decision = await extractSpendIntent(requestText);

    // 2. Policy check: today, the demo store; in the real build, this is a
    //    proved call against the Compact contract's private state, and the
    //    verdict comes back through the Indexer subscription instead of a
    //    direct return value.
    const { verdict, reason } = evaluatePolicyAction(decision.amount);

    // 3. Record + broadcast to the live feed (stands in for the Indexer
    //    pushing a new contractAction event to subscribers).
    const event = recordEvent({
      requestText: decision.intent,
      amount: decision.amount,
      verdict,
      reason,
    });

    return NextResponse.json({
      verdict: event.verdict,
      reason: event.reason,
      txHash: event.txHash,
      timestamp: event.timestamp,
      intent: decision.intent,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
