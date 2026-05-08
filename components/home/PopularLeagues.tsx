import Link from "next/link";
import { LEAGUES } from "@/lib/mockData";

export default function PopularLeagues() {
  return (
    <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-base-300">
        <h3 className="font-bold text-sm">Popular Leagues</h3>
      </div>
      <div className="divide-y divide-base-300">
        {LEAGUES.map((league) => (
          <Link
            key={league.id}
            href={`/league/${league.slug}`}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-base-200/50 hover:text-primary transition-colors group"
          >
            <div className="w-5 h-4 rounded overflow-hidden bg-base-200 flex-shrink-0">
              <img
                src={`https://flagcdn.com/w40/${league.countryCode.toLowerCase()}.png`}
                alt={league.country}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate group-hover:text-primary">
                {league.name}
              </p>
              <p className="text-[10px] text-base-content/50">{league.country}</p>
            </div>
            <span className="text-base-content/30 group-hover:text-primary text-xs">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
