"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { History, ChevronRight } from "lucide-react";
import dayjs from "dayjs";
import { apiFetch } from "@/lib/apiFetch";

interface GeneralItem {
  game_id: string;
  home_team: string;
  away_team: string;
  prediction: string;
  is_finished: boolean;
  date: string;
  prediction_probability: number;
  is_prediction_correct: boolean | null;
  result_score: string | null;
}

interface ApiResponse {
  items: GeneralItem[];
  count: number;
}

function StatusDot({ item }: { item: GeneralItem }) {
  if (!item.is_finished) {
    return <span className="w-2 h-2 rounded-full bg-base-content/30 flex-shrink-0" />;
  }
  if (item.is_prediction_correct === true) {
    return <span className="w-2 h-2 rounded-full bg-success flex-shrink-0" />;
  }
  if (item.is_prediction_correct === false) {
    return <span className="w-2 h-2 rounded-full bg-error flex-shrink-0" />;
  }
  return <span className="w-2 h-2 rounded-full bg-base-content/30 flex-shrink-0" />;
}

export default function PastPredictionsList({ limit = 6 }: { limit?: number }) {
  const [items, setItems] = useState<GeneralItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiFetch(`/api/predictions/general?page=1&page_size=${limit}`)
      .then((r) => r.json())
      .then((data: ApiResponse) => {
        setItems(data.items ?? []);
        setCount(data.count ?? 0);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [limit]);

  return (
    <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-base-200 px-4 py-2.5 flex items-center gap-2 border-b border-base-300">
        <History size={15} className="text-base-content/70" />
        <span className="font-bold text-sm">Past Predictions</span>
        {count > 0 && (
          <span className="ml-auto text-[10px] font-semibold text-base-content/50">
            {count} total
          </span>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="divide-y divide-base-300">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="px-3 py-2.5 animate-pulse space-y-1">
              <div className="h-2.5 bg-base-300 rounded w-3/4" />
              <div className="h-2 bg-base-300 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && items.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-xs text-base-content/50">No past predictions</p>
        </div>
      )}

      {/* List */}
      {!loading && items.length > 0 && (
        <div className="divide-y divide-base-300">
          {items.map((item) => {
            const date = dayjs(item.date);
            return (
              <div
                key={item.game_id}
                className="px-3 py-2.5 hover:bg-base-200/50 transition-colors"
              >
                {/* Teams home vs away */}
                <div className="flex items-center gap-2 mb-1">
                  <StatusDot item={item} />
                  <p className="text-xs font-semibold truncate flex-1 min-w-0">
                    <span className="text-base-content">{item.home_team}</span>
                    <span className="text-base-content/40 mx-1">vs</span>
                    <span className="text-base-content">{item.away_team}</span>
                  </p>
                </div>

                {/* Meta row */}
                <div className="flex items-center gap-2 pl-4 text-[10px]">
                  <span className="text-base-content/50">
                    {date.isValid() ? date.format("MMM D") : ""}
                  </span>
                  <span className="badge badge-ghost badge-xs font-bold">
                    {item.prediction}
                  </span>
                  {item.result_score && (
                    <span className="text-primary font-bold ml-auto">
                      {item.result_score}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Load more / View all CTA */}
          <Link
            href="/predictions/all"
            className="flex items-center justify-center gap-1 px-3 py-2.5 text-xs font-semibold text-primary hover:bg-base-200 transition-colors"
          >
            View all predictions
            <ChevronRight size={13} />
          </Link>
        </div>
      )}
    </div>
  );
}
