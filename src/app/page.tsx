import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function Home() {
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

          <div className="mt-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full border border-line bg-lemon px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-lemon/90"
            >
              Get started
            </Link>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-5 pb-10 pt-4 text-xs text-ash sm:px-8">
        Running on Midnight Preview testnet — tDUST has no real-world value.
        Built for the Midnight AI Track hackathon.
      </footer>
    </div>
  );
}
