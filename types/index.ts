// ─── Match & Prediction Types ───────────────────────────────────────────────

export type Outcome = "home" | "draw" | "away";
export type ConfidenceLevel = "high" | "medium" | "low";

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  country: string;
}

export interface League {
  id: string;
  name: string;
  slug: string;
  country: string;
  countryCode: string;
  logo: string;
  season: string;
}

export interface Odds {
  home: number;
  draw: number;
  away: number;
  over25: number;
  under25: number;
  btts: number;
  nobtts: number;
}

export interface Prediction {
  type: PredictionType;
  value: string;
  confidence: ConfidenceLevel;
  analysis: string;
}

export type PredictionType =
  | "straight-win"
  | "correct-score"
  | "over-15"
  | "over-25-goals"
  | "under-35-goals"
  | "under-45"
  | "double-chance"
  | "sure-3-odd"
  | "roll-over-130-odds"
  | "multigoals"
  | "both-teams-to-score"
  | "most-scoring-halves"
  | "sure-2-odd"
  | "win-either-halves"
  | "dnb"
  | "over-95-corners"
  | "under-95-corners"
  | "half-time-full-time"
  | "handicap"
  | "accumulator";

export interface HeadToHead {
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
}

export interface TeamForm {
  result: "W" | "D" | "L";
  score: string;
  opponent: string;
  isHome: boolean;
}

export interface Match {
  id: string;
  slug: string;
  homeTeam: Team;
  awayTeam: Team;
  league: League;
  date: string;
  time: string;
  status: "upcoming" | "live" | "finished";
  homeScore?: number;
  awayScore?: number;
  odds: Odds;
  prediction: Prediction;
  tips: string[];
  analysis: string;
  htPrediction?: string;
  homeForm: TeamForm[];
  awayForm: TeamForm[];
  headToHead: HeadToHead[];
  isFeatured: boolean;
  views: number;
}

// ─── Betting Site Types ──────────────────────────────────────────────────────

export interface BettingSite {
  id: string;
  name: string;
  slug: string;
  logo: string;
  rating: number;
  welcomeBonus: string;
  bonusDetails: string;
  promoCode?: string;
  affiliateUrl: string;
  features: string[];
  countries: string[];
  minDeposit: number;
  currency: string;
  description: string;
  pros: string[];
  cons: string[];
  established: number;
  licenseInfo: string;
}

export interface BettingBonus {
  id: string;
  site: BettingSite;
  title: string;
  type: "welcome" | "no-deposit" | "reload" | "loyalty" | "cashback";
  amount: string;
  code?: string;
  terms: string;
  expiry?: string;
  affiliateUrl: string;
}

// ─── User & Auth Types ───────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "premium" | "admin";
  createdAt: string;
  favoriteTeams: string[];
  favoriteLeagues: string[];
  notifications: boolean;
}

// ─── Accumulator Types ───────────────────────────────────────────────────────

export interface AccumulatorTip {
  id: string;
  date: string;
  title: string;
  matches: {
    match: Match;
    pick: string;
    odds: number;
  }[];
  totalOdds: number;
  confidence: ConfidenceLevel;
  status: "pending" | "won" | "lost";
  analysis: string;
}

// ─── Academy Types ───────────────────────────────────────────────────────────

export interface AcademyArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: number;
  image: string;
  tags: string[];
}

// ─── Navigation ──────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}
