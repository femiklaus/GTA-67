import { NextRequest, NextResponse } from "next/server";
import { getPublicPolicySummary, setBudget } from "@/lib/store/policy-store";

export async function POST(req: NextRequest) {
  const { budget } = (await req.json()) as { budget?: number };
  if (typeof budget !== "number" || !Number.isFinite(budget) || budget <= 0) {
    return NextResponse.json(
      { error: "budget must be a positive number" },
      { status: 400 }
    );
  }
  setBudget(budget);
  return NextResponse.json(getPublicPolicySummary());
}

export async function GET() {
  return NextResponse.json(getPublicPolicySummary());
}
