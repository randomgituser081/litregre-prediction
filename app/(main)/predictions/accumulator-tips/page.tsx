"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Layers, Lock, TrendingUp } from "lucide-react";
import VIPPredictionCard, {
  type VIPPrediction,
} from "@/components/predictions/VIPPredictionCard";
import Pagination from "@/components/ui/Pagination";
import { apiFetch } from "@/lib/apiFetch";
import { BETTING_SITES } from "@/lib/mockData";
import BettingSiteWidget from "@/components/ads/BettingSiteWidget";

interface ApiResponse {
  items: VIPPrediction[];
  count: number;
}

const PAGE_SIZE = 10;

function SkeletonCards({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="border border-base-300 rounded-xl p-4 animate-pulse space-y-3"
        >
          <div className="h-3 bg-base-300 rounded w-1/3" />
          <div className="flex justify-between gap-4">
            <div className="flex-1 h-8 bg-base-300 rounded" />
            <div className="flex-1 h-8 bg-base-300 rounded" />
          </div>
          <div className="flex gap-3">
            <div className="h-5 w-20 bg-base-300 rounded-full" />
            <div className="h-5 w-12 bg-base-300 rounded-full" />
            <div className="h-5 w-12 bg-base-300 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function CombinedOddsBar({ items }: { items: VIPPrediction[] }) {
  if (items.length === 0) return null;
  const combined = items.reduce((acc, p) => acc * p.odds, 1);
  return (
    <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 rounded-xl p-4 mb-5 flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <TrendingUp size={18} className="text-primary" />
        <span className="font-bold text-sm">Combined Accumulator</span>
      </div>
      <div className="flex gap-4 ml-auto text-center">
        <div>
          <p className="text-[10px] text-base-content/50 uppercase">Selections</p>
          <p className="font-bold text-lg">{items.length}</p>
        </div>
        <div>
          <p className="text-[10px] text-base-content/50 uppercase">Total Odds</p>
          <p className="font-bold text-lg text-primary">{combined.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export default function AccumulatorPage() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && !!session?.user;

  const [items, setItems] = useState<VIPPrediction[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalPages = Math.ceil(count / PAGE_SIZE) || 1;

  const fetchPage = useCallback(async (p: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch(
        `/api/predictions/accumulator?page=${p}&page_size=${PAGE_SIZE}`
      );
      if (res.status === 401) {
        setError("session_expired");
        return;
      }
      if (!res.ok) throw new Error();
      const data = (await res.json()) as ApiResponse;
      setCount(data.count ?? 0);
      setItems(data.items ?? []);
    } catch {
      setError("Could not load accumulator tips. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  function handlePageChange(p: number) {
    setPage(p);
    fetchPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    if (isLoggedIn) fetchPage(1);
  }, [isLoggedIn, fetchPage]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Layers size={22} />
          <h1 className="font-bold text-2xl">Accumulator Tips</h1>
        </div>
        <p className="text-white/80 text-sm max-w-xl">
          Expert accumulator picks with odds and confidence ratings. Combine them
          for maximum returns.
        </p>
        {count > 0 && (
          <span className="inline-block mt-3 bg-white/20 rounded-lg px-3 py-1 text-sm font-semibold">
            {count} selections available
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Session loading */}
          {status === "loading" && <SkeletonCards />}

          {/* Not logged in */}
          {status !== "loading" && !isLoggedIn && (
            <div className="bg-base-100 border border-base-300 rounded-2xl flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Lock size={24} className="text-primary" />
              </div>
              <h2 className="font-bold text-lg mb-2">Members Only</h2>
              <p className="text-sm text-base-content/55 max-w-sm mb-5">
                Accumulator tips are available to registered users. Sign in to
                access today&apos;s selections and combined odds.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/login?callbackUrl=/predictions/accumulator-tips" className="btn btn-primary">
                  Sign In
                </Link>
                <Link href="/signup?invite=1" className="btn btn-outline btn-primary">
                  Create Account
                </Link>
              </div>
            </div>
          )}

          {/* Logged in */}
          {isLoggedIn && (
            <>
              {loading && items.length === 0 && <SkeletonCards />}

              {error && error !== "session_expired" && (
                <div className="bg-base-100 border border-base-300 rounded-xl p-6 text-center">
                  <p className="text-sm text-error mb-3">{error}</p>
                  <button onClick={() => fetchPage(1)} className="btn btn-sm btn-outline btn-primary">
                    Retry
                  </button>
                </div>
              )}

              {error === "session_expired" && (
                <div className="bg-base-100 border border-base-300 rounded-xl p-6 text-center">
                  <p className="text-sm text-error mb-3">Your session expired. Please sign in again.</p>
                  <Link href="/login?callbackUrl=/predictions/accumulator-tips" className="btn btn-sm btn-primary">
                    Sign In Again
                  </Link>
                </div>
              )}

              {!loading && !error && items.length === 0 && (
                <div className="bg-base-100 border border-base-300 rounded-2xl py-14 text-center">
                  <p className="text-3xl mb-2">🎲</p>
                  <p className="font-semibold">No accumulator tips yet</p>
                  <p className="text-xs text-base-content/50 mt-1">Check back later</p>
                </div>
              )}

              {!loading && items.length > 0 && (
                <>
                  <CombinedOddsBar items={items} />
                  {items.map((p) => (
                    <VIPPredictionCard key={p.match_id} prediction={p} />
                  ))}
                </>
              )}

              {!error && (
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  loading={loading}
                />
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="bg-base-100 border border-base-300 rounded-xl p-4">
            <h3 className="font-bold text-sm mb-3">💡 Accumulator Tips</h3>
            <ul className="space-y-2 text-xs text-base-content/70">
              {[
                "Never bet your entire bankroll on an accumulator",
                "3 to 5 selections give the best balance of odds and probability",
                "High odds accas are high-risk — stake responsibly",
                "Consider cash-out options to lock in profit early",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-1.5">
                  <span className="text-primary mt-0.5">•</span>
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
