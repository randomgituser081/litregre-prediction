import { BETTING_SITES } from "@/lib/mockData";
import Link from "next/link";
import { Tag, Copy } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Betting Promo Codes Nigeria 2025",
  description: "All active promo codes and bonus codes for Nigeria's top football betting sites.",
};

export default function PromoCodesPage() {
  const sitesWithCodes = BETTING_SITES.filter((s) => s.promoCode);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Tag size={22} />
          <h1 className="font-display font-bold text-2xl">Promo Codes</h1>
        </div>
        <p className="text-white/80 text-sm">Copy and use these codes when signing up to unlock exclusive bonuses.</p>
      </div>

      <div className="space-y-4">
        {sitesWithCodes.map((site) => (
          <div key={site.id} className="bg-base-100 border border-base-300 rounded-xl p-4 flex flex-wrap items-center gap-4 justify-between">
            <div>
              <p className="font-bold">{site.name}</p>
              <p className="text-sm text-base-content/70">{site.welcomeBonus}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-3 py-2">
                <span className="font-mono font-bold tracking-widest text-primary">{site.promoCode}</span>
                <Copy size={13} className="text-primary/60" />
              </div>
              <Link href={site.affiliateUrl} className="btn btn-primary btn-sm">
                Use Code
              </Link>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-base-content/50 text-center mt-6">
        Promo codes subject to change. Always check the site for latest terms. 18+ T&Cs apply.
      </p>
    </div>
  );
}
