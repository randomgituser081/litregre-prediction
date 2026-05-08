import { BETTING_SITES } from "@/lib/mockData";
import Link from "next/link";
import { Star, ExternalLink, Check, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Betting Sites in Nigeria 2025",
  description: "Reviewed and ranked: the best football betting sites in Nigeria with exclusive welcome bonuses and promo codes.",
};

export default function BettingSitesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Star size={22} className="fill-white" />
          <h1 className="font-display font-bold text-2xl">Best Betting Sites</h1>
        </div>
        <p className="text-white/90 text-sm max-w-xl">
          We've reviewed and ranked the top football betting sites in Nigeria. Compare bonuses, odds, and features to find your perfect bookmaker.
        </p>
        <div className="flex flex-wrap gap-3 mt-4 text-xs text-white/80">
          <span className="flex items-center gap-1"><Shield size={12} /> Verified & Licensed</span>
          <span className="flex items-center gap-1"><Check size={12} /> Exclusive Bonuses</span>
          <span className="flex items-center gap-1"><Star size={12} fill="white" /> Expert Rated</span>
        </div>
      </div>

      {/* Featured picks */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {[
          { label: "#1 Overall", site: BETTING_SITES[0] },
          { label: "Best Odds", site: BETTING_SITES[2] },
          { label: "Best Bonus", site: BETTING_SITES[4] },
        ].map(({ label, site }) => (
          <div key={site.id} className="bg-base-100 border-2 border-primary/30 rounded-xl p-3 text-center">
            <span className="badge badge-primary badge-sm mb-2">{label}</span>
            <p className="font-bold text-sm">{site.name}</p>
            <p className="text-primary text-xs font-semibold mt-0.5">{site.welcomeBonus}</p>
            <Link href={site.affiliateUrl} className="btn btn-primary btn-xs w-full mt-2 gap-1">
              Claim <ExternalLink size={10} />
            </Link>
          </div>
        ))}
      </div>

      {/* Full list */}
      <h2 className="font-bold text-lg mb-4">All Reviewed Betting Sites</h2>
      <div className="space-y-4">
        {BETTING_SITES.map((site, idx) => (
          <div
            key={site.id}
            className="bg-base-100 border border-base-300 rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-md transition-all"
          >
            {/* Top */}
            <div className="flex items-start gap-4 p-5">
              {/* Rank badge */}
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 font-bold text-primary text-sm">
                #{idx + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg">{site.name}</h3>
                  {site.promoCode && (
                    <span className="badge badge-outline badge-primary badge-sm font-mono">
                      {site.promoCode}
                    </span>
                  )}
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={13}
                      className={s <= Math.round(site.rating) ? "fill-amber-400 text-amber-400" : "text-base-300"}
                    />
                  ))}
                  <span className="text-xs text-base-content/60 ml-1 font-semibold">{site.rating}/5</span>
                </div>

                <p className="text-sm text-base-content/70 mb-3 leading-relaxed">{site.description}</p>

                {/* Features */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {site.features.map((f) => (
                    <span key={f} className="badge badge-ghost badge-sm text-[10px]">{f}</span>
                  ))}
                </div>

                {/* Pros */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mb-3">
                  {site.pros.slice(0, 4).map((pro) => (
                    <div key={pro} className="flex items-center gap-1.5 text-xs text-base-content/70">
                      <Check size={11} className="text-success flex-shrink-0" />
                      {pro}
                    </div>
                  ))}
                </div>

                {/* Min deposit */}
                <p className="text-xs text-base-content/50">
                  Min deposit: {site.currency} {site.minDeposit.toLocaleString()} • {site.licenseInfo}
                </p>
              </div>

              {/* Right: Bonus + CTA */}
              <div className="flex-shrink-0 text-right hidden sm:flex flex-col items-end gap-2 min-w-[140px]">
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-base-content/60 uppercase tracking-wide">Welcome Bonus</p>
                  <p className="font-bold text-primary text-sm mt-0.5">{site.welcomeBonus}</p>
                </div>
                <Link
                  href={site.affiliateUrl}
                  className="btn btn-primary btn-sm gap-1 w-full"
                >
                  Visit Site
                  <ExternalLink size={12} />
                </Link>
                <Link
                  href={`/betting-sites/${site.slug}`}
                  className="btn btn-ghost btn-xs w-full text-xs"
                >
                  Full Review
                </Link>
              </div>
            </div>

            {/* Mobile CTA */}
            <div className="sm:hidden px-5 pb-4 flex gap-2">
              <Link href={site.affiliateUrl} className="btn btn-primary btn-sm flex-1 gap-1">
                Visit Site <ExternalLink size={12} />
              </Link>
              <Link href={`/betting-sites/${site.slug}`} className="btn btn-outline btn-sm flex-1">
                Full Review
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 bg-base-200/50 border border-base-300 rounded-xl p-4 text-xs text-base-content/60 leading-relaxed">
        <strong>Disclaimer:</strong> The betting sites listed above are affiliates of EaglePredict. We may receive a commission when you sign up using our links. All sites have been independently reviewed. Gambling involves risk — please gamble responsibly. 18+ only.
      </div>
    </div>
  );
}
