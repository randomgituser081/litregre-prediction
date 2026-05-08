import { ACCUMULATORS } from "@/lib/mockData";
import Link from "next/link";
import type { Metadata } from "next";
import MatchCard from "@/components/predictions/MatchCard";

export const metadata: Metadata = {
  title: "Bet of the Day – Today's Best Football Tip",
  description: "Our single best football prediction of the day, carefully selected for value and confidence.",
};

export default function BetOfTheDayPage() {
  const bet = ACCUMULATORS[1]; // The "safe double" is our bet of the day

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 mb-6 text-white text-center">
        <div className="text-4xl mb-2">⭐</div>
        <h1 className="font-display font-bold text-2xl mb-1">Bet of the Day</h1>
        <p className="text-white/80 text-sm">Our highest-confidence daily pick</p>
        <div className="inline-flex items-center gap-2 mt-3 bg-white/20 rounded-xl px-4 py-2">
          <span className="font-bold text-2xl">{bet.totalOdds.toFixed(2)}</span>
          <span className="text-white/80 text-sm">Total Odds</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {bet.matches.map(({ match }) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>

      <div className="bg-base-100 border border-base-300 rounded-xl p-4">
        <h2 className="font-bold mb-2">Analysis</h2>
        <p className="text-sm text-base-content/70 leading-relaxed">{bet.analysis}</p>
      </div>

      <div className="mt-4 text-center">
        <Link href="/predictions/accumulator-tips" className="btn btn-primary btn-sm">
          View Full Accumulator Tips →
        </Link>
      </div>
    </div>
  );
}
