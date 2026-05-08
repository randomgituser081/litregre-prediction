"use client";

import Link from "next/link";
import type { Match } from "@/types";
import { ChevronLeft, ChevronRight, Clock, TrendingUp, Eye } from "lucide-react";
import { useState, useEffect } from "react";

interface Props {
  matches: Match[];
}

export default function FeaturedCarousel({ matches }: Props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (matches.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % matches.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [matches.length]);

  if (!matches.length) return null;

  const match = matches[current];

  return (
    <div className="relative bg-gradient-to-r from-primary to-blue-700 rounded-2xl overflow-hidden shadow-xl">
      {/* Background glow */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white transform translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white transform -translate-x-12 translate-y-12" />
      </div>

      <div className="relative z-10 p-5 sm:p-8">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="badge badge-sm bg-white/20 text-white border-0 gap-1">
            <TrendingUp size={10} />
            Featured Match
          </span>
          <span className="text-white/60 text-xs flex items-center gap-1">
            <Clock size={10} />
            {match.time}
          </span>
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between gap-4 mb-5">
          {/* Home */}
          <div className="flex-1 text-center">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-sm mx-auto mb-2 flex items-center justify-center overflow-hidden">
              <img
                src={match.homeTeam.logo}
                alt={match.homeTeam.name}
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }}
              />
            </div>
            <p className="text-white font-bold text-sm sm:text-base leading-tight">
              {match.homeTeam.name}
            </p>
          </div>

          {/* VS / Score */}
          <div className="flex-shrink-0 text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 sm:px-6 sm:py-3">
              <span className="text-white font-display font-bold text-xl sm:text-3xl">VS</span>
            </div>
            <p className="text-white/60 text-xs mt-1">{match.league.name}</p>
          </div>

          {/* Away */}
          <div className="flex-1 text-center">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-sm mx-auto mb-2 flex items-center justify-center overflow-hidden">
              <img
                src={match.awayTeam.logo}
                alt={match.awayTeam.name}
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }}
              />
            </div>
            <p className="text-white font-bold text-sm sm:text-base leading-tight">
              {match.awayTeam.name}
            </p>
          </div>
        </div>

        {/* Prediction */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-white/60 text-xs uppercase tracking-wide mb-0.5">Prediction</p>
              <p className="text-white font-bold text-lg">{match.prediction.value}</p>
              <p className="text-white/70 text-xs mt-0.5 line-clamp-2">
                {match.prediction.analysis}
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              {[
                { label: "Home", val: match.odds.home },
                { label: "Draw", val: match.odds.draw },
                { label: "Away", val: match.odds.away },
              ].map((o) => (
                <div key={o.label} className="text-center">
                  <p className="text-white/60 text-[10px]">{o.label}</p>
                  <p className="text-white font-bold text-sm">{o.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <Link
            href={`/predictions/match/${match.slug}`}
            className="btn btn-sm bg-white text-primary hover:bg-white/90 border-0 font-semibold"
          >
            View Analysis →
          </Link>
          <div className="flex items-center gap-1 text-white/60 text-xs">
            <Eye size={12} />
            {match.views.toLocaleString()} views
          </div>
        </div>
      </div>

      {/* Carousel controls */}
      {matches.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((c) => (c - 1 + matches.length) % matches.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 btn btn-circle btn-xs bg-white/20 hover:bg-white/30 border-0 text-white"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => setCurrent((c) => (c + 1) % matches.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-circle btn-xs bg-white/20 hover:bg-white/30 border-0 text-white"
          >
            <ChevronRight size={14} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 right-5 flex gap-1.5">
            {matches.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === current ? "bg-white w-4" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
