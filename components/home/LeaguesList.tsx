import Link from "next/link";
import { LEAGUES } from "@/lib/mockData";
import { ChevronRight } from "lucide-react";

export default function LeaguesList() {
  return (
    <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
      <div className="bg-primary text-primary-content px-4 py-2.5 font-bold text-sm flex items-center gap-2">
        ⚽ Football Leagues
      </div>
      <div className="divide-y divide-base-300">
        {LEAGUES.map((league) => (
          <Link
            key={league.id}
            href={`/league/${league.slug}`}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-base-200/60 transition-colors group"
          >
            <div className="w-6 h-4 rounded-sm overflow-hidden bg-base-200 flex-shrink-0">
              <img
                src={`https://flagcdn.com/w40/${league.countryCode.toLowerCase()}.png`}
                alt={league.country}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{league.name}</p>
              <p className="text-[10px] text-base-content/50">{league.country}</p>
            </div>
            <ChevronRight size={14} className="text-base-content/30 group-hover:text-primary transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
