/**
 * SWAP-IN POINT — real Midnight integration goes here.
 *
 * Today, /lib/store/policy-store.ts holds budget/spent in server memory and
 * evaluatePolicyAction() does the check in plain TypeScript. That's the
 * whole app's "fake contract." Replacing it with the real thing means:
 *
 * 1. Compact contract (SpendGuard):
 *      - private ledger fields: budget, spent
 *      - export circuit requestAction(amount: Uint<64>): Boolean
 *        that checks spent + amount <= budget, updates spent on success,
 *        and returns the boolean the caller (and everyone else) can see —
 *        without ever exposing budget or spent.
 *
 * 2. Deploying / calling it from this Next.js app (via @midnight-ntwrk/*
 *    packages, e.g. midnight-js-contracts + midnight-js-network-id):
 *      - a funded wallet (Lace, or a headless wallet-sdk keypair) signs
 *      - a local proof server (docker run -p 6300:6300 midnightnetwork/proof-server)
 *        generates the ZK proof against the private inputs
 *      - the proved, signed transaction is submitted to the Preview/Preprod node
 *
 * 3. Replacing setBudget() / evaluatePolicyAction() in policy-store.ts with
 *    calls into a small wallet/contract client built from the above.
 *
 * 4. Replacing the SSE route (/api/feed) with a real GraphQL WebSocket
 *    subscription against the Indexer:
 *
 *      subscription {
 *        contractActions(address: "<deployed contract address>") {
 *          address
 *          state
 *          ... on ContractCall {
 *            deploy { address }
 *          }
 *        }
 *      }
 *
 *    Each incoming action gets mapped to the same AgentActionEvent shape
 *    the UI already consumes, so LiveFeed/StampCard don't change at all.
 *
 * Nothing in the UI layer needs to know which side of this line it's on —
 * that's the point of keeping the store's function signatures stable.
 */

export {};
