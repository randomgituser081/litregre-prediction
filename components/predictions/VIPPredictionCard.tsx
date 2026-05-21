import dayjs from "dayjs";

export interface VIPPrediction {
  match_id: string;
  competition_name: string;
  competition_country: string;
  kickoff: string | null;
  status: string;
  home_name: string;
  home_logo: string | null;
  away_name: string;
  away_logo: string | null;
  label: string;
  probability: number;
  odds: number;
}

function TeamLogo({ src, alt }: { src: string | null; alt: string }) {
  if (!src) {
    return (
      <div className="w-7 h-7 rounded-full bg-base-300 flex items-center justify-center flex-shrink-0">
        <span className="text-[8px] font-bold text-base-content/40">
          {alt.slice(0, 2).toUpperCase()}
        </span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className="w-7 h-7 object-contain flex-shrink-0"
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
  );
}

function ConfidenceBadge({ probability }: { probability: number }) {
  const pct = probability > 1 ? Math.round(probability) : Math.round(probability * 100);
  const norm = probability > 1 ? probability / 100 : probability;
  const cls =
    norm >= 0.7 ? "badge-success" : norm >= 0.5 ? "badge-warning" : "badge-error";
  return <span className={`badge badge-sm font-bold ${cls}`}>{pct}%</span>;
}

interface Props {
  prediction: VIPPrediction;
}

export default function VIPPredictionCard({ prediction }: Props) {
  const kickoff = prediction.kickoff ? dayjs(prediction.kickoff) : null;
  const timeStr = kickoff?.isValid() ? kickoff.format("HH:mm") : "--:--";
  const dateStr = kickoff?.isValid() ? kickoff.format("MMM D") : "";

  return (
    <div className="border border-base-300 rounded-xl overflow-hidden mb-3 shadow-sm bg-base-100 hover:shadow-md transition-shadow">
      {/* Competition header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-primary/10 to-transparent border-b border-base-300">
        <span className="text-[10px] font-bold text-primary uppercase tracking-wide">
          {prediction.competition_name}
        </span>
        <span className="text-[10px] text-base-content/40">•</span>
        <span className="text-[10px] text-base-content/50">
          {prediction.competition_country}
        </span>
        <span className="ml-auto text-[10px] text-base-content/50">
          {dateStr} {timeStr}
        </span>
      </div>

      {/* Match row */}
      <div className="flex items-center gap-3 px-3 py-3">
        {/* Home team */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <TeamLogo src={prediction.home_logo} alt={prediction.home_name} />
          <span className="text-xs font-bold truncate">{prediction.home_name}</span>
        </div>

        {/* VS divider */}
        <div className="flex-shrink-0 text-[10px] font-bold text-base-content/30 px-1">
          VS
        </div>

        {/* Away team */}
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span className="text-xs font-bold truncate text-right">
            {prediction.away_name}
          </span>
          <TeamLogo src={prediction.away_logo} alt={prediction.away_name} />
        </div>
      </div>

      {/* Prediction row */}
      <div className="flex items-center gap-2 px-3 pb-3">
        {/* Label */}
        <div className="flex-1">
          <p className="text-[10px] text-base-content/40 uppercase tracking-wide mb-0.5">
            Tip
          </p>
          <span className="badge badge-primary badge-sm font-semibold">
            {prediction.label}
          </span>
        </div>

        {/* Confidence */}
        <div className="text-center">
          <p className="text-[10px] text-base-content/40 mb-0.5">Confidence</p>
          <ConfidenceBadge probability={prediction.probability} />
        </div>

        {/* Odds */}
        <div className="text-center">
          <p className="text-[10px] text-base-content/40 mb-0.5">Odds</p>
          <span className="text-sm font-bold text-base-content">
            {prediction.odds.toFixed(2)}
          </span>
        </div>

        {/* Status */}
        <div className="text-center">
          <p className="text-[10px] text-base-content/40 mb-0.5">Status</p>
          <span className="text-[10px] font-semibold text-base-content/60 capitalize">
            {prediction.status}
          </span>
        </div>
      </div>
    </div>
  );
}
