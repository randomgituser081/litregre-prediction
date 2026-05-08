import { BETTING_SITES } from "@/lib/mockData";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Check, X, ExternalLink, ArrowLeft, Shield } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return BETTING_SITES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const site = BETTING_SITES.find((s) => s.slug === params.slug);
  if (!site) return { title: "Betting Site Review" };
  return {
    title: `${site.name} Review & Bonus ${new Date().getFullYear()}`,
    description: `Full ${site.name} review: ${site.welcomeBonus}. Read our expert analysis of odds, features, and bonuses.`,
  };
}

export default function BettingSiteDetailPage({ params }: Props) {
  const site = BETTING_SITES.find((s) => s.slug === params.slug);
  if (!site) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-base-content/60 mb-4">
        <Link href="/betting-sites" className="hover:text-primary flex items-center gap-1">
          <ArrowLeft size={14} /> Betting Sites
        </Link>
        <span>/</span>
        <span className="text-base-content font-medium">{site.name} Review</span>
      </div>

      {/* Hero */}
      <div className="bg-base-100 border border-base-300 rounded-2xl p-6 mb-6">
        <div className="flex flex-wrap items-start gap-4 justify-between">
          <div>
            <h1 className="font-display font-bold text-3xl mb-1">{site.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    className={s <= Math.round(site.rating) ? "fill-amber-400 text-amber-400" : "text-base-300"}
                  />
                ))}
              </div>
              <span className="font-bold text-lg">{site.rating}/5</span>
              <span className="badge badge-success badge-sm">Expert Reviewed</span>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
            <p className="text-xs text-base-content/60 uppercase tracking-wide mb-1">Welcome Bonus</p>
            <p className="font-bold text-primary text-xl">{site.welcomeBonus}</p>
            {site.promoCode && (
              <p className="text-xs mt-1">
                Code: <span className="font-mono font-bold text-primary">{site.promoCode}</span>
              </p>
            )}
            <Link href={site.affiliateUrl} className="btn btn-primary btn-sm w-full mt-3 gap-1">
              Claim Bonus <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Established", val: site.established.toString() },
          { label: "Min Deposit", val: `${site.currency} ${site.minDeposit}` },
          { label: "License", val: "Licensed" },
          { label: "Countries", val: site.countries.join(", ") },
        ].map((item) => (
          <div key={item.label} className="bg-base-100 border border-base-300 rounded-xl p-3 text-center">
            <p className="text-xs text-base-content/60">{item.label}</p>
            <p className="font-semibold text-sm mt-0.5">{item.val}</p>
          </div>
        ))}
      </div>

      {/* About */}
      <div className="bg-base-100 border border-base-300 rounded-xl p-5 mb-5">
        <h2 className="font-bold text-base mb-2">About {site.name}</h2>
        <p className="text-sm text-base-content/70 leading-relaxed">{site.description}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {site.features.map((f) => (
            <span key={f} className="badge badge-outline badge-sm">{f}</span>
          ))}
        </div>
      </div>

      {/* Pros & Cons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div className="bg-base-100 border border-base-300 rounded-xl p-4">
          <h3 className="font-bold text-sm text-success mb-3 flex items-center gap-1.5">
            <Check size={15} /> Pros
          </h3>
          <ul className="space-y-2">
            {site.pros.map((pro) => (
              <li key={pro} className="flex items-start gap-2 text-sm">
                <Check size={13} className="text-success mt-0.5 flex-shrink-0" />
                {pro}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-base-100 border border-base-300 rounded-xl p-4">
          <h3 className="font-bold text-sm text-error mb-3 flex items-center gap-1.5">
            <X size={15} /> Cons
          </h3>
          <ul className="space-y-2">
            {site.cons.map((con) => (
              <li key={con} className="flex items-start gap-2 text-sm">
                <X size={13} className="text-error mt-0.5 flex-shrink-0" />
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bonus details */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-6">
        <h2 className="font-bold text-base mb-2">Bonus Details</h2>
        <p className="text-sm font-semibold text-primary mb-1">{site.welcomeBonus}</p>
        <p className="text-sm text-base-content/70">{site.bonusDetails}</p>
        <Link href={site.affiliateUrl} className="btn btn-primary btn-sm mt-4 gap-1">
          Claim {site.name} Bonus <ExternalLink size={12} />
        </Link>
      </div>

      {/* License info */}
      <div className="flex items-start gap-3 text-xs text-base-content/60 bg-base-200/50 border border-base-300 rounded-xl p-4">
        <Shield size={16} className="text-success mt-0.5 flex-shrink-0" />
        <p>{site.licenseInfo}. We only list licensed and regulated betting sites. Gambling involves risk. Please gamble responsibly. 18+ only.</p>
      </div>
    </div>
  );
}
