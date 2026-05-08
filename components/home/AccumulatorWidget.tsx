import Link from "next/link";
import type { AccumulatorTip } from "@/types";
import { Layers, TrendingUp } from "lucide-react";
import clsx from "clsx";

interface Props {
  accumulator: AccumulatorTip;
}

const STATUS_CONFIG = {
  pending: { label: "Pending", class: "badge-warning" },
  won: { label: "Won ✓", class: "badge-success" },
  lost: { label: "Lost ✗", class: "badge-error" },
};

export default function AccumulatorWidget({ accumulator }: Props) {
  const status = STATUS_CONFIG[accumulator.status];

  return (
    <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <Layers size={16} />
          <span className="font-bold text-sm">Accumulator of the Day</span>
        </div>
        <span className={`badge badge-sm ${status.class}`}>{status.label}</span>
      </div>

      {/* Total odds */}
      <div className="flex items-center justify-between px-4 py-3 bg-primary/5 border-b border-base-300">
        <div>
          <p className="text-xs text-base-content/60">Total Odds</p>
          <p className="text-2xl font-bold text-primary">{accumulator.totalOdds.toFixed(2)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-base-content/60">Confidence</p>
          <div className="flex items-center gap-1">
            <TrendingUp size={13} className="text-warning" />
            <span className="text-sm font-semibold capitalize">{accumulator.confidence}</span>
          </div>
        </div>
      </div>

      {/* Selections */}
      <div className="divide-y divide-base-300">
        {accumulator.matches.map(({ match, pick, odds }) => (
          <Link
            key={match.id}
            href={`/predictions/match/${match.slug}`}
            className="flex items-center justify-between px-4 py-2.5 hover:bg-base-200/50 transition-colors"
          >
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate">
                {match.homeTeam.shortName} vs {match.awayTeam.shortName}
              </p>
              <p className="text-[10px] text-base-content/60 truncate">{pick}</p>
            </div>
            <span className="text-sm font-bold text-primary flex-shrink-0 ml-2">{odds}</span>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="p-3">
        <Link
          href="/predictions/accumulator-tips"
          className="btn btn-primary btn-sm w-full"
        >
          View Full Analysis
        </Link>
      </div>
    </div>
  );
}
