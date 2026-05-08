"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Trophy, Gift } from "lucide-react";

const NAV = [
  { href: "/", icon: Calendar, label: "Calendar" },
  { href: "/predictions", icon: Trophy, label: "Predictions" },
  { href: "/betting-bonuses", icon: Gift, label: "Betting Bonus" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-bottom-nav md:hidden">
      {NAV.map(({ href, icon: Icon, label }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-colors ${
              active ? "text-primary" : "text-base-content/40"
            }`}
          >
            <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
            <span className="text-[9px] font-medium leading-tight text-center">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

