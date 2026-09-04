import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_API_KEY,
});

const MODEL = "deepseek-ai/deepseek-v4-pro-0813";

export interface AgentDecision {
  amount: number;
  intent: string; // short restatement of what the agent wants to do
}

/**
 * Asks the model to read a natural-language request and extract the
 * structured spend intent (amount + short description). This is the
 * "agent brain" step — it does NOT decide approve/deny, that check
 * always happens against the policy (Compact contract in the real build,
 * evaluatePolicyAction() in the demo store).
 */
export async function extractSpendIntent(
  requestText: string
): Promise<AgentDecision> {
  // The NVIDIA-hosted DeepSeek endpoint accepts one extra top-level field,
  // `chat_template_kwargs`, that isn't part of the OpenAI TS SDK's typed
  // request shape (the Python SDK exposes this via `extra_body`; the JS/TS
  // SDK just serializes whatever object you pass, so we add it via a cast).
  const completion = await client.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a spend-request parser for an AI agent guardrail system. " +
          "Given a natural-language request, extract the dollar amount and a " +
          "short (<=8 word) intent description. Respond ONLY with compact JSON " +
          'in the exact shape {"amount": number, "intent": string}. No prose, no markdown fences.',
      },
      { role: "user", content: requestText },
    ],
    temperature: 0.2,
    top_p: 0.95,
    max_tokens: 200,
    seed: 42,
    stream: false,
    ...({ chat_template_kwargs: { thinking: false } } as Record<
      string,
      unknown
    >),
  });

  const raw = completion.choices[0]?.message?.content?.trim() ?? "{}";
  const cleaned = raw.replace(/^```json\s*|\s*```$/g, "");

  try {
    const parsed = JSON.parse(cleaned);
    const amount = Number(parsed.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("model returned a non-positive or invalid amount");
    }
    return {
      amount,
      intent: String(parsed.intent ?? requestText).slice(0, 120),
    };
  } catch {
    throw new Error(`Could not parse a spend amount from: "${requestText}"`);
  }
}
