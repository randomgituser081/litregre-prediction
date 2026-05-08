"use client";

import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  selected: string;
  onChange: (date: string) => void;
}

export default function DatePicker({ selected, onChange }: Props) {
  const today = dayjs();

  // Show 7 days: 3 before today, today, 3 after
  const days = Array.from({ length: 7 }, (_, i) =>
    today.subtract(3, "day").add(i, "day")
  );

  function prev() {
    onChange(dayjs(selected).subtract(1, "day").format("YYYY-MM-DD"));
  }

  function next() {
    onChange(dayjs(selected).add(1, "day").format("YYYY-MM-DD"));
  }

  function label(d: dayjs.Dayjs) {
    if (d.isSame(today, "day")) return "Today";
    if (d.isSame(today.add(1, "day"), "day")) return "Tomorrow";
    if (d.isSame(today.subtract(1, "day"), "day")) return "Yesterday";
    return d.format("ddd");
  }

  return (
    <div className="flex items-center gap-1 bg-base-200 rounded-xl p-1">
      <button
        onClick={prev}
        className="btn btn-ghost btn-xs btn-circle"
        aria-label="Previous day"
      >
        <ChevronLeft size={14} />
      </button>

      <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide">
        {days.map((d) => {
          const dateStr = d.format("YYYY-MM-DD");
          const isSelected = dateStr === selected;
          const isToday = d.isSame(today, "day");

          return (
            <button
              key={dateStr}
              onClick={() => onChange(dateStr)}
              className={`flex-shrink-0 flex flex-col items-center px-2.5 py-1.5 rounded-lg min-w-[44px] transition-all duration-150 ${
                isSelected
                  ? "bg-primary text-white shadow-sm"
                  : "hover:bg-base-300"
              }`}
            >
              <span
                className={`text-[10px] font-medium ${
                  isSelected ? "text-white/80" : isToday ? "text-primary font-bold" : "text-base-content/60"
                }`}
              >
                {label(d)}
              </span>
              <span className={`text-sm font-bold ${isToday && !isSelected ? "text-primary" : ""}`}>
                {d.format("D")}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={next}
        className="btn btn-ghost btn-xs btn-circle"
        aria-label="Next day"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
