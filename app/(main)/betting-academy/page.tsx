import { ACADEMY_ARTICLES } from "@/lib/mockData";
import Link from "next/link";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Betting Academy – Learn to Bet on Football",
  description: "The EaglePredict Betting Academy. Free guides and strategies to help you bet on football smarter.",
};

const CATEGORIES = ["All", "Basics", "Strategies", "Reviews"];

export default function BettingAcademyPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-secondary to-green-600 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={22} />
          <h1 className="font-display font-bold text-2xl">Betting Academy</h1>
        </div>
        <p className="text-white/90 text-sm max-w-xl">
          Learn how to bet on football smarter. Free guides for beginners and advanced punters.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {CATEGORIES.map((c) => (
            <span key={c} className="badge bg-white/20 text-white border-0 text-xs">{c}</span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { val: "6+", label: "Free Guides" },
          { val: "50K+", label: "Students" },
          { val: "100%", label: "Free Forever" },
        ].map((s) => (
          <div key={s.label} className="bg-base-100 border border-base-300 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-secondary">{s.val}</p>
            <p className="text-xs text-base-content/60 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Articles grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACADEMY_ARTICLES.map((article) => (
          <Link
            key={article.id}
            href={`/betting-academy/${article.slug}`}
            className="bg-base-100 border border-base-300 rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-md transition-all group"
          >
            {/* Category badge */}
            <div className="p-4 pb-3">
              <span className="badge badge-secondary badge-sm mb-3">{article.category}</span>
              <h3 className="font-bold text-sm leading-snug group-hover:text-primary transition-colors mb-2">
                {article.title}
              </h3>
              <p className="text-xs text-base-content/60 leading-relaxed line-clamp-2">{article.excerpt}</p>
            </div>

            <div className="flex items-center justify-between px-4 py-3 bg-base-200/50 border-t border-base-300">
              <div className="flex items-center gap-3 text-xs text-base-content/50">
                <span className="flex items-center gap-1">
                  <Clock size={11} /> {article.readTime} min read
                </span>
              </div>
              <span className="text-primary text-xs font-medium flex items-center gap-1">
                Read <ArrowRight size={11} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
