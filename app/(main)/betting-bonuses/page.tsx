import { BONUSES } from "@/lib/mockData";
import Link from "next/link";
import { Gift } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Football Betting Bonuses & Free Bets Nigeria",
  description: "Best football betting bonuses and free bets available in Nigeria. Compare welcome offers, no-deposit bonuses, and loyalty rewards.",
};

export default function BettingBonusesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Gift size={22} />
          <h1 className="font-display font-bold text-2xl">Betting Bonuses</h1>
        </div>
        <p className="text-white/80 text-sm">
          The best betting bonuses and free bets available in Nigeria right now.
        </p>
      </div>

      {/* Bonus types */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {BONUSES.map((bonus) => (
            <div key={bonus.id} className="bg-base-100 border border-base-300 rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-base-300 bg-amber-50 dark:bg-amber-950/20">
                <Gift size={18} className="text-amber-600" />
                <div>
                  <p className="font-bold text-sm">{bonus.title}</p>
                  <p className="text-xs text-base-content/60">{bonus.site.name}</p>
                </div>
                <span className="badge badge-warning badge-sm ml-auto">{bonus.type}</span>
              </div>
              <div className="p-4">
                <p className="text-2xl font-bold text-primary mb-1">{bonus.amount}</p>
                <p className="text-xs text-base-content/70 mb-3">{bonus.terms}</p>
                {bonus.code && (
                  <p className="text-[10px] text-base-content/50 mb-3">Code: <span className="font-mono font-bold">{bonus.code}</span></p>
                )}
                <Link href={bonus.affiliateUrl} className="btn btn-primary btn-sm w-full">
                  Claim Bonus
                </Link>
              </div>
            </div>
          ))}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-base-content/50 text-center">
        T&Cs apply. 18+. Please gamble responsibly. Bonus offers subject to change.
      </p>
    </div>
  );
}
