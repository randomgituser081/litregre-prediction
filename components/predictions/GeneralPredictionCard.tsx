import dayjs from "dayjs";

export interface GeneralPrediction {
  game_id: string;
  home_team: string;
  away_team: string;
  prediction: string;
  is_finished: boolean;
  date: string;
  date_created: string;
  date_time: string;
  prediction_probability: number;
  is_prediction_correct: boolean | null;
  result_score: string | null;
}

function ConfidenceBadge({ probability }: { probability: number }) {
  // Backend returns whole numbers (e.g. 42 = 42%), not decimals
  const pct = probability > 1 ? Math.round(probability) : Math.round(probability * 100);
  const norm = probability > 1 ? probability / 100 : probability;
  const cls =
    norm >= 0.7 ? "badge-success" : norm >= 0.5 ? "badge-warning" : "badge-error";
  return (
    <span className={`badge badge-sm font-bold ${cls}`}>{pct}%</span>
  );
}

function StatusBadge({ prediction }: { prediction: GeneralPrediction }) {
  if (!prediction.is_finished) {
    return <span className="badge badge-sm badge-ghost text-[10px]">Pending</span>;
  }
  if (prediction.is_prediction_correct === true) {
    return <span className="badge badge-sm badge-success text-[10px]">Won ✓</span>;
  }
  if (prediction.is_prediction_correct === false) {
    return <span className="badge badge-sm badge-error text-[10px]">Lost ✗</span>;
  }
  return <span className="badge badge-sm badge-ghost text-[10px]">Finished</span>;
}

interface Props {
  prediction: GeneralPrediction;
}

export default function GeneralPredictionCard({ prediction }: Props) {
  const kickoff = dayjs(prediction.date);
  const timeStr = kickoff.isValid() ? kickoff.format("HH:mm") : "--:--";
  const dateStr = kickoff.isValid() ? kickoff.format("MMM D") : "";

  return (
    <div className="border-b border-base-300 last:border-0 hover:bg-base-200/40 transition-colors">
      {/* Top row: kickoff + teams horizontally + status */}
      <div className="flex items-center gap-2 sm:gap-3 px-3 py-3">
        {/* Date / time */}
        <div className="w-14 flex-shrink-0 text-center">
          <p className="text-[10px] text-base-content/50 leading-tight">{dateStr}</p>
          <p className="text-xs font-semibold text-base-content/70 leading-tight">
            {timeStr}
          </p>
        </div>

        {/* Teams: home LEFT, away RIGHT */}
        <div className="flex-1 min-w-0 flex items-center gap-1.5 sm:gap-2">
          <p className="text-xs font-bold truncate flex-1 text-right">
            {prediction.home_team}
          </p>
          <span className="text-[10px] font-bold text-base-content/30 flex-shrink-0">
            vs
          </span>
          <p className="text-xs font-bold truncate flex-1 text-left">
            {prediction.away_team}
          </p>
        </div>

        {/* Status */}
        <div className="flex-shrink-0">
          <StatusBadge prediction={prediction} />
        </div>
      </div>

      {/* Bottom row: tip + confidence + (score if finished) */}
      <div className="px-3 pb-2.5 flex items-center gap-2 pl-[68px] sm:pl-[72px]">
        <span className="text-[10px] text-base-content/40 uppercase tracking-wide">
          Tip
        </span>
        <span className="badge badge-primary badge-sm font-bold">
          {prediction.prediction}
        </span>

        <span className="text-[10px] text-base-content/40 uppercase tracking-wide ml-1">
          Conf
        </span>
        <ConfidenceBadge probability={prediction.prediction_probability} />

        {prediction.result_score && (
          <span className="ml-auto text-[11px] font-bold text-primary">
            {prediction.result_score}
          </span>
        )}
      </div>
    </div>
  );
}
