"use client";

import Link from "next/link";
import { useState } from "react";
import type { League, Match } from "@/types";
import MatchCard from "./MatchCard";
import { Plus, Minus } from "lucide-react";

interface Props {
  league: League;
  matches: Match[];
  defaultOpen?: boolean;
}

export default function LeagueSection({ league, matches, defaultOpen = true }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  if (!matches.length) return null;

  return (
    <div className="mb-3 rounded-xl overflow-hidden border border-base-300 shadow-sm">
      {/* League header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-content hover:bg-primary/90 transition-colors"
      >
        <div className="w-5 h-4 rounded-sm overflow-hidden bg-white/20 flex-shrink-0">
          <img
            src={`https://flagcdn.com/w40/${league.countryCode.toLowerCase()}.png`}
            alt={league.country}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <span className="font-semibold text-sm">{league.name}</span>
          <span className="text-primary-content/70 text-xs ml-1.5">{league.country}</span>
        </div>
        <Link
          href={`/league/${league.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="text-[10px] text-primary-content/70 hover:text-primary-content mr-3"
        >
          View all
        </Link>
        {open ? <Minus size={16} /> : <Plus size={16} />}
      </button>

      {/* Match rows */}
      {open && (
        <div className="bg-base-100">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}

