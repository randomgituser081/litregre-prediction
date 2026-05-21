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
  // Backend returns whole numbers (e.g. 42 = 42%), not decimals (0.42)
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

  return (
    <div className="border-b border-base-300 last:border-0 hover:bg-base-200/40 transition-colors">
      <div className="flex items-center gap-2 px-3 py-3">
        {/* Time */}
        <div className="w-11 flex-shrink-0 text-center">
          <span className="text-xs font-semibold text-base-content/60">{timeStr}</span>
        </div>

        {/* Teams */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold truncate">{prediction.home_team}</p>
          <p className="text-xs text-base-content/60 truncate">{prediction.away_team}</p>
          {prediction.result_score && (
            <p className="text-[10px] font-bold text-primary mt-0.5">
              Score: {prediction.result_score}
            </p>
          )}
        </div>

        {/* Prediction label */}
        <div className="hidden sm:block flex-shrink-0 text-right mr-1">
          <p className="text-[10px] text-base-content/40 uppercase tracking-wide">Tip</p>
          <p className="text-xs font-bold text-primary leading-tight max-w-[88px] text-right">
            {prediction.prediction}
          </p>
        </div>

        {/* Probability */}
        <div className="flex-shrink-0">
          <ConfidenceBadge probability={prediction.prediction_probability} />
        </div>

        {/* Status */}
        <div className="flex-shrink-0 w-16 text-right">
          <StatusBadge prediction={prediction} />
        </div>
      </div>

      {/* Mobile: show prediction label below */}
      <div className="sm:hidden px-3 pb-2 flex items-center gap-2">
        <span className="text-[10px] text-base-content/40 uppercase tracking-wide">Tip:</span>
        <span className="text-xs font-bold text-primary">{prediction.prediction}</span>
      </div>
    </div>
  );
}
