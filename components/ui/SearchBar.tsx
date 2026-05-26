"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  debounceMs?: number;
  initialValue?: string;
}

export default function SearchBar({
  placeholder = "Search…",
  onSearch,
  debounceMs = 350,
  initialValue = "",
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const [debounced, setDebounced] = useState(initialValue);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value.trim()), debounceMs);
    return () => clearTimeout(t);
  }, [value, debounceMs]);

  useEffect(() => {
    onSearch(debounced);
  }, [debounced, onSearch]);

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none">
        <Search size={15} />
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-base-100 border border-base-300 rounded-lg pl-9 pr-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full hover:bg-base-200 flex items-center justify-center text-base-content/50 hover:text-base-content transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
