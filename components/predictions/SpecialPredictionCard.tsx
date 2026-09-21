import Link from "next/link";
import { Play } from "lucide-react";
import { buildSimulationHref } from "@/lib/simulation";
import AddToSlipButton from "@/components/slip/AddToSlipButton";
import {
  getKickoffStatus,
  parsePredictionKickoff,
} from "@/lib/predictionKickoff";

function formatSpecialTip(
  raw: unknown,
  opts?: { home?: string; away?: string; market?: string; averageScore?: string | number }
): string | null {
  if (raw == null || raw === "") return null;
  const s = String(raw).trim();
  const market = (opts?.market || "").toLowerCase();

  if (market === "basketball_over") {
    const line = opts?.averageScore != null ? String(opts.averageScore).trim() : "";
    if (/^over$/i.test(s) || (/over/i.test(s) && !/under/i.test(s))) {
      return line ? `Over ${line} pts` : "Over";
    }
    if (/^under$/i.test(s) || /under/i.test(s)) {
      return line ? `Under ${line} pts` : "Under";
    }
  }

  if (market === "handicap") {
    const line = opts?.averageScore != null ? String(opts.averageScore).trim() : "";
    if (s === "1" || /^home/i.test(s)) {
      const name = opts?.home?.trim();
      if (line) return `${name || "Home"} ${line.startsWith("-") || line.startsWith("+") ? line : `-${line}`}`;
      return name ? `${name} AH` : "Home AH";
    }
    if (s === "2" || /^away/i.test(s)) {
      const name = opts?.away?.trim();
      if (line) return `${name || "Away"} ${line.startsWith("-") || line.startsWith("+") ? line : `+${line}`}`;
      return name ? `${name} AH` : "Away AH";
    }
  }

  if (market === "halftime") {
    if (s === "1") {
      const name = opts?.home?.trim();
      return name ? `${name} HT` : "Home HT";
    }
    if (s === "X" || s === "x") return "Draw HT";
    if (s === "2") {
      const name = opts?.away?.trim();
      return name ? `${name} HT` : "Away HT";
    }
  }

  if (/over[_\s]*1\.?5/i.test(s)) {
    return /no|under/i.test(s) && !/yes/i.test(s) ? "Under 1.5" : "Over 1.5";
  }
  if (/over[_\s]*2\.?5/i.test(s)) {
    return /no|under/i.test(s) && !/yes/i.test(s) ? "Under 2.5" : "Over 2.5";
  }

  // Basketball / tennis API only returns match-winner 1|2 (no O/U tip)
  const isOtherSport =
    market === "basketball" || market === "tennis" || market === "mma";
  if (isOtherSport || /^[12]$/.test(s)) {
    if (s === "1") {
      const name = opts?.home?.trim();
      return name ? `${name} win` : "Home win";
    }
    if (s === "2") {
      const name = opts?.away?.trim();
      return name ? `${name} win` : "Away win";
    }
  }

  return s;
}

function avgScoreLabel(market?: string): string {
  const m = (market || "").toLowerCase();
  if (m === "basketball_over") return "O/U line";
  if (m === "handicap") return "Handicap";
  if (m === "basketball") return "Avg total pts";
  if (m === "tennis") return "Avg games";
  return "Avg score";
}

export interface SpecialPrediction {
  [key: string]: unknown;
  match_id?: string;
  game_id?: string;
  home?: string;
  home_team?: string;
  home_name?: string;
  away?: string;
  away_team?: string;
  away_name?: string;
  home_logo?: string | null;
  away_logo?: string | null;
  prediction?: string;
  label?: string;
  probability?: number;
  prediction_probability?: number;
  confidence?: string | number;
  odds?: number;
  kickoff?: string | null;
  date?: string | null;
  date_time?: string | null;
  datetime?: string | null;
  time?: string | null;
  competition_name?: string;
  competition_country?: string;
  country?: string;
  league?: string;
  status?: string;
  is_finished?: boolean;
  market_type?: string;
  card_score?: string;
  average_card?: number | string;
  corn_score?: string;
  average_corner?: number | string;
  average_score?: number | string;
  fighter_1?: string;
  fighter_2?: string;
  Prediction_outcome?: string;
}

function TeamAvatar({ name, className = "" }: { name: string; className?: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className={`w-9 h-9 rounded-full bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center flex-shrink-0 border border-base-300 ${className}`}>
      <span className="text-[10px] font-black text-base-content/50">
        {initials.slice(0, 2)}
      </span>
    </div>
  );
}

interface Props {
  prediction: SpecialPrediction;
}

export default function SpecialPredictionCard({ prediction }: Props) {
  const home = prediction.home_name || prediction.home_team || prediction.home || prediction.fighter_1 || "Home";
  const away = prediction.away_name || prediction.away_team || prediction.away || prediction.fighter_2 || "Away";
  const market =
    typeof prediction.market_type === "string" ? prediction.market_type : "";
  const tip =
    prediction.label ||
    formatSpecialTip(prediction.prediction, {
      home,
      away,
      market,
      averageScore: prediction.average_score,
    }) ||
    (market === "over_15"
      ? "Over 1.5"
      : market === "over_25"
        ? "Over 2.5"
        : market === "btts"
          ? "BTTS Yes"
          : market === "basketball_over"
            ? "O/U"
          : market === "handicap"
            ? "Handicap"
          : market === "halftime"
            ? "HT"
          : market === "1x2"
            ? "1"
            : "—");
  const prob = prediction.probability ?? prediction.prediction_probability;
  const confidenceLabel =
    typeof prediction.confidence === "string" ? prediction.confidence : null;
  const odds = prediction.odds;
  const competition = prediction.league || prediction.competition_name || "";
  const country = prediction.competition_country || prediction.country || "";

  const rawDate =
    prediction.kickoff ||
    prediction.date ||
    prediction.date_time ||
    (typeof prediction.datetime === "string" ? prediction.datetime : null);
  const rawTime = prediction.time;
  const kickoff = parsePredictionKickoff(prediction);
  const timeStr = rawTime || (kickoff?.isValid() ? kickoff.format("HH:mm") : "");
  const dateStr = kickoff?.isValid() ? kickoff.format("MMM D") : "";
  const status = getKickoffStatus({
    kickoff,
    isFinished: prediction.is_finished,
    status: typeof prediction.status === "string" ? prediction.status : null,
  });

  const extraStats: { label: string; value: string }[] = [];
  if (prediction.card_score) extraStats.push({ label: "Cards", value: prediction.card_score });
  if (prediction.average_card) extraStats.push({ label: "Avg Cards", value: String(prediction.average_card) });
  if (prediction.corn_score) extraStats.push({ label: "Corners", value: prediction.corn_score });
  if (prediction.average_corner) extraStats.push({ label: "Avg Corners", value: String(prediction.average_corner) });
  if (prediction.average_score) {
    extraStats.push({
      label: avgScoreLabel(market),
      value: String(prediction.average_score),
    });
  }
  if (prediction.Prediction_outcome) extraStats.push({ label: "Method", value: prediction.Prediction_outcome });

  const isMMA = !!prediction.fighter_1;
  const isWinnerMarket =
    market === "basketball" || market === "tennis" || market === "mma" || isMMA;
  const simulateHref = buildSimulationHref({
    home,
    away,
    homeLogo: prediction.home_logo,
    awayLogo: prediction.away_logo,
  });

  return (
    <div className="card-animate bg-base-100 border border-base-300 rounded-xl overflow-hidden mb-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
      {/* Header: League + Country + Time */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-base-200/80 to-base-200/30 border-b border-base-300">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-wider truncate">
            {competition}
          </span>
          {country && (
            <>
              <span className="w-1 h-1 rounded-full bg-base-content/20 flex-shrink-0" />
              <span className="text-[10px] text-base-content/50 truncate">{country}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
          <span
            className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${status.tone}`}
          >
            {status.label}
          </span>
          {status.label === "Upcoming" && (
            <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
          )}
          {status.label === "Live" && (
            <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
          )}
          <span className="text-[10px] text-base-content/50 font-medium">
            {dateStr} {timeStr}
          </span>
        </div>
      </div>

      {/* Match: Teams */}
      <Link href={simulateHref} className="block px-4 py-3.5">
        <div className="flex items-center gap-3">
          {/* Home */}
          <div className="flex-1 min-w-0 flex items-center gap-2.5">
            <TeamAvatar name={home} />
            <span className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
              {home}
            </span>
          </div>

          {/* VS badge */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-base-200 border border-base-300 flex items-center justify-center">
              <span className="text-[9px] font-black text-base-content/30">
                {isMMA ? "🥊" : "VS"}
              </span>
            </div>
          </div>

          {/* Away */}
          <div className="flex-1 min-w-0 flex items-center gap-2.5 justify-end">
            <span className="text-sm font-semibold truncate text-right group-hover:text-primary transition-colors">
              {away}
            </span>
            <TeamAvatar name={away} />
          </div>
        </div>
      </Link>

      {/* Footer: Prediction + Stats */}
      <div className="px-4 pb-3.5">
        <div className="flex items-center gap-2 bg-gradient-to-r from-secondary/5 to-primary/5 rounded-lg px-3 py-2.5 border border-base-300/50">
          {/* Tip */}
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <span className="text-[9px] text-base-content/40 uppercase font-semibold flex-shrink-0">
              {isWinnerMarket ? "Winner" : "Tip"}
            </span>
            <span className="bg-secondary text-secondary-content text-[10px] font-bold px-2 py-0.5 rounded-md truncate max-w-[180px] sm:max-w-[240px]">
              {tip}
            </span>
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-base-300/70" />

          {/* Confidence */}
          {prob != null && (
            <>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-base-content/40 uppercase font-semibold">Conf</span>
                <span className={`text-xs font-bold ${
                  (prob > 1 ? prob / 100 : prob) >= 0.7
                    ? "text-success"
                    : (prob > 1 ? prob / 100 : prob) >= 0.5
                      ? "text-warning"
                      : "text-error"
                }`}>
                  {prob > 1 ? Math.round(prob) : Math.round(prob * 100)}%
                </span>
              </div>
              <div className="w-px h-5 bg-base-300/70" />
            </>
          )}
          {prob == null && confidenceLabel && (
            <>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-base-content/40 uppercase font-semibold">Conf</span>
                <span className="text-xs font-bold text-success">{confidenceLabel}</span>
              </div>
              <div className="w-px h-5 bg-base-300/70" />
            </>
          )}

          {/* Odds */}
          {odds != null && (
            <>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-base-content/40 uppercase font-semibold">Odds</span>
                <span className="text-xs font-bold text-base-content">{odds.toFixed(2)}</span>
              </div>
              <div className="w-px h-5 bg-base-300/70" />
            </>
          )}

          {/* Status */}
          <div className="flex items-center gap-1">
            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${status.tone}`}>
              {status.label}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
            {!isMMA && (
              <AddToSlipButton
                compact
                home={home}
                away={away}
                tip={String(prediction.prediction ?? tip)}
                marketHint={
                  typeof prediction.market_type === "string"
                    ? prediction.market_type
                    : null
                }
                kickoff={rawDate}
                source="special"
              />
            )}
            <Link
              href={simulateHref}
              className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"
              title="Simulate this match"
            >
              <Play size={10} /> Sim
            </Link>
          </div>
        </div>

        {/* Extra stats row */}
        {extraStats.length > 0 && (
          <div className="flex items-center gap-3 mt-2 px-1">
            {extraStats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-1">
                <span className="text-[9px] text-base-content/40">{stat.label}:</span>
                <span className="text-[10px] font-bold text-base-content/70">{stat.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
