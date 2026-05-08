import { ACCUMULATORS, BETTING_SITES } from "@/lib/mockData";
import MatchCard from "@/components/predictions/MatchCard";
import SafeImage from "@/components/ui/SafeImage";
import Link from "next/link";
import BettingSiteWidget from "@/components/ads/BettingSiteWidget";
import { Layers, TrendingUp } from "lucide-react";
import type { Metadata } from "next";
import clsx from "clsx";

export const metadata: Metadata = {
  title: "Accumulator Tips – Daily Football Accumulators",
  description: "Free daily football accumulator tips with expert analysis. 5-folds, doubles, and trebles with the best odds.",
};

const STATUS_CONFIG = {
  pending: { label: "Pending", class: "badge-warning" },
  won: { label: "Won ✓", class: "badge-success" },
  lost: { label: "Lost ✗", class: "badge-error" },
};

export default function AccumulatorPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Layers size={22} />
          <h1 className="font-display font-bold text-2xl">Accumulator Tips</h1>
        </div>
        <p className="text-white/80 text-sm max-w-xl">
          Daily expert accumulator tips with detailed analysis. We combine the best value picks across all major leagues.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Accumulators */}
        <div className="lg:col-span-2 space-y-5">
          {ACCUMULATORS.map((acc) => {
            const status = STATUS_CONFIG[acc.status];
            return (
              <div key={acc.id} className="bg-base-100 border border-base-300 rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary/10 to-transparent border-b border-base-300">
                  <div>
                    <h2 className="font-bold text-base">{acc.title}</h2>
                    <p className="text-xs text-base-content/60">{acc.date}</p>
                  </div>
                  <span className={`badge ${status.class}`}>{status.label}</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 divide-x divide-base-300 border-b border-base-300">
                  <div className="text-center py-3">
                    <p className="text-xs text-base-content/60">Total Odds</p>
                    <p className="font-bold text-xl text-primary">{acc.totalOdds.toFixed(2)}</p>
                  </div>
                  <div className="text-center py-3">
                    <p className="text-xs text-base-content/60">Selections</p>
                    <p className="font-bold text-xl">{acc.matches.length}</p>
                  </div>
                  <div className="text-center py-3">
                    <p className="text-xs text-base-content/60">Confidence</p>
                    <p className="font-bold text-sm flex items-center justify-center gap-1">
                      <TrendingUp size={13} className="text-warning" />
                      {acc.confidence.charAt(0).toUpperCase() + acc.confidence.slice(1)}
                    </p>
                  </div>
                </div>

                {/* Selections */}
                <div className="divide-y divide-base-300">
                  {acc.matches.map(({ match, pick, odds }) => (
                    <Link
                      key={match.id}
                      href={`/predictions/match/${match.slug}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-base-200/50 transition-colors"
                    >
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <SafeImage src={match.homeTeam.logo} alt="" className="w-5 h-5 object-contain" />
                        <SafeImage src={match.awayTeam.logo} alt="" className="w-5 h-5 object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {match.homeTeam.name} vs {match.awayTeam.name}
                        </p>
                        <p className="text-xs text-primary">{pick}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-sm">{odds}</p>
                        <p className="text-[10px] text-base-content/50">{match.time}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Analysis */}
                <div className="px-4 py-3 bg-base-200/50 border-t border-base-300">
                  <p className="text-xs text-base-content/70 leading-relaxed">{acc.analysis}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="bg-base-100 border border-base-300 rounded-xl p-4">
            <h3 className="font-bold text-sm mb-3">💡 Accumulator Tips</h3>
            <ul className="space-y-2 text-xs text-base-content/70">
              {[
                "Never bet your entire bankroll on an accumulator",
                "Accas have lower probability — they're high-risk, high-reward",
                "3 to 5 selections give the best balance of odds and probability",
                "Consider each-way cash-out options to lock in profit early",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-1.5">
                  <span className="text-primary">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-base-100 border border-base-300 rounded-xl p-4">
            <h3 className="font-bold text-sm mb-3">Bet This Acca</h3>
            {BETTING_SITES.slice(0, 3).map((site) => (
              <BettingSiteWidget key={site.id} site={site} variant="compact" />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
