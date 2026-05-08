"use client";

import Link from "next/link";
import type { Match } from "@/types";
import { ChevronRight } from "lucide-react";

interface Props {
  match: Match;
}

function TeamLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="w-6 h-6 object-contain flex-shrink-0"
      onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }}
    />
  );
}

function getOddsForPrediction(match: Match): number {
  const type = match.prediction.type;
  if (type === "both-teams-to-score") return match.odds.btts;
  if (type === "over-25-goals") return match.odds.over25;
  if (type === "under-35-goals") return match.odds.under25;
  const val = match.prediction.value.toLowerCase();
  if (val.includes("draw")) return match.odds.draw;
  if (val.includes("away") || val.includes(match.awayTeam.shortName.toLowerCase())) return match.odds.away;
  return match.odds.home;
}

export default function MatchCard({ match }: Props) {
  const odds = getOddsForPrediction(match);

  return (
    <div className="border-b border-base-300 last:border-0">
      {/* Match row */}
      <div className="flex items-center gap-2 px-3 py-2.5 hover:bg-base-200/50 transition-colors">
        {/* Time */}
        <div className="w-10 flex-shrink-0 text-center">
          <span className="text-xs font-semibold text-base-content/70">{match.time}</span>
        </div>

        {/* Teams */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <TeamLogo src={match.homeTeam.logo} alt={match.homeTeam.name} />
            <span className="text-xs font-semibold truncate">{match.homeTeam.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TeamLogo src={match.awayTeam.logo} alt={match.awayTeam.name} />
            <span className="text-xs font-semibold truncate">{match.awayTeam.name}</span>
          </div>
        </div>

        {/* Prediction */}
        <div className="hidden sm:block flex-shrink-0 text-right mr-2">
          <p className="text-[10px] text-base-content/50 uppercase tracking-wide">Prediction</p>
          <p className="text-xs font-bold text-primary truncate max-w-[90px]">{match.prediction.value}</p>
        </div>

        {/* Odds */}
        <div className="flex-shrink-0 w-10 text-center">
          <p className="text-[10px] text-base-content/50">Odds</p>
          <p className="text-xs font-bold text-base-content">{odds}</p>
        </div>

        {/* Bet Now button */}
        <Link
          href={`/predictions/match/${match.slug}`}
          className="flex-shrink-0 btn btn-primary btn-xs rounded-full px-3 text-[10px]"
        >
          Bet Now
        </Link>
      </div>

      {/* View Prediction link */}
      <Link
        href={`/predictions/match/${match.slug}`}
        className="flex items-center justify-center gap-1 py-1 text-[10px] text-primary hover:underline bg-primary/5"
      >
        View Prediction <ChevronRight size={10} />
      </Link>
    </div>
  );
}

