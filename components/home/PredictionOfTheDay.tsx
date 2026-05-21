"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Trophy, Lock } from "lucide-react";
import dayjs from "dayjs";

interface TodayPrediction {
  game_id: string;
  home_team: string;
  away_team: string;
  prediction: string;
  is_finished: boolean;
  date: string;
  date_time: string;
  prediction_probability: number;
}

interface ApiResponse {
  items: TodayPrediction[];
  count: number;
}

function normalisePct(p: number) {
  return p > 1 ? Math.round(p) : Math.round(p * 100);
}

export default function PredictionOfTheDay() {
  const { data: session, status } = useSession();
  const [prediction, setPrediction] = useState<TodayPrediction | null>(null);
  const [loading, setLoading] = useState(false);

  const isLoggedIn = status === "authenticated" && !!session?.user;

  useEffect(() => {
    if (!isLoggedIn) return;
    setLoading(true);
    fetch("/api/predictions/today?page=1&page_size=1")
      .then((r) => r.json())
      .then((data: ApiResponse) => {
        setPrediction(data.items?.[0] ?? null);
      })
      .catch(() => setPrediction(null))
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  return (
    <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-primary text-primary-content px-4 py-2.5 flex items-center gap-2">
        <Trophy size={16} />
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

      {/* Logged in — no prediction */}
      {isLoggedIn && !loading && !prediction && (
        <div className="p-5 text-center">
          <p className="text-2xl mb-2">⚽</p>
          <p className="text-sm font-semibold">No tip for today yet</p>
          <p className="text-xs text-base-content/50 mt-1">Check back later</p>
        </div>
      )}

      {/* Logged in — has prediction */}
      {isLoggedIn && !loading && prediction && (
        <div className="p-4">
          {/* Date */}
          <div className="text-xs text-base-content/55 mb-3">
            <span className="font-semibold text-primary">
              {dayjs(prediction.date).isValid()
                ? dayjs(prediction.date).format("ddd, MMM D • HH:mm")
                : prediction.date_time}
            </span>
          </div>

          {/* Teams */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex-1 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-1.5">
                <span className="text-lg font-black text-primary">
                  {prediction.home_team.slice(0, 1)}
                </span>
              </div>
              <p className="text-xs font-bold leading-tight line-clamp-2">
                {prediction.home_team}
              </p>
            </div>

            <div className="text-base-content/30 font-bold text-sm flex-shrink-0">
              V.S
            </div>

            <div className="flex-1 text-center">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-1.5">
                <span className="text-lg font-black text-secondary">
                  {prediction.away_team.slice(0, 1)}
                </span>
              </div>
              <p className="text-xs font-bold leading-tight line-clamp-2">
                {prediction.away_team}
              </p>
            </div>
          </div>

          {/* Prediction + probability */}
          <div className="bg-base-200/60 rounded-lg p-3 flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] text-base-content/50 uppercase tracking-wide">
                Prediction
              </p>
              <p className="font-bold text-sm text-primary">
                {prediction.prediction}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-base-content/50 uppercase tracking-wide">
                Confidence
              </p>
              <p className="font-bold text-sm text-success">
                {normalisePct(prediction.prediction_probability)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-base-content/50 uppercase tracking-wide">
                Status
              </p>
              <p className="text-xs font-semibold">
                {prediction.is_finished ? "Finished" : "Upcoming"}
              </p>
            </div>
          </div>

          <Link href="/predictions/today" className="btn btn-primary btn-sm w-full">
            View All Today&apos;s Tips
          </Link>
        </div>
      )}
    </div>
  );
}
