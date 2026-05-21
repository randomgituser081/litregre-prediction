"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Trophy, Lock, ChevronDown, Crown } from "lucide-react";
import PredictionOfTheDay from "@/components/home/PredictionOfTheDay";
import BettingSiteWidget from "@/components/ads/BettingSiteWidget";
import GeneralPredictionCard, {
  type GeneralPrediction,
} from "@/components/predictions/GeneralPredictionCard";
import VIPPredictionCard, {
  type VIPPrediction,
} from "@/components/predictions/VIPPredictionCard";
import { BETTING_SITES } from "@/lib/mockData";

type Tab = "general" | "vip";

interface PaginatedResponse<T> {
  items: T[];
  count: number;
}

const PAGE_SIZE = 20;

function SkeletonRows({ count = 6 }: { count?: number }) {
  return (
    <div className="divide-y divide-base-300">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-3 animate-pulse">
          <div className="w-10 h-3 bg-base-300 rounded" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 bg-base-300 rounded w-2/3" />
            <div className="h-3 bg-base-300 rounded w-1/2" />
          </div>
          <div className="w-12 h-5 bg-base-300 rounded-full" />
          <div className="w-14 h-5 bg-base-300 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function VIPLockScreen() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Lock size={28} className="text-primary" />
      </div>
      <h3 className="font-bold text-lg mb-2">VIP Predictions</h3>
      <p className="text-sm text-base-content/60 max-w-sm mb-6">
        VIP predictions include team logos, competition details, accurate odds
        and higher-confidence tips. Sign in to unlock access.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/login" className="btn btn-primary">
          Sign In to Access VIP
        </Link>
        <Link href="/signup?invite=1" className="btn btn-outline btn-primary">
          Create Account
        </Link>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { data: session, status: authStatus } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>("general");

  // ── General predictions state ──────────────────────────────────────────────
  const [generalItems, setGeneralItems] = useState<GeneralPrediction[]>([]);
  const [generalCount, setGeneralCount] = useState(0);
  const [generalPage, setGeneralPage] = useState(1);
  const [generalLoading, setGeneralLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  // ── VIP predictions state ──────────────────────────────────────────────────
  const [vipItems, setVipItems] = useState<VIPPrediction[]>([]);
  const [vipCount, setVipCount] = useState(0);
  const [vipPage, setVipPage] = useState(1);
  const [vipLoading, setVipLoading] = useState(false);
  const [vipError, setVipError] = useState("");

  // ── Fetch general ──────────────────────────────────────────────────────────
  const fetchGeneral = useCallback(async (page: number, append = false) => {
    setGeneralLoading(true);
    setGeneralError("");
    try {
      const res = await fetch(
        `/api/predictions/general?page=${page}&page_size=${PAGE_SIZE}`
      );
      const data = (await res.json()) as PaginatedResponse<GeneralPrediction>;
      if (!res.ok) throw new Error("Failed to load predictions.");
      setGeneralCount(data.count ?? 0);
      setGeneralItems((prev) =>
        append ? [...prev, ...(data.items ?? [])] : (data.items ?? [])
      );
    } catch {
      setGeneralError("Could not load predictions. Please try again.");
    } finally {
      setGeneralLoading(false);
    }
  }, []);

  // ── Fetch VIP ──────────────────────────────────────────────────────────────
  const fetchVIP = useCallback(async (page: number, append = false) => {
    setVipLoading(true);
    setVipError("");
    try {
      const res = await fetch(
        `/api/predictions/vip?page=${page}&page_size=${PAGE_SIZE}`
      );
      const data = (await res.json()) as PaginatedResponse<VIPPrediction>;
      if (res.status === 401) {
        // session expired or token invalid
        setVipError("Session expired. Please sign in again.");
        return;
      }
      if (!res.ok) throw new Error("Failed to load VIP predictions.");
      setVipCount(data.count ?? 0);
      setVipItems((prev) =>
        append ? [...prev, ...(data.items ?? [])] : (data.items ?? [])
      );
    } catch {
      setVipError("Could not load VIP predictions. Please try again.");
    } finally {
      setVipLoading(false);
    }
  }, []);

  // Load general on mount
  useEffect(() => {
    fetchGeneral(1);
  }, [fetchGeneral]);

  // Load VIP when tab switches to vip and user is logged in
  useEffect(() => {
    if (activeTab === "vip" && session?.user && vipItems.length === 0) {
      fetchVIP(1);
    }
  }, [activeTab, session, fetchVIP, vipItems.length]);

  function handleLoadMoreGeneral() {
    const next = generalPage + 1;
    setGeneralPage(next);
    fetchGeneral(next, true);
  }

  function handleLoadMoreVIP() {
    const next = vipPage + 1;
    setVipPage(next);
    fetchVIP(next, true);
  }

  const isLoggedIn = authStatus === "authenticated" && !!session?.user;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4">
      <div className="flex flex-col lg:flex-row gap-4">

        {/* ── Main Feed ── */}
        <div className="flex-1 min-w-0 order-2 lg:order-1">

          {/* Tab bar */}
          <div className="flex gap-2 mb-4 bg-base-100 border border-base-300 rounded-xl p-1.5">
            <button
              onClick={() => setActiveTab("general")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "general"
                  ? "bg-primary text-primary-content shadow-sm"
                  : "text-base-content/60 hover:text-base-content hover:bg-base-200"
              }`}
            >
              <Trophy size={15} />
              General
              {generalCount > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeTab === "general"
                      ? "bg-primary-content/20 text-primary-content"
                      : "bg-base-300 text-base-content/60"
                  }`}
                >
                  {generalCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("vip")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "vip"
                  ? "bg-primary text-primary-content shadow-sm"
                  : "text-base-content/60 hover:text-base-content hover:bg-base-200"
              }`}
            >
              <Crown size={15} />
              VIP
              {!isLoggedIn && <Lock size={12} className="opacity-60" />}
              {isLoggedIn && vipCount > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeTab === "vip"
                      ? "bg-primary-content/20 text-primary-content"
                      : "bg-base-300 text-base-content/60"
                  }`}
                >
                  {vipCount}
                </span>
              )}
            </button>
          </div>

          {/* ── General Tab ── */}
          {activeTab === "general" && (
            <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-content">
                <Trophy size={15} />
                <span className="font-bold text-sm">General Predictions</span>
                {generalCount > 0 && (
                  <span className="text-primary-content/70 text-xs ml-auto">
                    {generalCount} tips
                  </span>
                )}
              </div>

              {generalLoading && generalItems.length === 0 && (
                <SkeletonRows count={8} />
              )}

              {generalError && (
                <div className="p-6 text-center">
                  <p className="text-sm text-error mb-3">{generalError}</p>
                  <button
                    onClick={() => fetchGeneral(1)}
                    className="btn btn-sm btn-outline btn-primary"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!generalLoading && !generalError && generalItems.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-3xl mb-2">⚽</p>
                  <p className="font-semibold text-sm">No predictions available yet</p>
                  <p className="text-xs text-base-content/50 mt-1">Check back later</p>
                </div>
              )}

              {generalItems.map((p) => (
                <GeneralPredictionCard key={p.game_id} prediction={p} />
              ))}

              {/* Load more */}
              {generalItems.length < generalCount && (
                <div className="p-3 border-t border-base-300 text-center">
                  <button
                    onClick={handleLoadMoreGeneral}
                    disabled={generalLoading}
                    className="btn btn-sm btn-outline btn-primary gap-2"
                  >
                    {generalLoading ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                    Load more
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── VIP Tab ── */}
          {activeTab === "vip" && (
            <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-blue-700 text-primary-content">
                <Crown size={15} />
                <span className="font-bold text-sm">VIP Predictions</span>
                {isLoggedIn && vipCount > 0 && (
                  <span className="text-primary-content/70 text-xs ml-auto">
                    {vipCount} tips
                  </span>
                )}
              </div>

              {/* Not logged in */}
              {!isLoggedIn && authStatus !== "loading" && <VIPLockScreen />}

              {/* Loading session */}
              {authStatus === "loading" && <SkeletonRows count={4} />}

              {/* Logged in */}
              {isLoggedIn && (
                <>
                  {vipLoading && vipItems.length === 0 && <SkeletonRows count={4} />}

                  {vipError && (
                    <div className="p-6 text-center">
                      <p className="text-sm text-error mb-3">{vipError}</p>
                      <button
                        onClick={() => fetchVIP(1)}
                        className="btn btn-sm btn-outline btn-primary"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {!vipLoading && !vipError && vipItems.length === 0 && (
                    <div className="py-12 text-center">
                      <p className="text-3xl mb-2">👑</p>
                      <p className="font-semibold text-sm">No VIP predictions yet</p>
                      <p className="text-xs text-base-content/50 mt-1">Check back later</p>
                    </div>
                  )}

                  <div className="p-3">
                    {vipItems.map((p) => (
                      <VIPPredictionCard key={p.match_id} prediction={p} />
                    ))}
                  </div>

                  {/* Load more */}
                  {vipItems.length < vipCount && (
                    <div className="p-3 border-t border-base-300 text-center">
                      <button
                        onClick={handleLoadMoreVIP}
                        disabled={vipLoading}
                        className="btn btn-sm btn-outline btn-primary gap-2"
                      >
                        {vipLoading ? (
                          <span className="loading loading-spinner loading-xs" />
                        ) : (
                          <ChevronDown size={14} />
                        )}
                        Load more
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 order-1 lg:order-2 space-y-4">
          <PredictionOfTheDay />

          <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
            <div className="bg-primary text-primary-content px-4 py-2.5 font-bold text-sm">
              ⭐ Top Betting Sites
            </div>
            <div className="p-3 space-y-2">
              {BETTING_SITES.slice(0, 5).map((site) => (
                <BettingSiteWidget key={site.id} site={site} variant="compact" />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
