"use client";

import { Suspense, useState, useCallback, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Zap,
  Target,
  Square,
  Dumbbell,
  Lock,
  Search,
  X,
} from "lucide-react";
import SpecialPredictionCard from "@/components/predictions/SpecialPredictionCard";
import Pagination from "@/components/ui/Pagination";
import { useSpecialPredictions } from "@/hooks/usePredictions";
import {
  matchesTimeFilter,
  parsePredictionKickoff,
  type TimeFilter,
} from "@/lib/predictionKickoff";

type MainTab = "special" | "goal-scorers" | "cards-corners" | "other-sports";
type DailySpecialSub =
  | "1x2"
  | "btts"
  | "over_15"
  | "over_25"
  | "halftime"
  | "handicap"
  | "basketball"
  | "basketball_over"
  | "tennis";
type CardsSubTab = "card" | "corner";
type OtherSportsSubTab = "mma";

const TIME_FILTERS: { id: TimeFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "upcoming", label: "Upcoming" },
  { id: "early_today", label: "Early today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "past", label: "Past" },
];

const MAIN_TABS: { id: MainTab; label: string; icon: React.ReactNode }[] = [
  { id: "special", label: "Daily Special", icon: <Zap size={15} /> },
  { id: "goal-scorers", label: "Goal Scorers", icon: <Target size={15} /> },
  { id: "cards-corners", label: "Cards & Corners", icon: <Square size={15} /> },
  { id: "other-sports", label: "Other Sports", icon: <Dumbbell size={15} /> },
];

const DAILY_SPECIAL_SUB_TABS: {
  id: DailySpecialSub;
  label: string;
  hint: string;
}[] = [
  { id: "1x2", label: "1X2", hint: "Match result" },
  { id: "btts", label: "BTTS", hint: "Both teams score" },
  { id: "over_15", label: "Over 1.5", hint: "Goals" },
  { id: "over_25", label: "Over 2.5", hint: "Goals" },
  { id: "halftime", label: "Halftime", hint: "1st half" },
  { id: "handicap", label: "Handicap", hint: "Asian HC" },
  { id: "basketball", label: "Basketball", hint: "Match winner" },
  { id: "basketball_over", label: "BB O/U", hint: "Total points" },
  { id: "tennis", label: "Tennis", hint: "Other sport" },
];

const CARDS_SUB_TABS: { id: CardsSubTab; label: string }[] = [
  { id: "card", label: "Cards" },
  { id: "corner", label: "Corners" },
];

const OTHER_SPORTS_SUB_TABS: { id: OtherSportsSubTab; label: string }[] = [
  { id: "mma", label: "MMA" },
];

const OTHER_SPORT_MARKETS = new Set<DailySpecialSub>(["basketball", "tennis"]);

function AuthLockScreen() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Lock size={28} className="text-primary" />
      </div>
      <h3 className="font-bold text-lg mb-2">Members Only</h3>
      <p className="text-sm text-base-content/60 max-w-sm mb-6">
        Sign in to access Daily Special predictions including goal scorers, cards & corners, and more.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/login?callbackUrl=/predictions/special" className="btn btn-primary">
          Sign In
        </Link>
        <Link href="/signup?invite=1" className="btn btn-outline btn-primary">
          Create Account
        </Link>
      </div>
    </div>
  );
}

function SkeletonCards({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border border-base-300 rounded-xl overflow-hidden animate-pulse">
          <div className="bg-base-200/50 px-4 py-2 flex justify-between">
            <div className="h-3 bg-base-300 rounded w-20" />
            <div className="h-3 bg-base-300 rounded w-24" />
          </div>
          <div className="px-4 py-3.5 flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2.5">
              <div className="w-9 h-9 bg-base-300 rounded-full" />
              <div className="h-4 bg-base-300 rounded w-24" />
            </div>
            <div className="w-8 h-8 bg-base-200 rounded-full" />
            <div className="flex-1 flex items-center gap-2.5 justify-end">
              <div className="h-4 bg-base-300 rounded w-24" />
              <div className="w-9 h-9 bg-base-300 rounded-full" />
            </div>
          </div>
          <div className="px-4 pb-3.5">
            <div className="bg-base-200/60 rounded-lg px-3 py-3 flex items-center gap-3">
              <div className="h-5 bg-base-300 rounded w-14" />
              <div className="h-5 bg-base-300 rounded w-10" />
              <div className="h-5 bg-base-300 rounded w-8" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function getEndpointAndParams(
  mainTab: MainTab,
  dailySub: DailySpecialSub,
  cardsSub: CardsSubTab,
  otherSportsSub: OtherSportsSubTab
): { endpoint: string; params: Record<string, string> } {
  switch (mainTab) {
    case "special":
      if (OTHER_SPORT_MARKETS.has(dailySub)) {
        return {
          endpoint: "/api/predictions/other-sports",
          params: { market_type: dailySub },
        };
      }
      return { endpoint: "/api/predictions/special", params: { market_type: dailySub } };
    case "goal-scorers":
      return { endpoint: "/api/predictions/goal-scorers", params: {} };
    case "cards-corners":
      return { endpoint: "/api/predictions/cards-corners", params: { market_type: cardsSub } };
    case "other-sports":
      return { endpoint: "/api/predictions/other-sports", params: { market_type: otherSportsSub } };
  }
}

function parseTabFromQuery(tab: string | null): {
  mainTab: MainTab;
  dailySub?: DailySpecialSub;
} | null {
  if (!tab) return null;
  if (tab === "goal-scorers") return { mainTab: "goal-scorers" };
  if (tab === "cards-corners") return { mainTab: "cards-corners" };
  if (tab === "other-sports" || tab === "mma") return { mainTab: "other-sports" };
  if (tab === "basketball" || tab === "tennis") {
    return { mainTab: "special", dailySub: tab };
  }
  if (tab === "basketball_over" || tab === "basketball-over" || tab === "bb_ou") {
    return { mainTab: "special", dailySub: "basketball_over" };
  }
  if (
    tab === "1x2" ||
    tab === "btts" ||
    tab === "bts" ||
    tab === "over_15" ||
    tab === "over_25" ||
    tab === "halftime" ||
    tab === "handicap" ||
    tab === "asian-handicap"
  ) {
    if (tab === "bts") return { mainTab: "special", dailySub: "btts" };
    if (tab === "asian-handicap") return { mainTab: "special", dailySub: "handicap" };
    return { mainTab: "special", dailySub: tab };
  }
  if (tab === "over15" || tab === "over_1.5") {
    return { mainTab: "special", dailySub: "over_15" };
  }
  if (tab === "special" || tab === "daily-special" || tab === "special-bets") {
    return { mainTab: "special" };
  }
  return null;
}

function SpecialPredictionsContent() {
  const { data: session, status: authStatus } = useSession();
  const isLoggedIn = authStatus === "authenticated" && !!session?.user;
  const searchParams = useSearchParams();

  const [mainTab, setMainTab] = useState<MainTab>("special");
  const [dailySub, setDailySub] = useState<DailySpecialSub>("1x2");
  const [cardsSub, setCardsSub] = useState<CardsSubTab>("card");
  const [otherSportsSub, setOtherSportsSub] = useState<OtherSportsSubTab>("mma");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");

  useEffect(() => {
    const parsed = parseTabFromQuery(searchParams.get("tab"));
    if (!parsed) return;
    setMainTab(parsed.mainTab);
    if (parsed.dailySub) setDailySub(parsed.dailySub);
    setPage(1);
  }, [searchParams]);

  const { endpoint, params } = getEndpointAndParams(mainTab, dailySub, cardsSub, otherSportsSub);

  const { data, isLoading, isError, error, refetch } = useSpecialPredictions(
    endpoint,
    params,
    page,
    search,
    isLoggedIn
  );

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }, [searchInput]);

  const clearSearch = useCallback(() => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  }, []);

  const items = data?.items ?? [];
  const totalPages = data?.pages ?? 1;

  const filteredItems = useMemo(() => {
    if (timeFilter === "all") return items;
    return items.filter((item) =>
      matchesTimeFilter(parsePredictionKickoff(item), timeFilter)
    );
  }, [items, timeFilter]);

  const timeFilterCounts = useMemo(() => {
    const counts: Record<TimeFilter, number> = {
      all: items.length,
      upcoming: 0,
      early_today: 0,
      yesterday: 0,
      past: 0,
    };
    for (const item of items) {
      const kickoff = parsePredictionKickoff(item);
      if (matchesTimeFilter(kickoff, "upcoming")) counts.upcoming += 1;
      if (matchesTimeFilter(kickoff, "early_today")) counts.early_today += 1;
      if (matchesTimeFilter(kickoff, "yesterday")) counts.yesterday += 1;
      if (matchesTimeFilter(kickoff, "past")) counts.past += 1;
    }
    return counts;
  }, [items]);

  function changeMainTab(tab: MainTab) {
    setMainTab(tab);
    setPage(1);
    setSearch("");
    setSearchInput("");
    setTimeFilter("all");
  }

  function changeDailySub(sub: DailySpecialSub) {
    setDailySub(sub);
    setPage(1);
    setTimeFilter("all");
  }

  function changeCardsSub(sub: CardsSubTab) {
    setCardsSub(sub);
    setPage(1);
    setTimeFilter("all");
  }

  function changeOtherSportsSub(sub: OtherSportsSubTab) {
    setOtherSportsSub(sub);
    setPage(1);
    setTimeFilter("all");
  }

  if (authStatus === "loading") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <SkeletonCards count={5} />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <AuthLockScreen />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0f2744] via-[#1a3a6b] to-[#0d4a8a] rounded-2xl p-6 sm:p-8 mb-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-secondary/20 transform translate-x-12 -translate-y-12 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-blue-400/10 transform -translate-x-8 translate-y-8 blur-xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 backdrop-blur-sm flex items-center justify-center border border-secondary/30">
              <Zap size={20} className="text-secondary" />
            </div>
            <div>
              <h1 className="font-bold text-xl sm:text-2xl font-display">Daily Special</h1>
              <p className="text-white/50 text-xs">Premium market analysis</p>
            </div>
          </div>
          <p className="text-white/70 text-sm max-w-xl leading-relaxed">
            Expert picks across daily special markets — 1X2, BTTS, Over 1.5, Over 2.5, Halftime, basketball winner & O/U, tennis, goal scorers, cards & corners, and MMA.
          </p>
          {mainTab === "special" && (
            <div className="mt-5 pt-4 border-t border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-secondary mb-3">
                Markets
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {DAILY_SPECIAL_SUB_TABS.map((sub) => {
                  const active = dailySub === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => changeDailySub(sub.id)}
                      className={`text-left rounded-xl px-3.5 py-3 border transition-all duration-200 ${
                        active
                          ? "bg-secondary text-secondary-content border-secondary shadow-lg shadow-secondary/30 scale-[1.02]"
                          : "bg-white/10 text-white border-white/15 hover:bg-white/20 hover:border-white/30"
                      }`}
                    >
                      <span className="block text-sm font-black tracking-tight">{sub.label}</span>
                      <span
                        className={`block text-[10px] mt-0.5 ${
                          active ? "text-secondary-content/75" : "text-white/50"
                        }`}
                      >
                        {sub.hint}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main tabs */}
      <div className="flex overflow-x-auto gap-1.5 mb-5 pb-1 scrollbar-none bg-base-100 border border-base-300 rounded-xl p-1.5 shadow-sm">
        {MAIN_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => changeMainTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-300 ${
              mainTab === tab.id
                ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-md"
                : "text-base-content/60 hover:bg-base-200 hover:text-base-content"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sticky active market label when scrolling lists */}
      {mainTab === "special" && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs text-base-content/45 font-medium">Showing</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 text-secondary border border-secondary/25 text-xs font-black">
            {DAILY_SPECIAL_SUB_TABS.find((s) => s.id === dailySub)?.label ?? dailySub}
          </span>
        </div>
      )}

      {mainTab === "cards-corners" && (
        <div className="flex gap-2 mb-5">
          {CARDS_SUB_TABS.map((sub) => (
            <button
              key={sub.id}
              onClick={() => changeCardsSub(sub.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 border ${
                cardsSub === sub.id
                  ? "bg-secondary text-secondary-content border-secondary shadow-sm shadow-secondary/20"
                  : "bg-base-100 text-base-content/60 border-base-300 hover:border-secondary/50 hover:text-secondary"
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}

      {mainTab === "other-sports" && (
        <div className="flex gap-2 mb-5">
          {OTHER_SPORTS_SUB_TABS.map((sub) => (
            <button
              key={sub.id}
              onClick={() => changeOtherSportsSub(sub.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 border ${
                otherSportsSub === sub.id
                  ? "bg-secondary text-secondary-content border-secondary shadow-sm shadow-secondary/20"
                  : "bg-base-100 text-base-content/60 border-base-300 hover:border-secondary/50 hover:text-secondary"
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <form onSubmit={handleSearch} className="relative mb-5">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by team name or league..."
            className="input input-bordered w-full pl-10 pr-20 h-11 text-sm rounded-xl bg-base-100 border-base-300 focus:border-primary focus:outline-none"
          />
          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-14 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-base-200 text-base-content/40 hover:text-base-content/70 transition-colors"
            >
              <X size={14} />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 btn btn-primary btn-sm h-8 min-h-0 rounded-lg text-xs px-3"
          >
            Search
          </button>
        </div>
        {search && (
          <p className="text-xs text-base-content/50 mt-2 px-1">
            Showing results for &ldquo;<span className="font-medium text-base-content/70">{search}</span>&rdquo;
            <button onClick={clearSearch} className="ml-2 text-primary hover:underline">Clear</button>
          </p>
        )}
      </form>

      {/* Time filters */}
      {!isLoading && !isError && items.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {TIME_FILTERS.map((f) => {
            const count = timeFilterCounts[f.id];
            const disabled = f.id !== "all" && count === 0;
            return (
              <button
                key={f.id}
                type="button"
                disabled={disabled}
                onClick={() => setTimeFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200 border ${
                  timeFilter === f.id
                    ? "bg-primary text-primary-content border-primary shadow-sm"
                    : disabled
                      ? "bg-base-100 text-base-content/25 border-base-300 cursor-not-allowed"
                      : "bg-base-100 text-base-content/60 border-base-300 hover:border-primary/50 hover:text-primary"
                }`}
              >
                {f.label}
                <span className="ml-1 opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Content */}
      {isLoading && <SkeletonCards count={5} />}

      {!isLoading && isError && (
        <div className="text-center py-16 bg-base-100 border border-base-300 rounded-xl">
          <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-3">
            <Zap size={20} className="text-error" />
          </div>
          <p className="text-error font-bold text-sm">Failed to load predictions</p>
          {error instanceof Error && error.message && (
            <p className="text-xs text-base-content/55 mt-2 max-w-sm mx-auto px-4">
              {error.message}
            </p>
          )}
          {dailySub === "handicap" && (
            <p className="text-xs text-base-content/50 mt-2 max-w-sm mx-auto px-4">
              Handicap is not live on the prediction API yet. Try 1X2, BTTS, Over 2.5,
              or Halftime.
            </p>
          )}
          <button onClick={() => refetch()} className="btn btn-primary btn-sm mt-4 rounded-lg">
            Try Again
          </button>
        </div>
      )}

      {!isLoading && !isError && items.length === 0 && (
        <div className="text-center py-16 bg-base-100 border border-base-300 rounded-xl">
          <div className="w-14 h-14 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-4">
            {search ? <Search size={24} className="text-base-content/30" /> : <Zap size={24} className="text-base-content/30" />}
          </div>
          <p className="font-bold text-base-content/70 text-sm">
            {search ? `No results for "${search}"` : "No predictions available"}
          </p>
          <p className="text-xs text-base-content/40 mt-1.5 max-w-xs mx-auto">
            {search
              ? "Try a different team name or league."
              : "Check back later for fresh expert picks in this category."}
          </p>
          {search && (
            <button onClick={clearSearch} className="btn btn-outline btn-sm mt-4 rounded-lg">
              Clear Search
            </button>
          )}
        </div>
      )}

      {!isLoading && !isError && items.length > 0 && filteredItems.length === 0 && (
        <div className="text-center py-12 bg-base-100 border border-base-300 rounded-xl">
          <p className="font-bold text-base-content/70 text-sm">
            No {TIME_FILTERS.find((f) => f.id === timeFilter)?.label.toLowerCase()} picks in this list
          </p>
          <button
            type="button"
            onClick={() => setTimeFilter("all")}
            className="btn btn-outline btn-sm mt-4 rounded-lg"
          >
            Show all
          </button>
        </div>
      )}

      {!isLoading && !isError && filteredItems.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="text-xs text-base-content/40 font-medium">
              {filteredItems.length} prediction{filteredItems.length !== 1 ? "s" : ""}
              {timeFilter !== "all" ? " in filter" : " found"}
            </p>
            {totalPages > 1 && (
              <p className="text-xs text-base-content/40 font-medium">
                Page {page} of {totalPages}
              </p>
            )}
          </div>

          <div className="space-y-0">
            {filteredItems.map((item, idx) => (
              <SpecialPredictionCard
                key={item.match_id || item.game_id || idx}
                prediction={{
                  ...item,
                  market_type:
                    (item.market_type as string | undefined) ||
                    (mainTab === "special" ? dailySub : undefined),
                }}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function SpecialPredictionsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-6">
          <SkeletonCards count={5} />
        </div>
      }
    >
      <SpecialPredictionsContent />
    </Suspense>
  );
}
