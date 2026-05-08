"use client";

import { useState, useMemo } from "react";
import dayjs from "dayjs";
import PredictionOfTheDay from "@/components/home/PredictionOfTheDay";
import LeaguesList from "@/components/home/LeaguesList";
import DatePicker from "@/components/home/DatePicker";
import LeagueSection from "@/components/predictions/LeagueSection";
import BettingSiteWidget from "@/components/ads/BettingSiteWidget";
import PredictionCategoryBar from "@/components/predictions/PredictionCategoryBar";
import { MATCHES, LEAGUES, BETTING_SITES } from "@/lib/mockData";
import type { Match } from "@/types";

export default function HomePage() {
  const today = dayjs().format("YYYY-MM-DD");
  const [selectedDate, setSelectedDate] = useState(today);

  const filteredMatches = useMemo(() => {
    return MATCHES.filter((m) => m.date === selectedDate);
  }, [selectedDate]);

  const matchesByLeague = useMemo(() => {
    const groups: Record<string, Match[]> = {};
    filteredMatches.forEach((m) => {
      if (!groups[m.league.id]) groups[m.league.id] = [];
      groups[m.league.id].push(m);
    });
    return groups;
  }, [filteredMatches]);

  const leaguesWithMatches = LEAGUES.filter((l) => matchesByLeague[l.id]?.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4">
      <div className="flex flex-col lg:flex-row gap-4">

        {/* ── Main Feed ── */}
        <div className="flex-1 min-w-0 order-2 lg:order-1">

          {/* Prediction type tabs */}
          <div className="mb-3">
            <PredictionCategoryBar />
          </div>

          {/* Date picker */}
          <div className="mb-3">
            <DatePicker selected={selectedDate} onChange={setSelectedDate} />
          </div>

          {/* Match count bar */}
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="font-bold text-sm text-base-content/80">
              {dayjs(selectedDate).isSame(dayjs(), "day")
                ? "Today's Predictions"
                : dayjs(selectedDate).isSame(dayjs().add(1, "day"), "day")
                ? "Tomorrow's Predictions"
                : `Predictions — ${dayjs(selectedDate).format("ddd, MMM D")}`}
            </h2>
            <span className="text-xs text-base-content/50">{filteredMatches.length} matches</span>
          </div>

          {/* No matches */}
          {filteredMatches.length === 0 && (
            <div className="text-center py-12 bg-base-200/50 rounded-xl border border-base-300">
              <p className="text-3xl mb-2">⚽</p>
              <p className="font-semibold mb-1">No predictions for this date</p>
              <button onClick={() => setSelectedDate(today)} className="btn btn-primary btn-sm mt-3">
                Back to Today
              </button>
            </div>
          )}

          {/* League sections with inline betting ads every 3 leagues */}
          {leaguesWithMatches.map((league, i) => (
            <div key={league.id}>
              <LeagueSection league={league} matches={matchesByLeague[league.id]} />
              {(i + 1) % 3 === 0 && i < leaguesWithMatches.length - 1 && (
                <div className="mb-3">
                  <BettingSiteWidget site={BETTING_SITES[Math.floor(i / 3) % BETTING_SITES.length]} variant="banner" />
                </div>
              )}
            </div>
          ))}

          {/* SEO text */}
          {filteredMatches.length > 0 && (
            <div className="mt-6 bg-base-100 border border-base-300 rounded-xl p-5">
              <h2 className="font-display font-bold text-lg mb-2 text-primary">The Best Football Tips for Today&apos;s Matches</h2>
              <p className="text-sm text-base-content/70 leading-relaxed mb-3">
                We provide you with a comprehensive tool of football matches from over 300 leagues across the globe so that you can get the best football tips for today.
              </p>
              <h3 className="font-bold text-base mb-2">The Best Football Prediction Site In The World</h3>
              <p className="text-sm text-base-content/70 leading-relaxed">
                EaglePredict is regarded as the most accurate soccer prediction site in the world with over 89% accuracy rate. We also provide a full list of verified betting sites and best betting bonuses. Our educational content includes guides on sport betting and advanced betting tips. Check back daily to stay ahead of the game.
              </p>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 order-1 lg:order-2 space-y-4">
          {/* Prediction of the Day */}
          <PredictionOfTheDay />

          {/* Football Leagues list */}
          <LeaguesList />

          {/* Top Betting Sites */}
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

