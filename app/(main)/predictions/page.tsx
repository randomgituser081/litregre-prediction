import { MATCHES, PREDICTION_CATEGORIES } from "@/lib/mockData";
import MatchCard from "@/components/predictions/MatchCard";
import Link from "next/link";
import { Trophy } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Football Predictions",
  description: "Browse all football predictions including straight win, correct score, over 2.5 goals, BTTS and more.",
};

export default function PredictionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Trophy size={20} />
          <h1 className="font-display font-bold text-2xl">All Predictions</h1>
        </div>
        <p className="text-white/80 text-sm max-w-xl">
          Expert football predictions across 20+ prediction types. Browse by category below.
        </p>
      </div>

      {/* Category grid */}
      <div className="mb-8">
        <h2 className="font-bold text-lg mb-3">Browse by Prediction Type</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {PREDICTION_CATEGORIES.map((cat) => (
            <Link
              key={cat.type}
              href={`/predictions/${cat.type}`}
              className="flex flex-col items-center gap-2 p-4 bg-base-100 border border-base-300 rounded-xl hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm transition-all text-center group"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-sm font-semibold group-hover:text-primary">{cat.label}</span>
              <span className="text-[10px] text-base-content/50 leading-tight">{cat.description}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured matches */}
      <div>
        <h2 className="font-bold text-lg mb-3">Featured Predictions Today</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {MATCHES.slice(0, 8).map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </div>
    </div>
  );
}
