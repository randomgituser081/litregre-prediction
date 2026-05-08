import { LEAGUES, MATCHES, getMatchesByLeague } from "@/lib/mockData";
import MatchCard from "@/components/predictions/MatchCard";
import SafeImage from "@/components/ui/SafeImage";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return LEAGUES.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const league = LEAGUES.find((l) => l.slug === params.slug);
  if (!league) return { title: "League Predictions" };
  return {
    title: `${league.name} Predictions`,
    description: `Free ${league.name} football predictions and betting tips. Expert analysis for every ${league.country} match.`,
  };
}

export default function LeaguePage({ params }: Props) {
  const league = LEAGUES.find((l) => l.slug === params.slug);
  if (!league) notFound();

  const matches = getMatchesByLeague(league.id);
  const displayMatches = matches.length > 0 ? matches : MATCHES.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-base-content/60 mb-4">
        <Link href="/" className="hover:text-primary flex items-center gap-1">
          <ArrowLeft size={14} /> Home
        </Link>
        <span>/</span>
        <span className="text-base-content font-medium">{league.name}</span>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-8 rounded overflow-hidden bg-white/20 flex-shrink-0">
            <SafeImage
              src={`https://flagcdn.com/w80/${league.countryCode.toLowerCase()}.png`}
              alt={league.country}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl">{league.name}</h1>
            <p className="text-white/70 text-sm">{league.country} • {league.season}</p>
          </div>
        </div>
        <div className="flex gap-4 mt-4 text-sm">
          <div className="bg-white/10 rounded-lg px-3 py-1.5">
            <span className="font-bold">{displayMatches.length}</span>
            <span className="text-white/70 ml-1">predictions</span>
          </div>
        </div>
      </div>

      {/* All leagues quick nav */}
      <div className="mb-5">
        <h3 className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2">
          Other Leagues
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {LEAGUES.filter((l) => l.id !== league.id).slice(0, 8).map((l) => (
            <Link
              key={l.id}
              href={`/league/${l.slug}`}
              className="flex-shrink-0 badge badge-outline hover:badge-primary text-xs py-2.5 px-3 transition-colors"
            >
              {l.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Matches */}
      {displayMatches.length > 0 ? (
        <div>
          <h2 className="font-bold text-base mb-3">Latest Predictions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-base-200/50 rounded-2xl">
          <p className="text-4xl mb-3">⚽</p>
          <p className="font-semibold">No predictions for this league yet</p>
          <p className="text-base-content/60 text-sm mt-1">Check back soon</p>
        </div>
      )}
    </div>
  );
}
