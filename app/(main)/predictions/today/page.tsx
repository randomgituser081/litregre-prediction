"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Lock } from "lucide-react";
import dayjs from "dayjs";
import GeneralPredictionCard, {
  type GeneralPrediction,
} from "@/components/predictions/GeneralPredictionCard";
import Pagination from "@/components/ui/Pagination";
import { apiFetch } from "@/lib/apiFetch";

interface ApiResponse {
  items: GeneralPrediction[];
  count: number;
}

const PAGE_SIZE = 30;

function SkeletonRows({ count = 8 }: { count?: number }) {
  return (
    <div className="divide-y divide-base-300">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-3 animate-pulse">
          <div className="w-10 h-3 bg-base-300 rounded" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 bg-base-300 rounded w-2/3" />
            <div className="h-3 bg-base-300 rounded w-1/2" />
          </div>
          <div className="w-12 h-5 bg-base-300 rounded-full" />
          <div className="w-14 h-5 bg-base-300 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default function TodayPredictionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [items, setItems] = useState<GeneralPrediction[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isLoggedIn = status === "authenticated" && !!session?.user;

  const totalPages = Math.ceil(count / PAGE_SIZE) || 1;

  const fetchPage = useCallback(async (p: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch(
        `/api/predictions/today?page=${p}&page_size=${PAGE_SIZE}`
      );
      if (res.status === 401) {
        router.push("/login?callbackUrl=/predictions/today");
        return;
      }
      if (!res.ok) throw new Error("Failed to load.");
      const data = (await res.json()) as ApiResponse;
      setCount(data.count ?? 0);
      setItems(data.items ?? []);
    } catch {
      setError("Could not load today's predictions. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (isLoggedIn) fetchPage(1);
  }, [isLoggedIn, fetchPage]);

  function handlePageChange(p: number) {
    setPage(p);
    fetchPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-5">
        <CalendarDays size={20} className="text-primary flex-shrink-0" />
        <div>
          <h1 className="font-bold text-xl">Today&apos;s Predictions</h1>
          <p className="text-sm text-base-content/55">
            {dayjs().format("dddd, MMMM D YYYY")}
          </p>
        </div>
        {count > 0 && (
          <span className="ml-auto badge badge-primary badge-lg font-bold">
            {count} tips
          </span>
        )}
      </div>

      <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
        {/* Session loading */}
        {status === "loading" && <SkeletonRows />}

        {/* Not logged in */}
        {status !== "loading" && !isLoggedIn && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Lock size={24} className="text-primary" />
            </div>
            <h2 className="font-bold text-lg mb-2">Sign in to see today&apos;s tips</h2>
            <p className="text-sm text-base-content/55 max-w-sm mb-5">
              Today&apos;s predictions are available to registered users. Sign in to access all tips for today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/login?callbackUrl=/predictions/today"
                className="btn btn-primary"
              >
                Sign In
              </Link>
              <Link href="/signup?invite=1" className="btn btn-outline btn-primary">
                Create Account
              </Link>
            </div>
          </div>
        )}

        {/* Loading data */}
        {isLoggedIn && loading && items.length === 0 && <SkeletonRows />}

        {/* Error */}
        {isLoggedIn && error && (
          <div className="p-6 text-center">
            <p className="text-sm text-error mb-3">{error}</p>
            <button
              onClick={() => fetchPage(1)}
              className="btn btn-sm btn-outline btn-primary"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {isLoggedIn && !loading && !error && items.length === 0 && (
          <div className="py-14 text-center">
            <p className="text-3xl mb-2">⚽</p>
            <p className="font-semibold">No predictions for today yet</p>
            <p className="text-xs text-base-content/50 mt-1">Check back later</p>
          </div>
        )}

        {/* Predictions list */}
        {!loading && items.map((p) => (
          <GeneralPredictionCard key={p.game_id} prediction={p} />
        ))}

        {!error && (
          <div className="border-t border-base-300">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
