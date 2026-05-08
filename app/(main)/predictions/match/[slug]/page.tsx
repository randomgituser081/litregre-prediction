import { MATCHES, getMatchBySlug } from "@/lib/mockData";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Eye, Calendar, MapPin, TrendingUp, Shield, BarChart2 } from "lucide-react";
import clsx from "clsx";
import type { Metadata } from "next";
import type { TeamForm } from "@/types";
import BettingSiteWidget from "@/components/ads/BettingSiteWidget";
import SafeImage from "@/components/ui/SafeImage";
import { BETTING_SITES } from "@/lib/mockData";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return MATCHES.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const match = getMatchBySlug(params.slug);
  if (!match) return { title: "Match Prediction" };
  return {
    title: `${match.homeTeam.name} vs ${match.awayTeam.name} Prediction`,
    description: `${match.homeTeam.name} vs ${match.awayTeam.name} prediction, tips and analysis. ${match.prediction.value} — ${match.prediction.analysis.slice(0, 120)}`,
  };
}

const FORM_CONFIG: Record<TeamForm["result"], string> = {
  W: "form-W",
  D: "form-D",
  L: "form-L",
};

const CONFIDENCE_CONFIG = {
  high: { label: "High Confidence", class: "badge-success" },
  medium: { label: "Medium Confidence", class: "badge-warning" },
  low: { label: "Low Confidence", class: "badge-error" },
};

export default function MatchDetailPage({ params }: Props) {
  const match = getMatchBySlug(params.slug);
  if (!match) notFound();

  const confidence = CONFIDENCE_CONFIG[match.prediction.confidence];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-base-content/60 mb-4">
        <Link href="/predictions" className="hover:text-primary flex items-center gap-1">
          <ArrowLeft size={14} /> Predictions
        </Link>
        <span>/</span>
        <span className="text-base-content/80 truncate">
          {match.homeTeam.name} vs {match.awayTeam.name}
        </span>
      </div>

      {/* Match hero */}
      <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-5 sm:p-8 mb-6 text-white">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-5 text-white/70 text-xs">
          <span className="flex items-center gap-1">
            <Calendar size={12} /> {match.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {match.time}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={12} /> {match.league.name}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={12} /> {match.views.toLocaleString()} views
          </span>
        </div>

        {/* Teams row */}
        <div className="flex items-center justify-between gap-4">
          {/* Home */}
          <div className="flex-1 text-center">
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white/20 mx-auto mb-2 flex items-center justify-center overflow-hidden">
              <SafeImage
                src={match.homeTeam.logo}
                alt={match.homeTeam.name}
                className="w-14 h-14 sm:w-20 sm:h-20 object-contain"
                hideOnError={false}
              />
            </div>
            <p className="font-bold text-base sm:text-lg leading-tight">{match.homeTeam.name}</p>
            <p className="text-white/60 text-xs">{match.homeTeam.country}</p>
          </div>

          {/* Center */}
          <div className="flex-shrink-0 text-center">
            {match.status === "finished" ? (
              <div className="bg-white/20 rounded-2xl px-6 py-3">
                <span className="text-3xl font-bold">
                  {match.homeScore} – {match.awayScore}
                </span>
                <p className="text-white/60 text-xs mt-1">Full Time</p>
              </div>
            ) : (
              <div className="bg-white/20 rounded-2xl px-5 py-3">
                <span className="text-2xl font-bold">VS</span>
                <p className="text-white/60 text-xs mt-1">Upcoming</p>
              </div>
            )}
          </div>

          {/* Away */}
          <div className="flex-1 text-center">
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white/20 mx-auto mb-2 flex items-center justify-center overflow-hidden">
              <SafeImage
                src={match.awayTeam.logo}
                alt={match.awayTeam.name}
                className="w-14 h-14 sm:w-20 sm:h-20 object-contain"
                hideOnError={false}
              />
            </div>
            <p className="font-bold text-base sm:text-lg leading-tight">{match.awayTeam.name}</p>
            <p className="text-white/60 text-xs">{match.awayTeam.country}</p>
          </div>
        </div>

        {/* Odds row */}
        <div className="mt-5 bg-white/10 rounded-xl p-3 grid grid-cols-3 gap-2 text-center">
          {[
            { label: "Home Win", val: match.odds.home },
            { label: "Draw", val: match.odds.draw },
            { label: "Away Win", val: match.odds.away },
          ].map((o) => (
            <div key={o.label}>
              <p className="text-white/60 text-[10px]">{o.label}</p>
              <p className="font-bold text-lg">{o.val}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Prediction */}
          <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-base-300">
              <h2 className="font-bold flex items-center gap-2">
                <TrendingUp size={16} className="text-primary" />
                Our Prediction
              </h2>
              <span className={`badge badge-sm ${confidence.class}`}>{confidence.label}</span>
            </div>
            <div className="p-4">
              <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 mb-4">
                <p className="text-xs text-primary/70 font-medium uppercase tracking-wide mb-0.5">Top Tip</p>
                <p className="text-primary font-bold text-xl">{match.prediction.value}</p>
              </div>

              {match.tips.length > 1 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2">All Tips</p>
                  <div className="flex flex-wrap gap-2">
                    {match.tips.map((tip) => (
                      <span key={tip} className="badge badge-outline badge-primary text-xs py-2 px-3">
                        {tip}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {match.htPrediction && (
                <div className="flex items-center gap-2 text-sm mb-3">
                  <span className="text-base-content/60 font-medium">HT Prediction:</span>
                  <span className="font-semibold">{match.htPrediction}</span>
                </div>
              )}
            </div>
          </div>

          {/* Analysis */}
          <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-base-300">
              <BarChart2 size={16} className="text-primary" />
              <h2 className="font-bold">Match Analysis</h2>
            </div>
            <div className="p-4">
              <p className="text-sm text-base-content/80 leading-relaxed">{match.analysis}</p>
            </div>
          </div>

          {/* Team form */}
          <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-base-300">
              <h2 className="font-bold">Recent Form</h2>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Home form */}
              <div>
                <p className="text-xs font-semibold text-base-content/60 mb-2 flex items-center gap-1.5">
                  <img src={match.homeTeam.logo} alt="" className="w-4 h-4 object-contain" />
                  {match.homeTeam.name}
                </p>
                <div className="space-y-1.5">
                  {match.homeForm.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span
                        className={clsx(
                          "w-5 h-5 rounded flex items-center justify-center font-bold flex-shrink-0",
                          FORM_CONFIG[f.result]
                        )}
                      >
                        {f.result}
                      </span>
                      <span className="text-base-content/60 truncate">
                        {f.isHome ? "H" : "A"} vs {f.opponent}
                      </span>
                      <span className="font-semibold ml-auto flex-shrink-0">{f.score}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Away form */}
              <div>
                <p className="text-xs font-semibold text-base-content/60 mb-2 flex items-center gap-1.5">
                  <img src={match.awayTeam.logo} alt="" className="w-4 h-4 object-contain" />
                  {match.awayTeam.name}
                </p>
                <div className="space-y-1.5">
                  {match.awayForm.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span
                        className={clsx(
                          "w-5 h-5 rounded flex items-center justify-center font-bold flex-shrink-0",
                          FORM_CONFIG[f.result]
                        )}
                      >
                        {f.result}
                      </span>
                      <span className="text-base-content/60 truncate">
                        {f.isHome ? "H" : "A"} vs {f.opponent}
                      </span>
                      <span className="font-semibold ml-auto flex-shrink-0">{f.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Head to head */}
          <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-base-300">
              <h2 className="font-bold">Head to Head</h2>
            </div>
            <div className="divide-y divide-base-300">
              {match.headToHead.map((h, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-3 text-xs">
                  <span className="text-base-content/50 flex-shrink-0 w-20">{h.date}</span>
                  <span className="flex-1 text-right font-medium truncate">{h.homeTeam}</span>
                  <span className="font-bold text-center px-3 flex-shrink-0">
                    {h.homeScore} – {h.awayScore}
                  </span>
                  <span className="flex-1 font-medium truncate">{h.awayTeam}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Extra odds */}
          <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-base-300">
              <h2 className="font-bold">More Markets</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4">
              {[
                { label: "Over 2.5 Goals", val: match.odds.over25 },
                { label: "Under 2.5 Goals", val: match.odds.under25 },
                { label: "BTTS Yes", val: match.odds.btts },
                { label: "BTTS No", val: match.odds.nobtts },
                { label: "Home Win", val: match.odds.home },
                { label: "Away Win", val: match.odds.away },
              ].map((o) => (
                <div
                  key={o.label}
                  className="bg-base-200/50 border border-base-300 rounded-lg p-3 text-center"
                >
                  <p className="text-xs text-base-content/60 mb-0.5">{o.label}</p>
                  <p className="font-bold text-lg">{o.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          {/* Bet now */}
          <div className="bg-base-100 border border-base-300 rounded-xl p-4">
            <h3 className="font-bold text-sm mb-3">Bet on this match</h3>
            <div className="space-y-2">
              {BETTING_SITES.slice(0, 3).map((site) => (
                <BettingSiteWidget key={site.id} site={site} variant="compact" />
              ))}
            </div>
          </div>

          {/* More from this league */}
          <div className="bg-base-100 border border-base-300 rounded-xl p-4">
            <h3 className="font-bold text-sm mb-3">
              More {match.league.name} Predictions
            </h3>
            <Link
              href={`/league/${match.league.slug}`}
              className="btn btn-outline btn-primary btn-sm w-full"
            >
              View All →
            </Link>
          </div>

          {/* Share */}
          <div className="bg-base-100 border border-base-300 rounded-xl p-4">
            <h3 className="font-bold text-sm mb-3">Share this prediction</h3>
            <div className="flex gap-2">
              {["Twitter / X", "WhatsApp", "Telegram"].map((s) => (
                <button key={s} className="btn btn-outline btn-xs flex-1">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
