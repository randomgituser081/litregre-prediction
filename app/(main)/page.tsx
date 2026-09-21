"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Trophy, Lock, Crown, Zap } from "lucide-react";
import PredictionOfTheDay from "@/components/home/PredictionOfTheDay";
import PastPredictionsList from "@/components/home/PastPredictionsList";
import HeroSwiper from "@/components/home/HeroSwiper";
import StatsCounter from "@/components/home/StatsCounter";
import UssdBanner from "@/components/home/UssdBanner";
import HomeDisclaimer from "@/components/home/HomeDisclaimer";
import HomeFaq from "@/components/home/HomeFaq";
import GeneralPredictionCard from "@/components/predictions/GeneralPredictionCard";
import VIPPredictionCard from "@/components/predictions/VIPPredictionCard";
import SpecialPredictionCard from "@/components/predictions/SpecialPredictionCard";
import Pagination from "@/components/ui/Pagination";
import SearchBar from "@/components/ui/SearchBar";
import {
  useTodayPredictions,
  useVIPPredictions,
  useSpecialPredictions,
} from "@/hooks/usePredictions";
import {
  matchesTimeFilter,
  parsePredictionKickoff,
  type TimeFilter,
} from "@/lib/predictionKickoff";

type Tab = "general" | "special" | "vip";
type SpecialMarket =
  | "1x2"
  | "btts"
  | "over_15"
  | "over_25"
  | "halftime"
  | "handicap"
  | "basketball"
  | "basketball_over"
  | "tennis";

const PAGE_SIZE = 10;

const SPECIAL_MARKETS: { id: SpecialMarket; label: string }[] = [
  { id: "1x2", label: "1X2" },
  { id: "btts", label: "BTTS" },
  { id: "over_15", label: "Over 1.5" },
  { id: "over_25", label: "Over 2.5" },
  { id: "halftime", label: "Halftime" },
  { id: "handicap", label: "Handicap" },
  { id: "basketball", label: "Basketball" },
  { id: "basketball_over", label: "BB O/U" },
  { id: "tennis", label: "Tennis" },
];

const OTHER_SPORT_MARKETS = new Set<SpecialMarket>(["basketball", "tennis"]);

const TIME_FILTERS: { id: TimeFilter; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "early_today", label: "Early today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "past", label: "Past" },
  { id: "all", label: "All" },
];

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

function AuthLockScreen({
  title,
  message,
  callbackUrl,
}: {
  title: string;
  message: string;
  callbackUrl?: string;
}) {
  const loginHref = callbackUrl
    ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/login";
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Lock size={28} className="text-primary" />
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-base-content/60 max-w-sm mb-6">{message}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href={loginHref} className="btn btn-primary">
          Sign In
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
  const [todayPage, setTodayPage] = useState(1);
  const [todaySearch, setTodaySearch] = useState("");
  const [vipPage, setVipPage] = useState(1);
  const [vipSearch, setVipSearch] = useState("");
  const [specialMarket, setSpecialMarket] = useState<SpecialMarket>("over_25");
  const [specialPage, setSpecialPage] = useState(1);
  const [specialSearch, setSpecialSearch] = useState("");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");

  const isLoggedIn = authStatus === "authenticated" && !!session?.user;

  const specialEndpoint = OTHER_SPORT_MARKETS.has(specialMarket)
    ? "/api/predictions/other-sports"
    : "/api/predictions/special";
  const specialParams = { market_type: specialMarket };

  const {
    data: todayData,
    isLoading: todayLoading,
    isError: todayIsError,
    refetch: refetchToday,
  } = useTodayPredictions(
    todayPage,
    todaySearch,
    isLoggedIn && activeTab === "general"
  );

  const {
    data: vipData,
    isLoading: vipLoading,
    isError: vipIsError,
    refetch: refetchVip,
  } = useVIPPredictions(vipPage, vipSearch, isLoggedIn && activeTab === "vip");

  const {
    data: specialData,
    isLoading: specialLoading,
    isError: specialIsError,
    error: specialError,
    refetch: refetchSpecial,
  } = useSpecialPredictions(
    specialEndpoint,
    specialParams,
    specialPage,
    specialSearch,
    isLoggedIn && activeTab === "special"
  );

  const todayItems = todayData?.items ?? [];
  const todayCount = todayData?.count ?? 0;
  const todayTotalPages = Math.ceil(todayCount / PAGE_SIZE) || 1;

  const filteredTodayItems = useMemo(() => {
    if (timeFilter === "all") return todayItems;
    return todayItems.filter((item) =>
      matchesTimeFilter(parsePredictionKickoff(item), timeFilter)
    );
  }, [todayItems, timeFilter]);

  const pageFilterCounts = useMemo(() => {
    const counts: Record<TimeFilter, number> = {
      all: todayItems.length,
      upcoming: 0,
      early_today: 0,
      yesterday: 0,
      past: 0,
    };
    for (const item of todayItems) {
      const kickoff = parsePredictionKickoff(item);
      if (matchesTimeFilter(kickoff, "upcoming")) counts.upcoming += 1;
      if (matchesTimeFilter(kickoff, "early_today")) counts.early_today += 1;
      if (matchesTimeFilter(kickoff, "yesterday")) counts.yesterday += 1;
      if (matchesTimeFilter(kickoff, "past")) counts.past += 1;
    }
    return counts;
  }, [todayItems]);

  useEffect(() => {
    if (!isLoggedIn || activeTab !== "general") return;
    if (timeFilter !== "upcoming") return;
    if (todayLoading || todayIsError) return;
    if (todayItems.length === 0) return;
    if (filteredTodayItems.length > 0) return;
    if (todayPage >= todayTotalPages) return;
    setTodayPage((p) => Math.min(p + 1, todayTotalPages));
  }, [
    isLoggedIn,
    activeTab,
    timeFilter,
    todayLoading,
    todayIsError,
    todayItems.length,
    filteredTodayItems.length,
    todayPage,
    todayTotalPages,
  ]);

  const vipItems = vipData?.items ?? [];
  const vipCount = vipData?.count ?? 0;
  const vipTotalPages = Math.ceil(vipCount / PAGE_SIZE) || 1;

  const filteredVipItems = useMemo(() => {
    if (timeFilter === "all") return vipItems;
    return vipItems.filter((item) =>
      matchesTimeFilter(parsePredictionKickoff(item), timeFilter)
    );
  }, [vipItems, timeFilter]);

  const vipFilterCounts = useMemo(() => {
    const counts: Record<TimeFilter, number> = {
      all: vipItems.length,
      upcoming: 0,
      early_today: 0,
      yesterday: 0,
      past: 0,
    };
    for (const item of vipItems) {
      const kickoff = parsePredictionKickoff(item);
      if (matchesTimeFilter(kickoff, "upcoming")) counts.upcoming += 1;
      if (matchesTimeFilter(kickoff, "early_today")) counts.early_today += 1;
      if (matchesTimeFilter(kickoff, "yesterday")) counts.yesterday += 1;
      if (matchesTimeFilter(kickoff, "past")) counts.past += 1;
    }
    return counts;
  }, [vipItems]);

  const specialItems = specialData?.items ?? [];
  const specialPages = specialData?.pages ?? 1;

  const filteredSpecialItems = useMemo(() => {
    if (timeFilter === "all") return specialItems;
    return specialItems.filter((item) =>
      matchesTimeFilter(parsePredictionKickoff(item), timeFilter)
    );
  }, [specialItems, timeFilter]);

  const specialFilterCounts = useMemo(() => {
    const counts: Record<TimeFilter, number> = {
      all: specialItems.length,
      upcoming: 0,
      early_today: 0,
      yesterday: 0,
      past: 0,
    };
    for (const item of specialItems) {
      const kickoff = parsePredictionKickoff(item);
      if (matchesTimeFilter(kickoff, "upcoming")) counts.upcoming += 1;
      if (matchesTimeFilter(kickoff, "early_today")) counts.early_today += 1;
      if (matchesTimeFilter(kickoff, "yesterday")) counts.yesterday += 1;
      if (matchesTimeFilter(kickoff, "past")) counts.past += 1;
    }
    return counts;
  }, [specialItems]);

  // Skip past-only pages for Upcoming on VIP / Special (same as Today)
  useEffect(() => {
    if (!isLoggedIn || activeTab !== "vip") return;
    if (timeFilter !== "upcoming") return;
    if (vipLoading || vipIsError) return;
    if (vipItems.length === 0) return;
    if (filteredVipItems.length > 0) return;
    if (vipPage >= vipTotalPages) return;
    setVipPage((p) => Math.min(p + 1, vipTotalPages));
  }, [
    isLoggedIn,
    activeTab,
    timeFilter,
    vipLoading,
    vipIsError,
    vipItems.length,
    filteredVipItems.length,
    vipPage,
    vipTotalPages,
  ]);

  useEffect(() => {
    if (!isLoggedIn || activeTab !== "special") return;
    if (timeFilter !== "upcoming") return;
    if (specialLoading || specialIsError) return;
    if (specialItems.length === 0) return;
    if (filteredSpecialItems.length > 0) return;
    if (specialPage >= specialPages) return;
    setSpecialPage((p) => Math.min(p + 1, specialPages));
  }, [
    isLoggedIn,
    activeTab,
    timeFilter,
    specialLoading,
    specialIsError,
    specialItems.length,
    filteredSpecialItems.length,
    specialPage,
    specialPages,
  ]);

  const handleTodaySearch = useCallback((q: string) => {
    setTodaySearch((prev) => {
      if (prev === q) return prev;
      setTodayPage(1);
      return q;
    });
  }, []);

  const handleVipSearch = useCallback((q: string) => {
    setVipSearch((prev) => {
      if (prev === q) return prev;
      setVipPage(1);
      return q;
    });
  }, []);

  const handleSpecialSearch = useCallback((q: string) => {
    setSpecialSearch((prev) => {
      if (prev === q) return prev;
      setSpecialPage(1);
      return q;
    });
  }, []);

  const handleTodayPageChange = useCallback((page: number) => {
    setTodayPage(page);
    document
      .getElementById("tips-feed")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleVIPPageChange = useCallback((page: number) => {
    setVipPage(page);
    document
      .getElementById("tips-feed")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleSpecialPageChange = useCallback((page: number) => {
    setSpecialPage(page);
    document
      .getElementById("tips-feed")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleTimeFilter = useCallback((filter: TimeFilter) => {
    setTimeFilter(filter);
    if (filter === "upcoming") {
      setTodayPage(1);
      setSpecialPage(1);
      setVipPage(1);
    }
  }, []);

  const changeSpecialMarket = useCallback((market: SpecialMarket) => {
    setSpecialMarket(market);
    setSpecialPage(1);
    setSpecialSearch("");
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4">
      <HeroSwiper />
      <UssdBanner />
      <HomeDisclaimer />
      <StatsCounter />

      <div className="flex flex-col lg:flex-row gap-4">
        <div id="tips-feed" className="flex-1 min-w-0 order-2 lg:order-1 scroll-mt-20">
          {/* Today | Special | VIP */}
          <div className="flex gap-1 mb-3 bg-base-100 border border-base-300 rounded-xl p-1 shadow-sm overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={`flex-1 min-w-[6.5rem] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === "general"
                  ? "bg-primary text-primary-content shadow-sm"
                  : "text-base-content/60 hover:text-base-content hover:bg-base-200"
              }`}
            >
              <Trophy size={15} />
              Today
              {!isLoggedIn && <Lock size={12} className="opacity-60" />}
              {isLoggedIn && todayCount > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeTab === "general"
                      ? "bg-white/20 text-white"
                      : "bg-base-300 text-base-content/60"
                  }`}
                >
                  {todayCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("special")}
              className={`flex-1 min-w-[6.5rem] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === "special"
                  ? "bg-secondary text-secondary-content shadow-sm"
                  : "text-base-content/60 hover:text-base-content hover:bg-base-200"
              }`}
            >
              <Zap size={15} />
              Special
              {!isLoggedIn && <Lock size={12} className="opacity-60" />}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("vip")}
              className={`flex-1 min-w-[6.5rem] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === "vip"
                  ? "bg-amber-500 text-amber-950 shadow-sm"
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
                      ? "bg-amber-950/15 text-amber-950"
                      : "bg-base-300 text-base-content/60"
                  }`}
                >
                  {vipCount}
                </span>
              )}
            </button>
          </div>

          {/* ── Today ── */}
          {activeTab === "general" && (
            <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden shadow-sm">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-base-300 bg-base-100">
                <div>
                  <h2 className="font-display text-xl font-bold tracking-wide text-base-content leading-none">
                    TODAY&apos;S TIPS
                  </h2>
                  <p className="text-[11px] text-base-content/45 mt-0.5">
                    1X2 picks · status from kickoff time
                  </p>
                </div>
                {isLoggedIn && todayCount > 0 && (
                  <span className="ml-auto text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                    {todayCount} matches
                  </span>
                )}
              </div>

              {!isLoggedIn && authStatus !== "loading" && (
                <AuthLockScreen
                  title="Sign in to see today's tips"
                  message="Today's predictions are available to registered users. Past results are still visible in the Past Predictions panel."
                  callbackUrl="/"
                />
              )}

              {authStatus === "loading" && <SkeletonRows count={6} />}

              {isLoggedIn && (
                <>
                  <div className="px-3 py-2.5 border-b border-base-300 space-y-2.5">
                    <SearchBar
                      placeholder="Search by team…"
                      onSearch={handleTodaySearch}
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {TIME_FILTERS.map((f) => {
                        const count = pageFilterCounts[f.id];
                        const active = timeFilter === f.id;
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => handleTimeFilter(f.id)}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors ${
                              active
                                ? "bg-primary text-primary-content border-primary"
                                : "bg-base-100 text-base-content/55 border-base-300 hover:border-primary/40 hover:text-primary"
                            }`}
                          >
                            {f.label}
                            {f.id !== "all" && (
                              <span className="ml-1 opacity-70">({count})</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {timeFilter === "upcoming" && todayPage > 1 && (
                      <p className="text-[11px] text-base-content/45 px-0.5">
                        Skipped earlier pages of already-played fixtures (API
                        lists oldest first).
                      </p>
                    )}
                  </div>

                  {todayLoading && <SkeletonRows count={6} />}

                  {todayIsError && (
                    <div className="p-6 text-center">
                      <p className="text-sm text-error mb-3">
                        Could not load today&apos;s tips.
                      </p>
                      <button
                        onClick={() => refetchToday()}
                        className="btn btn-sm btn-outline btn-primary"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {!todayLoading && !todayIsError && todayItems.length === 0 && (
                    <div className="py-12 text-center">
                      <p className="font-semibold text-sm">
                        {todaySearch
                          ? `No matches for "${todaySearch}"`
                          : "No tips for today yet"}
                      </p>
                    </div>
                  )}

                  {!todayLoading &&
                    !todayIsError &&
                    todayItems.length > 0 &&
                    filteredTodayItems.length === 0 && (
                      <div className="py-10 text-center px-4">
                        <p className="font-semibold text-sm">
                          No{" "}
                          {TIME_FILTERS.find(
                            (f) => f.id === timeFilter
                          )?.label.toLowerCase()}{" "}
                          tips on this page
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                          {todayPage < todayTotalPages && (
                            <button
                              type="button"
                              onClick={() =>
                                handleTodayPageChange(todayPage + 1)
                              }
                              className="btn btn-sm btn-primary"
                            >
                              Next page
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleTimeFilter("all")}
                            className="btn btn-sm btn-outline"
                          >
                            Show all on page
                          </button>
                        </div>
                      </div>
                    )}

                  {!todayLoading &&
                    filteredTodayItems.map((p) => (
                      <GeneralPredictionCard key={p.game_id} prediction={p} />
                    ))}

                  {!todayIsError && todayItems.length > 0 && (
                    <div className="border-t border-base-300">
                      <Pagination
                        currentPage={todayPage}
                        totalPages={todayTotalPages}
                        onPageChange={handleTodayPageChange}
                        loading={todayLoading}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── Special ── */}
          {activeTab === "special" && (
            <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden shadow-sm">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-base-300">
                <div>
                  <h2 className="font-display text-xl font-bold tracking-wide text-base-content leading-none">
                    DAILY SPECIAL
                  </h2>
                  <p className="text-[11px] text-base-content/45 mt-0.5">
                    Over 1.5, Over 2.5, BTTS and more — right here
                  </p>
                </div>
              </div>

              {!isLoggedIn && authStatus !== "loading" && (
                <AuthLockScreen
                  title="Sign in for Daily Special"
                  message="Special markets (Over 1.5, Over 2.5, BTTS, Halftime and more) are available to registered users."
                  callbackUrl="/"
                />
              )}

              {authStatus === "loading" && <SkeletonRows count={5} />}

              {isLoggedIn && (
                <>
                  <div className="px-3 py-2.5 border-b border-base-300 space-y-2.5">
                    <div className="flex flex-wrap gap-1.5">
                      {SPECIAL_MARKETS.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => changeSpecialMarket(m.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                            specialMarket === m.id
                              ? "bg-secondary text-secondary-content border-secondary"
                              : "bg-base-100 text-base-content/60 border-base-300 hover:border-secondary/50 hover:text-secondary"
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                    <SearchBar
                      placeholder="Search special by team or league…"
                      onSearch={handleSpecialSearch}
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {TIME_FILTERS.map((f) => {
                        const count = specialFilterCounts[f.id];
                        const active = timeFilter === f.id;
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => handleTimeFilter(f.id)}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors ${
                              active
                                ? "bg-secondary text-secondary-content border-secondary"
                                : "bg-base-100 text-base-content/55 border-base-300 hover:border-secondary/40"
                            }`}
                          >
                            {f.label}
                            {f.id !== "all" && (
                              <span className="ml-1 opacity-70">({count})</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {timeFilter === "upcoming" && specialPage > 1 && (
                      <p className="text-[11px] text-base-content/45 px-0.5">
                        Skipped earlier pages of already-played fixtures.
                      </p>
                    )}
                  </div>

                  {specialLoading && <SkeletonRows count={5} />}

                  {specialIsError && (
                    <div className="p-6 text-center">
                      <p className="text-sm text-error mb-2 font-semibold">
                        Could not load special predictions.
                      </p>
                      {specialError instanceof Error && specialError.message && (
                        <p className="text-xs text-base-content/55 max-w-md mx-auto mb-3">
                          {specialError.message}
                        </p>
                      )}
                      {specialMarket === "handicap" && (
                        <p className="text-xs text-base-content/50 max-w-md mx-auto mb-3">
                          Handicap is not live on the prediction API yet. Try 1X2, BTTS,
                          Over 2.5, or Halftime in the meantime.
                        </p>
                      )}
                      <button
                        onClick={() => refetchSpecial()}
                        className="btn btn-sm btn-outline btn-primary"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {!specialLoading &&
                    !specialIsError &&
                    specialItems.length === 0 && (
                      <div className="py-12 text-center">
                        <p className="font-semibold text-sm">
                          {specialSearch
                            ? `No matches for "${specialSearch}"`
                            : "No picks in this market yet"}
                        </p>
                      </div>
                    )}

                  {!specialLoading &&
                    !specialIsError &&
                    specialItems.length > 0 &&
                    filteredSpecialItems.length === 0 && (
                      <div className="py-10 text-center px-4">
                        <p className="font-semibold text-sm">
                          No{" "}
                          {TIME_FILTERS.find(
                            (f) => f.id === timeFilter
                          )?.label.toLowerCase()}{" "}
                          tips in this list
                        </p>
                        <button
                          type="button"
                          onClick={() => handleTimeFilter("all")}
                          className="btn btn-sm btn-outline mt-4"
                        >
                          Show all
                        </button>
                      </div>
                    )}

                  <div className="p-3 space-y-0">
                    {!specialLoading &&
                      filteredSpecialItems.map((item, idx) => (
                        <SpecialPredictionCard
                          key={
                            (item.match_id as string) ||
                            (item.game_id as string) ||
                            idx
                          }
                          prediction={{
                            ...item,
                            market_type:
                              (item.market_type as string | undefined) ||
                              specialMarket,
                          }}
                        />
                      ))}
                  </div>

                  {!specialIsError && specialItems.length > 0 && (
                    <div className="border-t border-base-300">
                      <Pagination
                        currentPage={specialPage}
                        totalPages={specialPages}
                        onPageChange={handleSpecialPageChange}
                        loading={specialLoading}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── VIP ── */}
          {activeTab === "vip" && (
            <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden shadow-sm">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-base-300">
                <div>
                  <h2 className="font-display text-xl font-bold tracking-wide text-base-content leading-none">
                    VIP PREDICTIONS
                  </h2>
                  <p className="text-[11px] text-base-content/45 mt-0.5">
                    Higher-confidence picks with odds
                  </p>
                </div>
                {isLoggedIn && vipCount > 0 && (
                  <span className="ml-auto text-[11px] font-bold text-amber-700 bg-amber-500/15 px-2.5 py-1 rounded-full">
                    {vipCount} picks
                  </span>
                )}
              </div>

              {!isLoggedIn && authStatus !== "loading" && (
                <AuthLockScreen
                  title="VIP Predictions"
                  message="VIP predictions include team logos, competition details, accurate odds and higher-confidence tips. Sign in to unlock access."
                  callbackUrl="/"
                />
              )}

              {authStatus === "loading" && <SkeletonRows count={4} />}

              {isLoggedIn && (
                <>
                  <div className="px-3 py-2.5 border-b border-base-300 space-y-2.5">
                    <SearchBar
                      placeholder="Search VIP by team or league…"
                      onSearch={handleVipSearch}
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {TIME_FILTERS.map((f) => {
                        const count = vipFilterCounts[f.id];
                        const active = timeFilter === f.id;
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => handleTimeFilter(f.id)}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors ${
                              active
                                ? "bg-amber-500 text-amber-950 border-amber-500"
                                : "bg-base-100 text-base-content/55 border-base-300 hover:border-amber-400/50"
                            }`}
                          >
                            {f.label}
                            {f.id !== "all" && (
                              <span className="ml-1 opacity-70">({count})</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {timeFilter === "upcoming" && vipPage > 1 && (
                      <p className="text-[11px] text-base-content/45 px-0.5">
                        Skipped earlier pages of already-played fixtures.
                      </p>
                    )}
                  </div>

                  {vipLoading && <SkeletonRows count={4} />}

                  {vipIsError && (
                    <div className="p-6 text-center">
                      <p className="text-sm text-error mb-3">
                        Could not load VIP predictions.
                      </p>
                      <button
                        onClick={() => refetchVip()}
                        className="btn btn-sm btn-outline btn-primary"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {!vipLoading && !vipIsError && vipItems.length === 0 && (
                    <div className="py-12 text-center">
                      <p className="font-semibold text-sm">
                        {vipSearch
                          ? `No matches for "${vipSearch}"`
                          : "No VIP predictions yet"}
                      </p>
                    </div>
                  )}

                  {!vipLoading &&
                    !vipIsError &&
                    vipItems.length > 0 &&
                    filteredVipItems.length === 0 && (
                      <div className="py-10 text-center px-4">
                        <p className="font-semibold text-sm">
                          No{" "}
                          {TIME_FILTERS.find(
                            (f) => f.id === timeFilter
                          )?.label.toLowerCase()}{" "}
                          VIP tips on this page
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                          {vipPage < vipTotalPages && (
                            <button
                              type="button"
                              onClick={() => handleVIPPageChange(vipPage + 1)}
                              className="btn btn-sm btn-primary"
                            >
                              Next page
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleTimeFilter("all")}
                            className="btn btn-sm btn-outline"
                          >
                            Show all on page
                          </button>
                        </div>
                      </div>
                    )}

                  <div className="p-3">
                    {!vipLoading &&
                      filteredVipItems.map((p) => (
                        <VIPPredictionCard key={p.match_id} prediction={p} />
                      ))}
                  </div>

                  {!vipIsError && vipItems.length > 0 && (
                    <div className="border-t border-base-300">
                      <Pagination
                        currentPage={vipPage}
                        totalPages={vipTotalPages}
                        onPageChange={handleVIPPageChange}
                        loading={vipLoading}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 order-1 lg:order-2 space-y-4">
          <PredictionOfTheDay />
          <PastPredictionsList limit={6} />
        </aside>
      </div>

      <HomeFaq />
    </div>
  );
}
