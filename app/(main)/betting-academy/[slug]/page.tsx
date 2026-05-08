import { ACADEMY_ARTICLES } from "@/lib/mockData";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return ACADEMY_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = ACADEMY_ARTICLES.find((a) => a.slug === params.slug);
  if (!article) return { title: "Betting Academy" };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

// Static article body content (in a real app, this would come from a CMS)
const ARTICLE_CONTENT: Record<string, string> = {
  "how-to-bet-on-football": `
## Introduction

Football betting is one of the most popular forms of sports gambling in the world. Whether you're in Nigeria, Ghana, Kenya, or anywhere else in Africa, millions of fans enjoy adding a little extra excitement to their favourite matches by placing bets.

This guide will walk you through everything you need to know to start betting on football safely and intelligently.

## Understanding the Basics

Before you place your first bet, you need to understand the core concepts:

### 1. What is a bookmaker?

A bookmaker (or "bookie") is a company that accepts bets from customers and pays out winnings. Popular bookmakers in Nigeria include **Bet9ja**, **Betano**, **1xBet**, **Betway**, and **Stake**.

### 2. What are odds?

Odds represent the probability of an event happening, and also tell you how much you'll win. In decimal format (the most common in Africa):

- **2.00** means you double your money (win equals your stake)
- **1.50** means you win 50% of your stake
- **3.00** means you win twice your stake

### 3. Common bet types

- **1X2 (Match Result)**: Bet on Home win (1), Draw (X), or Away win (2)
- **Over/Under Goals**: Predict whether there will be more or fewer goals than a set number
- **Both Teams to Score**: Will both teams score at least one goal?
- **Double Chance**: Back two outcomes with one bet

## How to Place Your First Bet

1. **Choose a bookmaker** from our recommended sites
2. **Create an account** and verify your identity
3. **Make a deposit** using your preferred payment method
4. **Navigate to football** in the sports menu
5. **Select a match** you want to bet on
6. **Choose your market** (1X2, Over/Under, etc.)
7. **Enter your stake** and review the potential winnings
8. **Confirm your bet**

## Bankroll Management

Never bet more than you can afford to lose. A good rule of thumb is to never stake more than 2-5% of your total bankroll on a single bet.

## Tips for Beginners

- Start with small stakes while you learn
- Focus on markets you understand well
- Don't chase losses
- Keep records of all your bets
- Use predictions as guidance, not certainty

## Responsible Gambling

Football betting should be fun and entertaining. If you feel like you're losing control of your gambling, please seek help from a responsible gambling organization.
  `,
  "best-football-betting-strategies": `
## Introduction

Professional punters don't just pick teams at random. They use systematic strategies to find value and maximize their chances of long-term profit. Here are 7 proven strategies:

## 1. Value Betting

Value betting is the foundation of professional betting. A value bet occurs when you believe the probability of an outcome is higher than what the bookmaker's odds imply.

**Example**: If you think a team has a 50% chance of winning, and the bookmaker is offering odds of 2.20 (implying ~45% chance), this is a value bet.

## 2. The Bankroll Management Strategy

Set aside a dedicated betting bankroll and never bet more than 2-5% of it on any single bet. This prevents you from going bust during a losing streak.

## 3. Specialise in One or Two Leagues

The more you know about a league, the better your predictions will be. Focus on one or two leagues you follow closely rather than trying to cover everything.

## 4. Home/Away Form Analysis

Teams often perform very differently at home vs away. Always check:
- Home win percentage
- Away form in last 5-10 games
- Goals scored and conceded in each scenario

## 5. Head-to-Head Records

Past meetings between teams can reveal patterns. Some teams consistently perform well against particular opponents regardless of their current form.

## 6. Analyse Team News

Injuries, suspensions, and squad rotations can dramatically change the expected outcome of a match. Always check team news before betting.

## 7. The Poisson Distribution Method

Use Poisson distribution to predict the probability of different scorelines based on historical goal averages. This is used by professional bettors worldwide.

## Conclusion

No strategy guarantees wins, but combining multiple approaches and maintaining discipline will significantly improve your results over time.
  `,
};

export default function AcademyArticlePage({ params }: Props) {
  const article = ACADEMY_ARTICLES.find((a) => a.slug === params.slug);
  if (!article) notFound();

  const content = ARTICLE_CONTENT[params.slug] ?? article.excerpt;
  const related = ACADEMY_ARTICLES.filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-base-content/60 mb-4">
        <Link href="/betting-academy" className="hover:text-primary flex items-center gap-1">
          <ArrowLeft size={14} /> Academy
        </Link>
        <span>/</span>
        <span className="text-base-content truncate font-medium max-w-[200px]">{article.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Article */}
        <article className="lg:col-span-2">
          {/* Header */}
          <div className="mb-5">
            <span className="badge badge-secondary badge-sm mb-2">{article.category}</span>
            <h1 className="font-display font-bold text-2xl sm:text-3xl leading-snug mb-3">
              {article.title}
            </h1>
            <p className="text-base-content/70 text-base leading-relaxed mb-4">
              {article.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-base-content/60 pb-4 border-b border-base-300">
              <span>By {article.author}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={11} /> {article.readTime} min read
              </span>
              <span>•</span>
              <span>{article.publishedAt}</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-sm max-w-none text-base-content leading-relaxed">
            {content.split("\n").map((line, i) => {
              if (line.startsWith("## ")) {
                return (
                  <h2 key={i} className="font-bold text-xl mt-6 mb-3">
                    {line.replace("## ", "")}
                  </h2>
                );
              }
              if (line.startsWith("### ")) {
                return (
                  <h3 key={i} className="font-bold text-base mt-4 mb-2">
                    {line.replace("### ", "")}
                  </h3>
                );
              }
              if (line.startsWith("- ")) {
                return (
                  <li key={i} className="ml-4 text-sm text-base-content/80">
                    {line.replace("- ", "")}
                  </li>
                );
              }
              if (line.trim() === "") return <div key={i} className="h-2" />;
              return (
                <p key={i} className="text-sm text-base-content/80 mb-2 leading-relaxed">
                  {line}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-base-300">
            <span className="text-xs text-base-content/60 flex items-center gap-1">
              <Tag size={11} /> Tags:
            </span>
            {article.tags.map((tag) => (
              <span key={tag} className="badge badge-ghost badge-sm">#{tag}</span>
            ))}
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-4">
          {/* Related articles */}
          <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-base-300">
              <h3 className="font-bold text-sm">Related Articles</h3>
            </div>
            <div className="divide-y divide-base-300">
              {related.map((a) => (
                <Link
                  key={a.id}
                  href={`/betting-academy/${a.slug}`}
                  className="block px-4 py-3 hover:bg-base-200/50 transition-colors group"
                >
                  <p className="text-sm font-medium group-hover:text-primary transition-colors leading-snug mb-1">
                    {a.title}
                  </p>
                  <p className="text-xs text-base-content/60 flex items-center gap-1">
                    <Clock size={10} /> {a.readTime} min
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* All articles */}
          <div className="bg-base-100 border border-base-300 rounded-xl p-4">
            <Link
              href="/betting-academy"
              className="btn btn-outline btn-secondary btn-sm w-full"
            >
              View All Articles →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
