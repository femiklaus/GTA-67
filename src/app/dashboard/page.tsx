import { Navbar } from "@/components/Navbar";
import { AgentConsole } from "@/components/AgentConsole";
import { LiveFeed } from "@/components/LiveFeed";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <section className="mb-10 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-zest">
            AI agent guardrails, proven on-chain
          </p>
          <h1 className="mt-3 font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">
            Give your agent a budget it can&apos;t cheat on —
            <br className="hidden sm:block" />
            and can&apos;t leak either.
          </h1>
          <p className="mt-4 text-base text-ink-soft">
            Set a policy privately. Every action your AI agent proposes gets
            checked against it and stamped, live — approved or denied, proven,
            with the numbers behind it never exposed.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
          <div className="flex-1">
            <AgentConsole />
          </div>

          <div className="rounded-2xl border border-line bg-paper-deep p-5 sm:p-6">
            <LiveFeed />
          </div>
        </div>
      </main>

      <footer className="mx-auto max-w-6xl px-5 pb-10 pt-4 text-xs text-ash sm:px-8">
        Running on Midnight Preview testnet — tDUST has no real-world value.
        Built for the Midnight AI Track hackathon.
      </footer>
    </div>
  );
}
