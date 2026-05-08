import Link from "next/link";
import type { BettingSite } from "@/types";
import { Star, ExternalLink } from "lucide-react";

interface Props {
  site: BettingSite;
  variant?: "compact" | "banner" | "card";
}

export default function BettingSiteWidget({ site, variant = "compact" }: Props) {
  if (variant === "banner") {
    return (
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-white">
        <div>
          <p className="text-xs font-semibold opacity-80 uppercase tracking-wide">Sponsored</p>
          <p className="font-bold text-lg">{site.name}</p>
          <p className="text-sm opacity-90">{site.welcomeBonus}</p>
        </div>
        <Link
          href={site.affiliateUrl}
          className="btn btn-sm bg-white text-orange-600 hover:bg-orange-50 border-0 font-bold flex-shrink-0 gap-1"
        >
          Claim Bonus
          <ExternalLink size={12} />
        </Link>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="bg-base-100 border border-base-300 rounded-xl p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="font-bold text-lg">{site.name}</h3>
            <div className="flex items-center gap-1 mt-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={12}
                  className={s <= Math.round(site.rating) ? "fill-amber-400 text-amber-400" : "text-base-300"}
                />
              ))}
              <span className="text-xs text-base-content/60 ml-1">{site.rating}/5</span>
            </div>
          </div>
          {site.promoCode && (
            <div className="bg-primary/10 text-primary border border-primary/20 rounded-lg px-2 py-1 text-xs font-bold flex-shrink-0">
              {site.promoCode}
            </div>
          )}
        </div>

        <p className="text-primary font-semibold text-sm mb-1">{site.welcomeBonus}</p>
        <p className="text-xs text-base-content/60 mb-3">{site.bonusDetails}</p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {site.features.slice(0, 4).map((f) => (
            <span key={f} className="badge badge-ghost badge-sm text-[10px]">{f}</span>
          ))}
        </div>

        <Link
          href={site.affiliateUrl}
          className="btn btn-primary btn-sm w-full gap-1"
        >
          Claim Bonus
          <ExternalLink size={12} />
        </Link>
      </div>
    );
  }

  // compact (default)
  return (
    <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-base-200 transition-colors">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold text-primary">{site.name[0]}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold truncate">{site.name}</p>
        <p className="text-[10px] text-primary truncate">{site.welcomeBonus}</p>
      </div>
      <Link
        href={site.affiliateUrl}
        className="btn btn-primary btn-xs flex-shrink-0"
      >
        Get
      </Link>
    </div>
  );
}
