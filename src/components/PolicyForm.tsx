"use client";

import { useState } from "react";

export function PolicyForm() {
  const [budget, setBudget] = useState("2000");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budget: Number(budget) }),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-paper-deep p-5">
      <h2 className="font-display text-lg font-medium text-ink">
        Set the private policy
      </h2>
      <p className="mt-1 text-sm text-ink-soft">
        This number is committed to the contract and never shown again —
        not here, not on-chain.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink">Monthly budget (USD)</span>
          <div className="flex items-center gap-2 rounded-xl border border-line bg-paper px-3 py-2 focus-within:border-zest">
            <span className="text-ash">$</span>
            <input
              type="number"
              min={1}
              step="1"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-transparent font-mono text-ink outline-none"
            />
          </div>
        </label>

        <button
          type="submit"
          disabled={status === "saving"}
          className="mt-1 rounded-xl bg-lemon px-4 py-2.5 font-display text-sm font-semibold text-ink transition hover:bg-zest hover:text-paper disabled:opacity-60"
        >
          {status === "saving" ? "Sealing…" : "Seal the policy"}
        </button>

        {status === "saved" && (
          <p className="text-sm text-leaf">
            Policy sealed. The agent below can now be checked against it.
          </p>
        )}
        {status === "error" && (
          <p className="text-sm text-brick">
            Couldn&apos;t save the policy — try again.
          </p>
        )}
      </form>
    </div>
  );
}
