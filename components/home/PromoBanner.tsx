import Link from "next/link";
import { BETTING_SITES } from "@/lib/mockData";

export default function PromoBanner() {
  const site = BETTING_SITES[0];
  return (
    <div className="bg-yellow-400 text-yellow-900 text-center text-xs sm:text-sm font-semibold px-4 py-2 flex items-center justify-center gap-2 flex-wrap">
      <span>🎁 Up to ₦{site.minDeposit >= 1000 ? "200,000" : "200,000"} welcome bonus at {site.name}</span>
      <Link
        href={`/go/${site.slug}`}
        className="bg-yellow-900 text-yellow-100 rounded-full px-3 py-0.5 text-[11px] font-bold hover:bg-yellow-800 transition-colors"
      >
        Get Bonus
      </Link>
    </div>
  );
}
