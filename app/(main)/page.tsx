"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Trophy, Lock, Crown } from "lucide-react";
import PredictionOfTheDay from "@/components/home/PredictionOfTheDay";
import PastPredictionsList from "@/components/home/PastPredictionsList";
import GeneralPredictionCard, {
  type GeneralPrediction,
} from "@/components/predictions/GeneralPredictionCard";
import VIPPredictionCard, {
  type VIPPrediction,
} from "@/components/predictions/VIPPredictionCard";
import Pagination from "@/components/ui/Pagination";
import SearchBar from "@/components/ui/SearchBar";
import { apiFetch } from "@/lib/apiFetch";

type Tab = "general" | "vip";

interface PaginatedResponse<T> {
  items: T[];
  count: number;
}

const PAGE_SIZE = 10;

function SkeletonRows({ count = 6 }: { count?: number }) {
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

function AuthLockScreen({ title, message, callbackUrl }: { title: string; message: string; callbackUrl?: string }) {
  const loginHref = callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login";
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Lock size={28} className="text-primary" />
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-base-content/60 max-w-sm mb-6">
        {message}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href={loginHref} className="btn btn-primary">
          Sign In
        </Link>
        <Link href="/signup?invite=1" className="btn btn-outline btn-primary">
          Create Account
        </Link>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { data: session, status: authStatus } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>("general");

  // ── Today's tips (General tab — login required) ────────────────────────────
  const [todayItems, setTodayItems] = useState<GeneralPrediction[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [todayPage, setTodayPage] = useState(1);
  const [todayLoading, setTodayLoading] = useState(false);
  const [todayError, setTodayError] = useState("");
  const [todaySearch, setTodaySearch] = useState("");

  // ── VIP predictions ────────────────────────────────────────────────────────
  const [vipItems, setVipItems] = useState<VIPPrediction[]>([]);
  const [vipCount, setVipCount] = useState(0);
  const [vipPage, setVipPage] = useState(1);
  const [vipLoading, setVipLoading] = useState(false);
  const [vipError, setVipError] = useState("");
  const [vipSearch, setVipSearch] = useState("");

  const todayTotalPages = Math.ceil(todayCount / PAGE_SIZE) || 1;
  const vipTotalPages = Math.ceil(vipCount / PAGE_SIZE) || 1;

  const isLoggedIn = authStatus === "authenticated" && !!session?.user;

  // ── Fetch today's tips (login required) ───────────────────────────────────
  const fetchToday = useCallback(async (page: number, search: string) => {
    setTodayLoading(true);
    setTodayError("");
    try {
      const qs = new URLSearchParams({
        page: String(page),
        page_size: String(PAGE_SIZE),
      });
      if (search) qs.set("search", search);
      const res = await apiFetch(`/api/predictions/today?${qs.toString()}`);
      if (res.status === 401) {
        setTodayError("Session expired. Please sign in again.");
        return;
      }
      const data = (await res.json()) as PaginatedResponse<GeneralPrediction>;
      if (!res.ok) throw new Error("Failed to load today's tips.");
      setTodayCount(data.count ?? 0);
      setTodayItems(data.items ?? []);
    } catch {
      setTodayError("Could not load today's tips. Please try again.");
    } finally {
      setTodayLoading(false);
    }
  }, []);

  // ── Fetch VIP ──────────────────────────────────────────────────────────────
  const fetchVIP = useCallback(async (page: number, search: string) => {
    setVipLoading(true);
    setVipError("");
    try {
      const qs = new URLSearchParams({
        page: String(page),
        page_size: String(PAGE_SIZE),
      });
      if (search) qs.set("search", search);
      const res = await apiFetch(`/api/predictions/vip?${qs.toString()}`);
      const data = (await res.json()) as PaginatedResponse<VIPPrediction>;
      if (res.status === 401) {
        setVipError("Session expired. Please sign in again.");
        return;
      }
      if (!res.ok) throw new Error("Failed to load VIP predictions.");
      setVipCount(data.count ?? 0);
      setVipItems(data.items ?? []);
    } catch {
      setVipError("Could not load VIP predictions. Please try again.");
    } finally {
      setVipLoading(false);
    }
  }, []);

  // Refetch today's tips when on General tab (login required) and search changes
  useEffect(() => {
    if (isLoggedIn && activeTab === "general") {
      setTodayPage(1);
      fetchToday(1, todaySearch);
    }
  }, [isLoggedIn, activeTab, fetchToday, todaySearch]);

  // Refetch VIP when on VIP tab and search changes
  useEffect(() => {
    if (isLoggedIn && activeTab === "vip") {
      setVipPage(1);
      fetchVIP(1, vipSearch);
    }
  }, [isLoggedIn, activeTab, fetchVIP, vipSearch]);

  function handleTodayPageChange(page: number) {
    setTodayPage(page);
    fetchToday(page, todaySearch);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleVIPPageChange(page: number) {
    setVipPage(page);
    fetchVIP(page, vipSearch);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4">
      <div className="flex flex-col lg:flex-row gap-4">

        {/* ── Main Feed ── */}
        <div className="flex-1 min-w-0 order-2 lg:order-1">

          {/* Tab bar */}
          <div className="flex gap-2 mb-4 bg-base-100 border border-base-300 rounded-xl p-1.5">
            <button
              onClick={() => setActiveTab("general")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "general"
                  ? "bg-primary text-primary-content shadow-sm"
                  : "text-base-content/60 hover:text-base-content hover:bg-base-200"
              }`}
            >
              <Trophy size={15} />
              General
              {!isLoggedIn && <Lock size={12} className="opacity-60" />}
              {isLoggedIn && todayCount > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeTab === "general"
                      ? "bg-primary-content/20 text-primary-content"
                      : "bg-base-300 text-base-content/60"
                  }`}
                >
                  {todayCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("vip")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "vip"
                  ? "bg-primary text-primary-content shadow-sm"
                  : "text-base-content/60 hover:text-base-content hover:bg-base-200"
              }`}
            >
              <Crown size={15} />
              VIP
              {!isLoggedIn && <Lock size={12} className="opacity-60" />}
              {isLoggedIn && vipCount > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeTab === "vip"
                      ? "bg-primary-content/20 text-primary-content"
                      : "bg-base-300 text-base-content/60"
                  }`}
                >
                  {vipCount}
                </span>
              )}
            </button>
          </div>

          {/* ── General Tab (today's tips — login required) ── */}
          {activeTab === "general" && (
            <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-content">
                <Trophy size={15} />
                <span className="font-bold text-sm">Today&apos;s Tips</span>
                {isLoggedIn && todayCount > 0 && (
                  <span className="text-primary-content/70 text-xs ml-auto">
                    {todayCount} tips
                  </span>
                )}
              </div>

              {!isLoggedIn && authStatus !== "loading" && (
                <AuthLockScreen
                  title="Sign in to see today's tips"
                  message="Today's predictions are available to registered users. Past results are still visible in the Past Predictions panel."
                  callbackUrl="/"
                />
              )}

              {authStatus === "loading" && <SkeletonRows count={6} />}

              {isLoggedIn && (
                <>
                  <div className="p-3 border-b border-base-300 bg-base-200/40">
                    <SearchBar
                      placeholder="Search today's tips by team or competition…"
                      onSearch={setTodaySearch}
                    />
                  </div>

                  {todayLoading && <SkeletonRows count={6} />}

                  {todayError && (
                    <div className="p-6 text-center">
                      <p className="text-sm text-error mb-3">{todayError}</p>
                      <button
                        onClick={() => fetchToday(todayPage, todaySearch)}
                        className="btn btn-sm btn-outline btn-primary"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {!todayLoading && !todayError && todayItems.length === 0 && (
                    <div className="py-12 text-center">
                      <p className="text-3xl mb-2">{todaySearch ? "🔍" : "⚽"}</p>
                      <p className="font-semibold text-sm">
                        {todaySearch
                          ? `No matches for "${todaySearch}"`
                          : "No tips for today yet"}
                      </p>
                      <p className="text-xs text-base-content/50 mt-1">
                        {todaySearch ? "Try a different team or league name" : "Check back later"}
                      </p>
                    </div>
                  )}

                  {!todayLoading &&
                    todayItems.map((p) => (
                      <GeneralPredictionCard key={p.game_id} prediction={p} />
                    ))}

                  {!todayError && todayItems.length > 0 && (
                    <div className="border-t border-base-300">
                      <Pagination
                        currentPage={todayPage}
                        totalPages={todayTotalPages}
                        onPageChange={handleTodayPageChange}
                        loading={todayLoading}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── VIP Tab ── */}
          {activeTab === "vip" && (
            <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-blue-700 text-primary-content">
                <Crown size={15} />
                <span className="font-bold text-sm">VIP Predictions</span>
                {isLoggedIn && vipCount > 0 && (
                  <span className="text-primary-content/70 text-xs ml-auto">
                    {vipCount} tips
                  </span>
                )}
              </div>

              {!isLoggedIn && authStatus !== "loading" && (
                <AuthLockScreen
                  title="VIP Predictions"
                  message="VIP predictions include team logos, competition details, accurate odds and higher-confidence tips. Sign in to unlock access."
                  callbackUrl="/"
                />
              )}

              {authStatus === "loading" && <SkeletonRows count={4} />}

              {isLoggedIn && (
                <>
                  {/* Search bar */}
                  <div className="p-3 border-b border-base-300 bg-base-200/40">
                    <SearchBar
                      placeholder="Search VIP picks by team or league…"
                      onSearch={setVipSearch}
                    />
                  </div>

                  {vipLoading && <SkeletonRows count={4} />}

                  {vipError && (
                    <div className="p-6 text-center">
                      <p className="text-sm text-error mb-3">{vipError}</p>
                      <button
                        onClick={() => fetchVIP(vipPage, vipSearch)}
                        className="btn btn-sm btn-outline btn-primary"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {!vipLoading && !vipError && vipItems.length === 0 && (
                    <div className="py-12 text-center">
                      <p className="text-3xl mb-2">{vipSearch ? "🔍" : "👑"}</p>
                      <p className="font-semibold text-sm">
                        {vipSearch ? `No matches for "${vipSearch}"` : "No VIP predictions yet"}
                      </p>
                      <p className="text-xs text-base-content/50 mt-1">
                        {vipSearch ? "Try a different team or league name" : "Check back later"}
                      </p>
                    </div>
                  )}

                  <div className="p-3">
                    {!vipLoading && vipItems.map((p) => (
                      <VIPPredictionCard key={p.match_id} prediction={p} />
                    ))}
                  </div>

                  {!vipError && vipItems.length > 0 && (
                    <div className="border-t border-base-300">
                      <Pagination
                        currentPage={vipPage}
                        totalPages={vipTotalPages}
                        onPageChange={handleVIPPageChange}
                        loading={vipLoading}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 order-1 lg:order-2 space-y-4">
          <PredictionOfTheDay />
          <PastPredictionsList limit={6} />
        </aside>
      </div>
    </div>
  );
}
