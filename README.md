# sentinel-agent

**GitHub description (About field):**
> An AI agent that can only act within a private budget/policy enforced by a Midnight smart contract — every approval or denial shows up live on a dashboard, without ever leaking the actual numbers.

---

## Sentinel

**Verifiable AI agent guardrails on Midnight.**

Sentinel puts a Midnight smart contract between an AI agent and the real world. The agent can propose an action — book a flight, approve an invoice — but it only executes if it satisfies a policy the user set privately. The policy, and the running state it's checked against, never touch the public chain. Only a cryptographic pass/fail proof does.

This repo contains the **agent script** and the **live dashboard**. The enforcement contract itself lives in [sentinel-contract](../sentinel-contract).

### How it works

1. **Set a private policy.** The user enters a monthly budget (e.g. $2,000) in the dashboard. Only a commitment to that number is written on-chain — never the number itself.
2. **Agent receives a request.** A natural-language task ("book this $450 flight") triggers the agent to call `requestAction(amount)` on the Sentinel contract before acting.
3. **On-chain check.** The contract privately evaluates `spent_so_far + amount <= budget` and returns a ZK-verified approval or denial. State only updates on approval.
4. **Live dashboard.** A React frontend subscribes to the Midnight Indexer's `contractActions` feed and streams every approval/denial in real time — showing transaction hashes and proof status, but never dollar amounts.
5. **Verify it's real.** Any event can be clicked into to pull the actual transaction from the Indexer, so the audit trail is a genuine on-chain record, not mocked UI.

### Why this matters

As AI agents get real permissions — spending, booking, data access — two things are hard to trust: whether the agent actually follows the rules it's given, and whether enforcing those rules requires exposing sensitive data. Sentinel solves both: guardrails are enforced on-chain, verification is public, and the policy itself stays private.

### Stack

| Component | Role |
|---|---|
| **Compact** (`SpendGuard`) | Policy contract with private budget/spend state — see [sentinel-contract](../sentinel-contract) |
| **Midnight.js / Wallet SDK** | Deploys the contract, submits calls, generates proofs client-side |
| **Midnight Indexer API v4** | `contractActions` subscription for the live feed; `contractAction` / `transactions` for lookups |
| **Lace wallet** | Signs and submits transactions on the agent's behalf |
| **React dashboard** | Renders the live approve/deny stream and links to transaction detail |

### Project structure

```
sentinel-agent/
├── agent/
│   └── agent.ts             # simulated task intake -> requestAction() calls
├── dashboard/
│   ├── src/
│   │   ├── PolicyForm.tsx   # set the private budget
│   │   ├── LiveFeed.tsx     # Indexer subscription -> approve/deny stream
│   │   └── TxDetail.tsx     # click-through to real transaction data
│   └── package.json
└── README.md
```


## Run it

```bash
npm install
cp .env.local.example .env.local   # add your NVIDIA_API_KEY
npm run dev
```

Open http://localhost:3000.

## Get a free NVIDIA API key

1. Go to https://build.nvidia.com/
2. Sign in, find `deepseek-ai/deepseek-v4-pro-0813`
3. Generate an API key (free tier) and paste it into `.env.local`

## What's real vs. stubbed right now

- **Real:** Next.js + TypeScript app, Tailwind UI, DeepSeek call via the NVIDIA
  OpenAI-compatible endpoint (`src/lib/ai/deepseek.ts`), SSE live feed,
  policy check logic.
- **Stubbed for the demo:** `src/lib/store/policy-store.ts` holds the
  "policy" (budget/spent) in server memory and checks it in plain TypeScript.
  This stands in for the Compact contract's private state until you deploy
  the real thing. See `src/lib/midnight/contract.ts` for exactly what to
  replace and how — the UI and API routes don't need to change when you do.

## Project structure

```
src/
  app/
    page.tsx              dashboard UI
    api/agent/route.ts     agent brain -> policy check -> record event
    api/policy/route.ts    set the private budget
    api/feed/route.ts      SSE stream (stand-in for Indexer subscription)
  components/
    Navbar.tsx
    PolicyForm.tsx
    AgentConsole.tsx
    LiveFeed.tsx
    StampCard.tsx           the crate-label "stamp" signature element
  lib/
    ai/deepseek.ts          NVIDIA/DeepSeek client
    store/policy-store.ts   demo state (swap for real contract calls)
    midnight/contract.ts    documents exactly what to build next
    types.ts
```
