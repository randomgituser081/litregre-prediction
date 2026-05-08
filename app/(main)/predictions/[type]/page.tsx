import { MATCHES, PREDICTION_CATEGORIES } from "@/lib/mockData";
import MatchCard from "@/components/predictions/MatchCard";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: { type: string };
}

export function generateStaticParams() {
  return PREDICTION_CATEGORIES.map((c) => ({ type: c.type }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = PREDICTION_CATEGORIES.find((c) => c.type === params.type);
  if (!category) return { title: "Predictions" };
  return {
    title: `${category.label} Predictions`,
    description: `Free daily ${category.label} football predictions. ${category.description}`,
  };
}

export default function PredictionTypePage({ params }: Props) {
  const category = PREDICTION_CATEGORIES.find((c) => c.type === params.type);
  if (!category) notFound();

  // Return all matches for this prediction type (in a real app, filter properly)
  const matches = MATCHES.filter((m) => m.prediction.type === params.type);
  // Fallback: show all matches if none match this specific type
  const displayMatches = matches.length > 0 ? matches : MATCHES.slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-base-content/60 mb-4">
        <Link href="/predictions" className="hover:text-primary flex items-center gap-1">
          <ArrowLeft size={14} />
          Predictions
        </Link>
        <span>/</span>
        <span className="text-base-content font-medium">{category.label}</span>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{category.icon}</span>
          <div>
            <h1 className="font-display font-bold text-2xl">{category.label} Predictions</h1>
            <p className="text-white/80 text-sm">{category.description}</p>
          </div>
        </div>
        <div className="flex gap-4 mt-3 text-sm">
          <div className="bg-white/10 rounded-lg px-3 py-1.5">
            <span className="font-bold">{displayMatches.length}</span>
            <span className="text-white/70 ml-1">predictions today</span>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-base-100 border border-base-300 rounded-xl p-4 mb-6">
        <h2 className="font-semibold text-sm mb-2">How {category.label} Betting Works</h2>
        <p className="text-sm text-base-content/70 leading-relaxed">
          {getTypeExplanation(params.type)}
        </p>
      </div>

      {/* Matches */}
      {displayMatches.length > 0 ? (
        <div>
          <h2 className="font-bold text-base mb-3">Today's {category.label} Tips</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-base-200/50 rounded-2xl">
          <p className="text-4xl mb-3">⚽</p>
          <p className="font-semibold">No predictions yet for today</p>
          <p className="text-base-content/60 text-sm mt-1">Check back later for today's tips</p>
        </div>
      )}

      {/* Other categories */}
      <div className="mt-8">
        <h3 className="font-bold text-sm mb-3 text-base-content/60 uppercase tracking-wide">
          Other Prediction Types
        </h3>
        <div className="flex flex-wrap gap-2">
          {PREDICTION_CATEGORIES.filter((c) => c.type !== params.type)
            .slice(0, 8)
            .map((cat) => (
              <Link
                key={cat.type}
                href={`/predictions/${cat.type}`}
                className="badge badge-outline hover:badge-primary transition-colors text-xs py-2.5 px-3 gap-1"
              >
                {cat.icon} {cat.label}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

function getTypeExplanation(type: string): string {
  const explanations: Record<string, string> = {
    "straight-win": "A 1X2 bet where you predict whether the home team wins (1), it ends in a draw (X), or the away team wins (2). This is the most common type of football bet.",
    "correct-score": "Predict the exact final score of the match. This is a high-odds market with potentially big returns, but requires precise prediction.",
    "over-15": "Bet that the match will have 2 or more goals in total. This market settles as a win if there are at least 2 goals scored in the full 90 minutes.",
    "over-25-goals": "Bet that the match will have 3 or more goals in total. One of the most popular markets in football betting.",
    "under-35-goals": "Bet that the match will have 3 or fewer goals in total. Ideal for defensive clashes and low-scoring leagues.",
    "double-chance": "Cover two of three possible outcomes with a single bet: Home/Draw, Draw/Away, or Home/Away. Lower odds but higher chance of winning.",
    "both-teams-to-score": "Predict that both teams will score at least one goal during the match. Doesn't matter what the final score is.",
    "dnb": "Draw No Bet removes the draw from the equation. If your team wins, you win. If it's a draw, your stake is returned.",
    "sure-2-odd": "Carefully selected tips at approximately 2.0 odds. These are high-confidence picks from our analysts.",
    "sure-3-odd": "High-value picks at approximately 3.0 odds. Greater returns with still-solid analysis backing each selection.",
    "handicap": "Asian Handicap betting eliminates the draw by giving one team a virtual advantage or disadvantage before kickoff.",
    "half-time-full-time": "Predict the result at both half time and full time. For example, Home/Away means the home team leads at HT but the away team wins at FT.",
  };
  return explanations[type] ?? `${type.replace(/-/g, " ")} is a popular football betting market. Our analysts provide daily tips with detailed reasoning behind each selection.`;
}
