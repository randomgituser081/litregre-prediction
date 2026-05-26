"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Trophy, Lock, Flame } from "lucide-react";
import dayjs from "dayjs";

// ── Types matching /api/prediction/bet_of_day/ ─────────────────────────────────

interface TeamObj {
  id: number;
  logo: string | null;
  name: string;
  slug: string;
}

interface Competition {
  id: number;
  name: string;
  slug: string;
  country: string;
  country_code: string;
}

interface Pick {
  odds: string;
  label: string;
  market: string;
  confidence: string;
  probability: number;
}

export interface BetOfDay {
  match_id: number;
  kickoff: string | null;
  status: string;
  home_team: TeamObj;
  away_team: TeamObj;
  competition: Competition;
  pick: Pick;
  score?: { home: number | null; away: number | null };
}

interface ApiResponse {
  status: number;
  data: BetOfDay[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function TeamBlock({ team }: { team: TeamObj }) {
  return (
    <div className="flex-1 flex flex-col items-center text-center min-w-0">
      <div className="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center mb-2 overflow-hidden">
        {team.logo ? (
          <Image
            src={team.logo}
            alt={team.name}
            width={40}
            height={40}
            className="object-contain"
            unoptimized
          />
        ) : (
          <span className="text-base font-black text-primary">
            {team.name.slice(0, 1)}
          </span>
        )}
      </div>
      <p className="text-xs font-bold leading-tight line-clamp-2 break-words">
        {team.name}
      </p>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function PredictionOfTheDay() {
  const { data: session, status } = useSession();
  const [bet, setBet] = useState<BetOfDay | null>(null);
  const [loading, setLoading] = useState(false);

  const isLoggedIn = status === "authenticated" && !!session?.user;

  useEffect(() => {
    if (!isLoggedIn) return;
    setLoading(true);
    fetch("/api/predictions/bet-of-day")
      .then((r) => r.json())
      .then((data: ApiResponse) => {
        setBet(data.data?.[0] ?? null);
      })
      .catch(() => setBet(null))
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  const kickoff = bet?.kickoff ? dayjs(bet.kickoff) : null;
  const confidencePct = bet?.pick?.probability ?? 0;
  const odds = bet?.pick?.odds ?? "—";

  return (
    <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-700 text-primary-content px-4 py-2.5 flex items-center gap-2">
        <Flame size={16} />
        <span className="font-bold text-sm">Prediction of the Day</span>
      </div>

      {/* Loading */}
      {loading && (
        <div className="p-4 animate-pulse space-y-3">
          <div className="h-3 bg-base-300 rounded w-2/3" />
          <div className="flex justify-between gap-4">
            <div className="flex-1 h-16 bg-base-300 rounded" />
            <div className="flex-1 h-16 bg-base-300 rounded" />
          </div>
          <div className="h-12 bg-base-300 rounded" />
        </div>
      )}

      {/* Not logged in */}
      {!isLoggedIn && status !== "loading" && !loading && (
        <div className="p-5 text-center">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Lock size={18} className="text-primary" />
          </div>
          <p className="text-sm font-semibold mb-1">Today&apos;s Top Pick</p>
          <p className="text-xs text-base-content/55 mb-4">
            Sign in to see today&apos;s highest-confidence prediction.
          </p>
          <Link href="/login" className="btn btn-primary btn-sm w-full">
            Sign In to View
          </Link>
        </div>
      )}

      {/* Logged in — no data */}
      {isLoggedIn && !loading && !bet && (
        <div className="p-5 text-center">
          <Trophy size={28} className="text-base-content/20 mx-auto mb-2" />
          <p className="text-sm font-semibold">No tip for today yet</p>
          <p className="text-xs text-base-content/50 mt-1">Check back later</p>
        </div>
      )}

      {/* Logged in — show bet */}
      {isLoggedIn && !loading && bet && (
        <div className="p-4">
          {/* Competition + kickoff */}
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wide mb-3 gap-2">
            <span className="font-bold text-primary truncate">
              {bet.competition.name}
            </span>
            {kickoff?.isValid() && (
              <span className="text-base-content/50 flex-shrink-0">
                {kickoff.format("MMM D • HH:mm")}
              </span>
            )}
          </div>

          {/* Teams — home LEFT, away RIGHT */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <TeamBlock team={bet.home_team} />
            <div className="text-base-content/30 font-bold text-xs flex-shrink-0 px-1">
              VS
            </div>
            <TeamBlock team={bet.away_team} />
          </div>

          {/* Pick details */}
          <div className="bg-base-200/60 rounded-lg p-3 mb-3">
            <p className="text-[10px] text-base-content/50 uppercase tracking-wide mb-1">
              Our Pick
            </p>
            <p className="font-bold text-sm text-primary mb-2">
              {bet.pick.label}
            </p>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-[10px] text-base-content/50">Confidence</p>
                <p className="font-bold text-sm text-success">{confidencePct}%</p>
              </div>
              <div>
                <p className="text-[10px] text-base-content/50">Odds</p>
                <p className="font-bold text-sm">{odds}</p>
              </div>
              <div>
                <p className="text-[10px] text-base-content/50">Status</p>
                <p className="font-bold text-[11px] capitalize">
                  {bet.status?.toLowerCase() === "ft" ? "Finished" : bet.status || "Upcoming"}
                </p>
              </div>
            </div>
          </div>

          <Link href="/predictions/all" className="btn btn-primary btn-sm w-full">
            View All Tips
          </Link>
        </div>
      )}
    </div>
  );
}
