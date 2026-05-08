import Link from "next/link";
import { PREDICTION_CATEGORIES } from "@/lib/mockData";

export default function PredictionCategoryBar() {
  return (
    <div className="bg-base-100 border border-base-300 rounded-xl p-3">
      <h3 className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2 px-1">
        Prediction Types
      </h3>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {PREDICTION_CATEGORIES.map((cat) => (
          <Link
            key={cat.type}
            href={`/predictions/${cat.type}`}
            className="flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-lg bg-base-200 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all group text-center"
          >
            <span className="text-base">{cat.icon}</span>
            <span className="text-[10px] font-semibold whitespace-nowrap">{cat.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
