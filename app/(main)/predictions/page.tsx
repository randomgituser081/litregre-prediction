import Link from "next/link";
import { Trophy, CalendarDays, Crown, Layers, Star, Lock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Football Predictions",
  description: "Expert football predictions — General tips, VIP picks, Today's tips, Accumulator and Bet of the Day.",
};

const PREDICTION_HUBS = [
  {
    href: "/",
    icon: <Trophy size={24} className="text-primary" />,
    label: "General Predictions",
    description: "All available predictions — open to everyone, no sign-in required.",
    badge: null,
    auth: false,
    color: "border-primary/20 hover:border-primary/50",
    bg: "bg-primary/5",
  },
  {
    href: "/predictions/today",
    icon: <CalendarDays size={24} className="text-success" />,
    label: "Today's Tips",
    description: "All predictions specifically curated for today's matches.",
    badge: "Today",
    auth: true,
    color: "border-success/20 hover:border-success/50",
    bg: "bg-success/5",
  },
  {
    href: "/predictions/vip",
    icon: <Crown size={24} className="text-amber-500" />,
    label: "VIP Predictions",
    description: "Premium picks with team logos, competition details, confidence and odds.",
    badge: "VIP",
    auth: true,
    color: "border-amber-400/20 hover:border-amber-400/50",
    bg: "bg-amber-50/50 dark:bg-amber-900/10",
  },
  {
    href: "/predictions/accumulator-tips",
    icon: <Layers size={24} className="text-blue-500" />,
    label: "Accumulator Tips",
    description: "Multiple selections combined into an accumulator with calculated total odds.",
    badge: null,
    auth: true,
    color: "border-blue-400/20 hover:border-blue-400/50",
    bg: "bg-blue-50/50 dark:bg-blue-900/10",
  },
  {
    href: "/predictions/bet-of-the-day",
    icon: <Star size={24} className="text-orange-500" />,
    label: "Bet of the Day",
    description: "Our single highest-confidence pick of the day. Free for everyone.",
    badge: "Free",
    auth: false,
    color: "border-orange-400/20 hover:border-orange-400/50",
    bg: "bg-orange-50/50 dark:bg-orange-900/10",
  },
];

export default function PredictionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Trophy size={22} />
          <h1 className="font-bold text-2xl">Football Predictions</h1>
        </div>
        <p className="text-white/80 text-sm max-w-xl">
          Expert daily football predictions. Choose a category below to view tips.
        </p>
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PREDICTION_HUBS.map((hub) => (
          <Link
            key={hub.href}
            href={hub.href}
            className={`group flex flex-col gap-3 p-5 bg-base-100 border rounded-2xl transition-all shadow-sm hover:shadow-md ${hub.color}`}
          >
            {/* Icon + badge row */}
            <div className="flex items-start justify-between">
              <div className={`w-12 h-12 rounded-xl ${hub.bg} flex items-center justify-center`}>
                {hub.icon}
              </div>
              <div className="flex gap-1.5 items-center">
                {hub.auth && (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-base-content/40 border border-base-300 rounded-full px-2 py-0.5">
                    <Lock size={9} /> Members
                  </span>
                )}
                {hub.badge && (
                  <span className="text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5">
                    {hub.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Text */}
            <div>
              <h2 className="font-bold text-base group-hover:text-primary transition-colors">
                {hub.label}
              </h2>
              <p className="text-xs text-base-content/60 mt-1 leading-relaxed">
                {hub.description}
              </p>
            </div>

            <span className="text-xs font-semibold text-primary group-hover:underline mt-auto">
              View {hub.label} →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
