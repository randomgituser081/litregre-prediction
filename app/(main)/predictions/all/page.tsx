"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Trophy,
  Crown,
  History,
  Lock,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import GeneralPredictionCard, {
  type GeneralPrediction,
} from "@/components/predictions/GeneralPredictionCard";
import VIPPredictionCard, {
  type VIPPrediction,
} from "@/components/predictions/VIPPredictionCard";
import Pagination from "@/components/ui/Pagination";
import SearchBar from "@/components/ui/SearchBar";
import { apiFetch } from "@/lib/apiFetch";

type Tab = "today" | "vip" | "past";

interface PaginatedResponse<T> {
  items: T[];
  count: number;
}

const PAGE_SIZE = 10;

const TAB_CONFIG: Record<
  Tab,
  {
    label: string;
    shortLabel: string;
    icon: typeof Trophy;
    subtitle: string;
    requiresAuth: boolean;
  }
> = {
  today: {
    label: "Today's Tips",
    shortLabel: "Today",
    icon: Calendar,
    subtitle: "Predictions for matches happening today",
    requiresAuth: true,
  },
  vip: {
    label: "VIP",
    shortLabel: "VIP",
    icon: Crown,
    subtitle: "Premium picks with logos, odds and confidence",
    requiresAuth: true,
  },
  past: {
    label: "Past Results",
    shortLabel: "Past",
    icon: History,
    subtitle: "How our previous predictions performed",
    requiresAuth: false,
  },
};

// ── Skeletons ──────────────────────────────────────────────────────────────────

function SkeletonRows({ count = 6 }: { count?: number }) {
  return (
    <div className="divide-y divide-base-300">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-3 animate-pulse">
          <div className="w-12 h-3 bg-base-300 rounded" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 bg-base-300 rounded w-2/3" />
            <div className="h-3 bg-base-300 rounded w-1/2" />
          </div>
          <div className="w-14 h-5 bg-base-300 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function SkeletonCards({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3 p-3">
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
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Auth lock ──────────────────────────────────────────────────────────────────

function AuthLock({ tab }: { tab: Tab }) {
  const cfg = TAB_CONFIG[tab];
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Lock size={28} className="text-primary" />
      </div>
      <h3 className="font-bold text-lg mb-2">{cfg.label}</h3>
      <p className="text-sm text-base-content/60 max-w-sm mb-6">
        {cfg.subtitle}. Sign in to unlock.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={`/login?callbackUrl=${encodeURIComponent("/predictions/all")}`}
          className="btn btn-primary"
        >
          Sign In
        </Link>
        <Link href="/signup?invite=1" className="btn btn-outline btn-primary">
          Create Account
        </Link>
      </div>
    </div>
  );
}

// ── Stat tile (hero) ───────────────────────────────────────────────────────────

function StatTile({
  label,
  value,
  icon: Icon,
  loading,
  locked,
  highlight,
}: {
  label: string;
  value: string | number;
  icon: typeof Trophy;
  loading?: boolean;
  locked?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl px-3.5 py-3 border backdrop-blur-sm transition-all ${
        highlight
          ? "bg-amber-300/15 border-amber-200/30"
          : "bg-white/10 border-white/15 hover:bg-white/15"
      }`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <Icon size={13} className="text-white/70" />
        <p className="text-[10px] uppercase tracking-wide text-white/70 font-medium">
          {label}
        </p>
      </div>
      {loading ? (
        <div className="h-6 w-12 bg-white/15 rounded animate-pulse" />
      ) : locked ? (
        <div className="flex items-center gap-1.5">
          <Lock size={14} className="text-white/50" />
          <span className="text-sm text-white/70">Sign in</span>
        </div>
      ) : (
        <p className="text-2xl font-bold leading-none">{value}</p>
      )}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

function isValidTab(value: string | null): value is Tab {
  return value === "today" || value === "vip" || value === "past";
}

function AllPredictionsFallback() {
  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 animate-pulse">
      <div className="h-44 bg-base-300 rounded-2xl mb-6" />
      <div className="h-12 bg-base-300 rounded-xl mb-4" />
      <div className="h-96 bg-base-300 rounded-xl" />
    </div>
  );
}

function AllPredictionsContent() {
  const { data: session, status: authStatus } = useSession();
  const isLoggedIn = authStatus === "authenticated" && !!session?.user;

  const searchParams = useSearchParams();
  const initialTab: Tab = isValidTab(searchParams.get("tab"))
    ? (searchParams.get("tab") as Tab)
    : "today";

  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  // Today
  const [todayItems, setTodayItems] = useState<GeneralPrediction[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [todayPage, setTodayPage] = useState(1);
  const [todayLoading, setTodayLoading] = useState(false);
  const [todayLoaded, setTodayLoaded] = useState(false);
  const [todayError, setTodayError] = useState("");
  const [todaySearch, setTodaySearch] = useState("");

  // VIP
  const [vipItems, setVipItems] = useState<VIPPrediction[]>([]);
  const [vipCount, setVipCount] = useState(0);
  const [vipPage, setVipPage] = useState(1);
  const [vipLoading, setVipLoading] = useState(false);
  const [vipLoaded, setVipLoaded] = useState(false);
  const [vipError, setVipError] = useState("");
  const [vipSearch, setVipSearch] = useState("");

  // Past
  const [pastItems, setPastItems] = useState<GeneralPrediction[]>([]);
  const [pastCount, setPastCount] = useState(0);
  const [pastPage, setPastPage] = useState(1);
  const [pastLoading, setPastLoading] = useState(false);
  const [pastLoaded, setPastLoaded] = useState(false);
  const [pastError, setPastError] = useState("");
  const [pastSearch, setPastSearch] = useState("");

  const totalPages = (count: number) => Math.ceil(count / PAGE_SIZE) || 1;

  const fetchToday = useCallback(async (page: number, search: string) => {
    setTodayLoading(true);
    setTodayError("");
    try {
      const qs = new URLSearchParams({ page: String(page), page_size: String(PAGE_SIZE) });
      if (search) qs.set("search", search);
      const res = await apiFetch(`/api/predictions/today?${qs.toString()}`);
      if (res.status === 401) {
        setTodayError("Session expired. Please sign in again.");
        return;
      }
      const data = (await res.json()) as PaginatedResponse<GeneralPrediction>;
      if (!res.ok) throw new Error();
      setTodayCount(data.count ?? 0);
      setTodayItems(data.items ?? []);
      setTodayLoaded(true);
    } catch {
      setTodayError("Could not load today's tips.");
    } finally {
      setTodayLoading(false);
    }
  }, []);

  const fetchVIP = useCallback(async (page: number, search: string) => {
    setVipLoading(true);
    setVipError("");
    try {
      const qs = new URLSearchParams({ page: String(page), page_size: String(PAGE_SIZE) });
      if (search) qs.set("search", search);
      const res = await apiFetch(`/api/predictions/vip?${qs.toString()}`);
      if (res.status === 401) {
        setVipError("Session expired. Please sign in again.");
        return;
      }
      const data = (await res.json()) as PaginatedResponse<VIPPrediction>;
      if (!res.ok) throw new Error();
      setVipCount(data.count ?? 0);
      setVipItems(data.items ?? []);
      setVipLoaded(true);
    } catch {
      setVipError("Could not load VIP predictions.");
    } finally {
      setVipLoading(false);
    }
  }, []);

  const fetchPast = useCallback(async (page: number, search: string) => {
    setPastLoading(true);
    setPastError("");
    try {
      const qs = new URLSearchParams({ page: String(page), page_size: String(PAGE_SIZE) });
      if (search) qs.set("search", search);
      const res = await apiFetch(`/api/predictions/general?${qs.toString()}`);
      const data = (await res.json()) as PaginatedResponse<GeneralPrediction>;
      if (!res.ok) throw new Error();
      setPastCount(data.count ?? 0);
      setPastItems(data.items ?? []);
      setPastLoaded(true);
    } catch {
      setPastError("Could not load past predictions.");
    } finally {
      setPastLoading(false);
    }
  }, []);

  // ── Initial load: kick off all three at once ───────────────────────────────
  const didInitialLoad = useRef(false);
  useEffect(() => {
    if (didInitialLoad.current) return;
    if (authStatus === "loading") return;
    didInitialLoad.current = true;
    fetchPast(1, "");
    if (isLoggedIn) {
      fetchToday(1, "");
      fetchVIP(1, "");
    }
  }, [authStatus, isLoggedIn, fetchToday, fetchVIP, fetchPast]);

  // ── Refetch on search changes (skip initial empty search) ──────────────────
  const todaySearchInit = useRef(true);
  useEffect(() => {
    if (todaySearchInit.current) {
      todaySearchInit.current = false;
      return;
    }
    if (!isLoggedIn) return;
    setTodayPage(1);
    fetchToday(1, todaySearch);
  }, [todaySearch, isLoggedIn, fetchToday]);

  const vipSearchInit = useRef(true);
  useEffect(() => {
    if (vipSearchInit.current) {
      vipSearchInit.current = false;
      return;
    }
    if (!isLoggedIn) return;
    setVipPage(1);
    fetchVIP(1, vipSearch);
  }, [vipSearch, isLoggedIn, fetchVIP]);

  const pastSearchInit = useRef(true);
  useEffect(() => {
    if (pastSearchInit.current) {
      pastSearchInit.current = false;
      return;
    }
    setPastPage(1);
    fetchPast(1, pastSearch);
  }, [pastSearch, fetchPast]);

  // ── Lazy-load locked tabs when user logs in mid-session ────────────────────
  useEffect(() => {
    if (!isLoggedIn) return;
    if (!todayLoaded) fetchToday(1, "");
    if (!vipLoaded) fetchVIP(1, "");
  }, [isLoggedIn, todayLoaded, vipLoaded, fetchToday, fetchVIP]);

  function handlePageChange(tab: Tab, page: number) {
    if (tab === "today") {
      setTodayPage(page);
      fetchToday(page, todaySearch);
    } else if (tab === "vip") {
      setVipPage(page);
      fetchVIP(page, vipSearch);
    } else {
      setPastPage(page);
      fetchPast(page, pastSearch);
    }
    window.scrollTo({ top: 200, behavior: "smooth" });
  }

  // Win rate calc (from current past page)
  const finishedItems = pastItems.filter((p) => p.is_finished);
  const wonItems = finishedItems.filter((p) => p.is_prediction_correct === true);
  const winRate =
    finishedItems.length > 0
      ? Math.round((wonItems.length / finishedItems.length) * 100)
      : null;

  // Whether to show the in-tab badge count
  function tabCount(t: Tab) {
    if (t === "today") return isLoggedIn ? todayCount : null;
    if (t === "vip") return isLoggedIn ? vipCount : null;
    return pastCount;
  }

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl p-6 sm:p-7 mb-6 text-white shadow-lg">
        {/* gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-blue-700" />
        {/* soft blobs */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-amber-300/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 flex-shrink-0">
              <TrendingUp size={22} />
            </div>
            <div className="flex-1">
              <h1 className="font-bold text-2xl sm:text-3xl leading-tight">
                All Predictions
              </h1>
              <p className="text-white/85 text-sm mt-1 max-w-xl">
                Today&apos;s tips, VIP picks and past results — all in one place.
              </p>
            </div>
            {winRate !== null && (
              <div className="hidden sm:flex flex-col items-end gap-1 flex-shrink-0">
                <div className="flex items-center gap-1.5 bg-emerald-400/20 border border-emerald-200/30 rounded-full px-3 py-1">
                  <CheckCircle2 size={13} className="text-emerald-200" />
                  <span className="text-xs font-bold text-emerald-100">
                    {winRate}% win rate
                  </span>
                </div>
                <p className="text-[10px] text-white/60">
                  {wonItems.length}/{finishedItems.length} on this page
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5">
            <StatTile
              label="Today"
              icon={Calendar}
              value={todayCount}
              loading={!todayLoaded && isLoggedIn && todayLoading}
              locked={!isLoggedIn}
            />
            <StatTile
              label="VIP"
              icon={Crown}
              value={vipCount}
              loading={!vipLoaded && isLoggedIn && vipLoading}
              locked={!isLoggedIn}
              highlight
            />
            <StatTile
              label="Past"
              icon={History}
              value={pastCount}
              loading={!pastLoaded && pastLoading}
            />
          </div>
        </div>
      </div>

      {/* ── Tab bar ────────────────────────────────────────────────────────── */}
      <div className="flex gap-1.5 mb-5 bg-base-100 border border-base-300 rounded-xl p-1.5 shadow-sm overflow-x-auto">
        {(Object.keys(TAB_CONFIG) as Tab[]).map((t) => {
          const cfg = TAB_CONFIG[t];
          const Icon = cfg.icon;
          const isLocked = cfg.requiresAuth && !isLoggedIn;
          const active = activeTab === t;
          const count = tabCount(t);
          return (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 min-w-[110px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                active
                  ? "bg-primary text-primary-content shadow-md scale-[1.01]"
                  : "text-base-content/65 hover:text-base-content hover:bg-base-200"
              }`}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{cfg.label}</span>
              <span className="sm:hidden">{cfg.shortLabel}</span>
              {isLocked ? (
                <Lock size={11} className="opacity-60" />
              ) : count !== null && count > 0 ? (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    active
                      ? "bg-primary-content/20 text-primary-content"
                      : "bg-base-300 text-base-content/60"
                  }`}
                >
                  {count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* ── Today Tab ─────────────────────────────────────────────────────── */}
      {activeTab === "today" && (
        <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-primary to-blue-700 text-primary-content">
            <Calendar size={16} />
            <span className="font-bold text-sm">Today&apos;s Tips</span>
            {isLoggedIn && todayCount > 0 && (
              <span className="ml-auto bg-white/15 rounded-full px-2 py-0.5 text-[10px] font-bold">
                {todayCount} tips
              </span>
            )}
          </div>

          {!isLoggedIn && authStatus !== "loading" && <AuthLock tab="today" />}
          {authStatus === "loading" && <SkeletonRows count={6} />}

          {isLoggedIn && (
            <>
              <div className="p-3 border-b border-base-300 bg-base-200/40">
                <SearchBar
                  placeholder="Search today's tips by team or competition…"
                  onSearch={setTodaySearch}
                />
              </div>

              {todayLoading && <SkeletonRows count={6} />}
              {todayError && (
                <div className="p-6 text-center">
                  <p className="text-sm text-error mb-3">{todayError}</p>
                  <button
                    onClick={() => fetchToday(todayPage, todaySearch)}
                    className="btn btn-sm btn-outline btn-primary"
                  >
                    Retry
                  </button>
                </div>
              )}
              {!todayLoading && !todayError && todayItems.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-3xl mb-2">{todaySearch ? "🔍" : "⚽"}</p>
                  <p className="font-semibold text-sm">
                    {todaySearch
                      ? `No matches for "${todaySearch}"`
                      : "No tips for today yet"}
                  </p>
                </div>
              )}
              {!todayLoading &&
                todayItems.map((p) => (
                  <GeneralPredictionCard key={p.game_id} prediction={p} />
                ))}
              {!todayError && todayItems.length > 0 && (
                <div className="border-t border-base-300">
                  <Pagination
                    currentPage={todayPage}
                    totalPages={totalPages(todayCount)}
                    onPageChange={(p) => handlePageChange("today", p)}
                    loading={todayLoading}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── VIP Tab ───────────────────────────────────────────────────────── */}
      {activeTab === "vip" && (
        <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-primary via-blue-600 to-blue-700 text-primary-content">
            <Crown size={16} />
            <span className="font-bold text-sm">VIP Predictions</span>
            <Sparkles size={13} className="text-amber-300" />
            {isLoggedIn && vipCount > 0 && (
              <span className="ml-auto bg-white/15 rounded-full px-2 py-0.5 text-[10px] font-bold">
                {vipCount} tips
              </span>
            )}
          </div>

          {!isLoggedIn && authStatus !== "loading" && <AuthLock tab="vip" />}
          {authStatus === "loading" && <SkeletonCards count={4} />}

          {isLoggedIn && (
            <>
              <div className="p-3 border-b border-base-300 bg-base-200/40">
                <SearchBar
                  placeholder="Search VIP picks by team or league…"
                  onSearch={setVipSearch}
                />
              </div>

              {vipLoading && <SkeletonCards count={4} />}
              {vipError && (
                <div className="p-6 text-center">
                  <p className="text-sm text-error mb-3">{vipError}</p>
                  <button
                    onClick={() => fetchVIP(vipPage, vipSearch)}
                    className="btn btn-sm btn-outline btn-primary"
                  >
                    Retry
                  </button>
                </div>
              )}
              {!vipLoading && !vipError && vipItems.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-3xl mb-2">{vipSearch ? "🔍" : "👑"}</p>
                  <p className="font-semibold text-sm">
                    {vipSearch ? `No matches for "${vipSearch}"` : "No VIP predictions yet"}
                  </p>
                </div>
              )}
              <div className="p-3">
                {!vipLoading &&
                  vipItems.map((p) => (
                    <VIPPredictionCard key={p.match_id} prediction={p} />
                  ))}
              </div>
              {!vipError && vipItems.length > 0 && (
                <div className="border-t border-base-300">
                  <Pagination
                    currentPage={vipPage}
                    totalPages={totalPages(vipCount)}
                    onPageChange={(p) => handlePageChange("vip", p)}
                    loading={vipLoading}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Past Tab ──────────────────────────────────────────────────────── */}
      {activeTab === "past" && (
        <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 px-4 py-3 bg-base-200 border-b border-base-300">
            <History size={16} className="text-base-content/70" />
            <span className="font-bold text-sm">Past Results</span>
            {winRate !== null && (
              <span
                className={`badge badge-sm font-bold ml-auto ${
                  winRate >= 60
                    ? "badge-success"
                    : winRate >= 45
                      ? "badge-warning"
                      : "badge-error"
                }`}
              >
                {winRate}% win rate ({wonItems.length}/{finishedItems.length})
              </span>
            )}
          </div>

          <div className="p-3 border-b border-base-300 bg-base-200/40">
            <SearchBar
              placeholder="Search past results by team or competition…"
              onSearch={setPastSearch}
            />
          </div>

          {pastLoading && <SkeletonRows count={8} />}

          {pastError && (
            <div className="p-6 text-center">
              <p className="text-sm text-error mb-3">{pastError}</p>
              <button
                onClick={() => fetchPast(pastPage, pastSearch)}
                className="btn btn-sm btn-outline btn-primary"
              >
                Retry
              </button>
            </div>
          )}

          {!pastLoading && !pastError && pastItems.length === 0 && (
            <div className="py-12 text-center">
              {pastSearch ? (
                <p className="text-3xl mb-2">🔍</p>
              ) : (
                <Trophy size={32} className="text-base-content/20 mx-auto mb-2" />
              )}
              <p className="font-semibold text-sm">
                {pastSearch ? `No matches for "${pastSearch}"` : "No past predictions"}
              </p>
            </div>
          )}

          {!pastLoading &&
            pastItems.map((p) => (
              <GeneralPredictionCard key={p.game_id} prediction={p} />
            ))}

          {!pastError && pastItems.length > 0 && (
            <div className="border-t border-base-300">
              <Pagination
                currentPage={pastPage}
                totalPages={totalPages(pastCount)}
                onPageChange={(p) => handlePageChange("past", p)}
                loading={pastLoading}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AllPredictionsPage() {
  return (
    <Suspense fallback={<AllPredictionsFallback />}>
      <AllPredictionsContent />
    </Suspense>
  );
}
