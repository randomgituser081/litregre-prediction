import Link from "next/link";
import { Trophy, Twitter, Facebook, Instagram, Youtube, Mail } from "lucide-react";

const FOOTER_PREDICTIONS = [
  { label: "Today's Predictions", href: "/" },
  { label: "Accumulator Tips", href: "/predictions/accumulator-tips" },
  { label: "Correct Score", href: "/predictions/correct-score" },
  { label: "Over 2.5 Goals", href: "/predictions/over-25-goals" },
  { label: "Both Teams to Score", href: "/predictions/both-teams-to-score" },
  { label: "Sure 2 Odd", href: "/predictions/sure-2-odd" },
  { label: "Sure 3 Odd", href: "/predictions/sure-3-odd" },
  { label: "Draw No Bet", href: "/predictions/dnb" },
];

const FOOTER_LEAGUES = [
  { label: "Premier League", href: "/league/england-premier-league" },
  { label: "La Liga", href: "/league/spain-la-liga" },
  { label: "Champions League", href: "/league/uefa-champions-league" },
  { label: "Serie A", href: "/league/italy-serie-a" },
  { label: "Bundesliga", href: "/league/germany-bundesliga" },
  { label: "Ligue 1", href: "/league/france-ligue-1" },
  { label: "NPFL Nigeria", href: "/league/nigeria-npfl" },
  { label: "CAF Champions League", href: "/league/caf-champions-league" },
];

export default function Footer() {
  return (
    <footer className="bg-neutral text-neutral-content">
      {/* Top CTA */}
      <div className="bg-primary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="font-display text-xl font-bold text-white mb-2">
            Never Miss a Prediction Again
          </h3>
          <p className="text-primary-content/80 text-sm mb-4">
            Get daily predictions delivered to your inbox. Free forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-sm bg-white text-gray-800 placeholder-gray-400 flex-1 border-0 focus:outline-none"
            />
            <button className="btn btn-sm bg-white text-primary hover:bg-primary-content border-0 font-semibold">
              Subscribe Free
            </button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Trophy size={18} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl">
                LitreGre<span className="text-amber-400"> Prediction</span>
              </span>
            </Link>
            <p className="text-sm text-neutral-content/70 mb-4 leading-relaxed">
              Free daily football predictions and analysis for all major leagues. We help you make smarter betting decisions.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <Twitter size={16} />, href: "#", label: "Twitter" },
                { icon: <Facebook size={16} />, href: "#", label: "Facebook" },
                { icon: <Instagram size={16} />, href: "#", label: "Instagram" },
                { icon: <Youtube size={16} />, href: "#", label: "YouTube" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-full bg-neutral-content/10 hover:bg-primary flex items-center justify-center transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Predictions */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-neutral-content/50">
              Predictions
            </h4>
            <ul className="space-y-2">
              {FOOTER_PREDICTIONS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-content/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Leagues */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-neutral-content/50">
              Leagues
            </h4>
            <ul className="space-y-2">
              {FOOTER_LEAGUES.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-content/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-content/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-content/50">
            <p>© {new Date().getFullYear()} LitreGre Prediction. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="/responsible-gambling" className="hover:text-primary transition-colors">Responsible Gambling</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
          <p className="text-xs text-neutral-content/40 mt-2 text-center sm:text-left">
            ⚠️ Disclaimer: All predictions are for informational and entertainment purposes only. Gambling involves risk. Please gamble responsibly. 18+.
          </p>
        </div>
      </div>
    </footer>
  );
}
