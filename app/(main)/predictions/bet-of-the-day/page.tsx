"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, RefreshCw } from "lucide-react";
import dayjs from "dayjs";
import type { VIPPrediction } from "@/components/predictions/VIPPredictionCard";

// The bet_of_day API has no defined schema — it may return a single object,
// an array, or a paginated response. We handle all cases below.
type BetOfDayRaw = Record<string, unknown>;

interface NormalisedBet {
  home: string;
  away: string;
  homeLogo: string | null;
  awayLogo: string | null;
  competition: string;
  kickoff: string | null;
  label: string;
  probability: number | null;
  odds: number | null;
  status: string;
}

function normalise(raw: BetOfDayRaw): NormalisedBet | null {
  // Paginated VIPSchema wrapper → take first item
  if (Array.isArray((raw as { items?: unknown }).items)) {
    const first = ((raw as { items: BetOfDayRaw[] }).items)[0];
    if (first) return normalise(first);
    return null;
  }
  // Array at root → take first
  if (Array.isArray(raw)) {
    const first = (raw as BetOfDayRaw[])[0];
    if (first) return normalise(first);
    return null;
  }

  // VIPPrediction shape
  const v = raw as Partial<VIPPrediction>;
  if (v.home_name && v.away_name) {
    return {
      home: v.home_name,
      away: v.away_name,
      homeLogo: v.home_logo ?? null,
      awayLogo: v.away_logo ?? null,
      competition: v.competition_name ?? "",
      kickoff: v.kickoff ?? null,
      label: v.label ?? "",
      probability: typeof v.probability === "number" ? v.probability : null,
      odds: typeof v.odds === "number" ? v.odds : null,
      status: v.status ?? "",
    };
  }

  // General prediction shape
  const g = raw as Record<string, unknown>;
  if (typeof g.home_team === "string" && typeof g.away_team === "string") {
    return {
      home: g.home_team as string,
      away: g.away_team as string,
      homeLogo: null,
      awayLogo: null,
      competition: "",
      kickoff: (g.date as string) ?? null,
      label: (g.prediction as string) ?? "",
      probability:
        typeof g.prediction_probability === "number"
          ? (g.prediction_probability as number)
          : null,
      odds: null,
      status: (g.is_finished as boolean) ? "finished" : "upcoming",
    };
  }

  return null;
}

function TeamAvatar({
  logo,
  name,
  side,
}: {
  logo: string | null;
  name: string;
  side: "home" | "away";
}) {
  const bg = side === "home" ? "bg-primary/15" : "bg-secondary/15";
  const text = side === "home" ? "text-primary" : "text-secondary";

  if (logo) {
    return (
      <img
        src={logo}
        alt={name}
        className="w-16 h-16 object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }
  return (
    <div
      className={`w-16 h-16 rounded-full ${bg} flex items-center justify-center`}
    >
      <span className={`text-2xl font-black ${text}`}>
        {name.slice(0, 1)}
      </span>
    </div>
  );
}

export default function BetOfTheDayPage() {
  const [bet, setBet] = useState<NormalisedBet | null>(null);
  const [raw, setRaw] = useState<BetOfDayRaw | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/predictions/bet-of-day");
      if (!res.ok) throw new Error();
      const data = (await res.json()) as BetOfDayRaw;
      setRaw(data);
      setBet(normalise(data));
    } catch {
      setError("Could not load today's best bet. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const pct =
    bet?.probability != null
      ? bet.probability > 1
        ? Math.round(bet.probability)
        : Math.round(bet.probability * 100)
      : null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 mb-6 text-white text-center">
        <div className="text-4xl mb-2">⭐</div>
        <h1 className="font-bold text-2xl mb-1">Bet of the Day</h1>
        <p className="text-white/80 text-sm">Our highest-confidence daily pick</p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-base-100 border border-base-300 rounded-2xl p-8 animate-pulse space-y-4">
          <div className="flex justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="w-16 h-16 rounded-full bg-base-300 mx-auto" />
              <div className="h-3 bg-base-300 rounded w-2/3 mx-auto" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="w-16 h-16 rounded-full bg-base-300 mx-auto" />
              <div className="h-3 bg-base-300 rounded w-2/3 mx-auto" />
            </div>
          </div>
          <div className="h-14 bg-base-300 rounded-xl" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-base-100 border border-base-300 rounded-2xl p-8 text-center">
          <p className="text-sm text-error mb-4">{error}</p>
          <button onClick={load} className="btn btn-sm btn-outline btn-primary gap-2">
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* No data / unknown shape */}
      {!loading && !error && !bet && raw && (
        <div className="bg-base-100 border border-base-300 rounded-2xl p-8 text-center">
          <p className="text-3xl mb-2">⭐</p>
          <p className="font-semibold mb-1">Bet of the Day</p>
          <p className="text-sm text-base-content/55">
            Today&apos;s pick is being prepared. Check back soon.
          </p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && !raw && (
        <div className="bg-base-100 border border-base-300 rounded-2xl p-8 text-center">
          <Star size={32} className="mx-auto text-amber-400 mb-3" />
          <p className="font-semibold mb-1">No pick today yet</p>
          <p className="text-sm text-base-content/55">Check back later.</p>
        </div>
      )}

      {/* Bet card */}
      {!loading && bet && (
        <div className="bg-base-100 border border-base-300 rounded-2xl overflow-hidden">
          {/* Competition + time */}
          {(bet.competition || bet.kickoff) && (
            <div className="flex items-center gap-2 px-5 py-3 bg-base-200/60 border-b border-base-300 text-xs text-base-content/55">
              {bet.competition && (
                <span className="font-semibold text-primary">{bet.competition}</span>
              )}
              {bet.competition && bet.kickoff && <span>•</span>}
              {bet.kickoff && dayjs(bet.kickoff).isValid() && (
                <span>{dayjs(bet.kickoff).format("ddd, MMM D • HH:mm")}</span>
              )}
              <span className="ml-auto capitalize font-medium">{bet.status}</span>
            </div>
          )}

          {/* Teams */}
          <div className="flex items-center justify-between gap-4 px-6 py-6">
            <div className="flex-1 flex flex-col items-center gap-2 text-center">
              <TeamAvatar logo={bet.homeLogo} name={bet.home} side="home" />
              <p className="text-sm font-bold leading-tight">{bet.home}</p>
            </div>
            <div className="text-base-content/30 font-bold text-lg flex-shrink-0">
              VS
            </div>
            <div className="flex-1 flex flex-col items-center gap-2 text-center">
              <TeamAvatar logo={bet.awayLogo} name={bet.away} side="away" />
              <p className="text-sm font-bold leading-tight">{bet.away}</p>
            </div>
          </div>

          {/* Prediction stats */}
          <div className="grid grid-cols-3 divide-x divide-base-300 border-t border-base-300">
            <div className="text-center py-4 px-2">
              <p className="text-[10px] text-base-content/50 uppercase tracking-wide mb-1">
                Tip
              </p>
              <p className="font-bold text-sm text-primary">{bet.label || "—"}</p>
            </div>
            <div className="text-center py-4 px-2">
              <p className="text-[10px] text-base-content/50 uppercase tracking-wide mb-1">
                Confidence
              </p>
              <p className="font-bold text-sm text-success">
                {pct != null ? `${pct}%` : "—"}
              </p>
            </div>
            <div className="text-center py-4 px-2">
              <p className="text-[10px] text-base-content/50 uppercase tracking-wide mb-1">
                Odds
              </p>
              <p className="font-bold text-sm">
                {bet.odds != null ? bet.odds.toFixed(2) : "—"}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="p-4 border-t border-base-300">
            <Link
              href="/predictions/accumulator-tips"
              className="btn btn-primary w-full"
            >
              View Accumulator Tips →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
