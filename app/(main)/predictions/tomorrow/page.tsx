import { MATCHES } from "@/lib/mockData";
import LeagueSection from "@/components/predictions/LeagueSection";
import { Calendar } from "lucide-react";
import dayjs from "dayjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tomorrow Football Predictions",
  description: "Free football predictions for tomorrow's matches. Expert tips with analysis.",
};

export default function TomorrowPredictionsPage() {
  const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");
  const matches = MATCHES.filter((m) => m.date === tomorrow);

  // Group by league
  const byLeague: Record<string, typeof matches> = {};
  for (const m of matches) {
    const key = m.league.id;
    if (!byLeague[key]) byLeague[key] = [];
    byLeague[key].push(m);
  }
  const leagueEntries = Object.entries(byLeague);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Calendar size={20} className="text-primary" />
        <div>
          <h1 className="font-display font-bold text-xl">Tomorrow Football Predictions</h1>
          <p className="text-sm text-base-content/60">{dayjs().add(1, "day").format("dddd, MMMM D YYYY")}</p>
        </div>
      </div>

      {leagueEntries.length === 0 ? (
        <div className="text-center py-16 bg-base-100 border border-base-300 rounded-2xl">
          <Calendar size={40} className="mx-auto text-base-content/30 mb-3" />
          <p className="text-base-content/60">No predictions yet for tomorrow.</p>
          <p className="text-sm text-base-content/40 mt-1">Check back soon — we update daily.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {leagueEntries.map(([, leagueMatches]) => (
            <LeagueSection key={leagueMatches[0].league.id} league={leagueMatches[0].league} matches={leagueMatches} />
          ))}
        </div>
      )}
    </div>
  );
}
