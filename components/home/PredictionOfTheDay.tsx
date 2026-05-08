"use client";

import Link from "next/link";
import { getFeaturedMatches, BETTING_SITES } from "@/lib/mockData";
import { Trophy } from "lucide-react";

export default function PredictionOfTheDay() {
  const match = getFeaturedMatches()[0];
  if (!match) return null;
  const site = BETTING_SITES[0];

  return (
    <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden mb-4 shadow-sm">
      {/* Header */}
      <div className="bg-primary text-primary-content px-4 py-2.5 flex items-center gap-2">
        <Trophy size={16} />
        <span className="font-bold text-sm">Prediction of the Day</span>
      </div>

      <div className="p-4">
        {/* League + date */}
        <div className="flex items-center gap-2 text-xs text-base-content/60 mb-3">
          <span className="font-semibold text-primary">{match.league.name}</span>
          <span>•</span>
          <span>{match.date}</span>
          <span>•</span>
          <span>{match.time}</span>
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex-1 flex flex-col items-center gap-1.5 text-center">
            <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-12 h-12 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.3"; }} />
            <p className="text-xs font-bold">{match.homeTeam.name}</p>
          </div>
          <div className="text-base-content/40 font-bold text-sm">V.S</div>
          <div className="flex-1 flex flex-col items-center gap-1.5 text-center">
            <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-12 h-12 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.3"; }} />
            <p className="text-xs font-bold">{match.awayTeam.name}</p>
          </div>
        </div>

        {/* Prediction row */}
        <div className="bg-base-200/60 rounded-lg p-3 flex items-center justify-between mb-3">
          <div>
            <p className="text-[10px] text-base-content/50 uppercase tracking-wide">Prediction</p>
            <p className="font-bold text-sm text-primary">{match.prediction.value}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-base-content/50 uppercase tracking-wide">Odds</p>
            <p className="font-bold text-sm">{match.odds.home}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-base-content/50 uppercase tracking-wide">Bet</p>
            <p className="font-bold text-sm">₦165</p>
          </div>
        </div>

        {/* Sponsor */}
        <p className="text-[10px] text-base-content/40 text-center mb-2">Betting odds sponsored by {site.name}</p>

        {/* CTAs */}
        <div className="flex gap-2">
          <Link href={`/predictions/match/${match.slug}`} className="btn btn-outline btn-primary btn-sm flex-1">
            See Prediction
          </Link>
          <Link href={`/go/${site.slug}`} className="btn btn-primary btn-sm flex-1">
            Bet Now
          </Link>
        </div>
      </div>
    </div>
  );
}
