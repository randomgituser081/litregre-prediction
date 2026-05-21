import Link from "next/link";
import { Trophy, Twitter, Facebook, Instagram, Youtube, ChevronRight } from "lucide-react";

const FOOTER_PREDICTIONS = [
  { label: "General Predictions", href: "/" },
  { label: "Today's Tips", href: "/predictions/today" },
  { label: "VIP Predictions", href: "/predictions/vip" },
  { label: "Accumulator Tips", href: "/predictions/accumulator-tips" },
  { label: "Bet of the Day", href: "/predictions/bet-of-the-day" },
];

const FOOTER_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Responsible Gambling", href: "/responsible-gambling" },
  { label: "Contact", href: "/contact" },
];

const SOCIAL = [
  { icon: <Twitter size={15} />, href: "#", label: "Twitter" },
  { icon: <Facebook size={15} />, href: "#", label: "Facebook" },
  { icon: <Instagram size={15} />, href: "#", label: "Instagram" },
  { icon: <Youtube size={15} />, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-neutral text-neutral-content mt-8">
      {/* Divider accent */}
      <div className="h-1 bg-gradient-to-r from-primary via-amber-400 to-primary" />

      {/* Main body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* ── Brand col (wider) ── */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <Trophy size={19} className="text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                LitreGre<span className="text-amber-400"> Prediction</span>
              </span>
            </Link>

            <p className="text-sm text-neutral-content/60 leading-relaxed mb-5 max-w-xs">
              Free daily football predictions. Sign up to unlock VIP tips,
              accumulators and today&apos;s best picks — all in one place.
            </p>

            {/* Social icons */}
            <div className="flex gap-2">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-neutral-content/10 hover:bg-primary hover:text-white flex items-center justify-center transition-all hover:scale-110"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Predictions col ── */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-content/40 mb-4">
              Predictions
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_PREDICTIONS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1.5 text-sm text-neutral-content/65 hover:text-primary transition-colors"
                  >
                    <ChevronRight
                      size={12}
                      className="text-neutral-content/30 group-hover:text-primary transition-colors flex-shrink-0"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Quick links col ── */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-content/40 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1.5 text-sm text-neutral-content/65 hover:text-primary transition-colors"
                  >
                    <ChevronRight
                      size={12}
                      className="text-neutral-content/30 group-hover:text-primary transition-colors flex-shrink-0"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Sign up CTA */}
            <div className="mt-6 p-3.5 rounded-xl bg-primary/10 border border-primary/20">
              <p className="text-xs text-neutral-content/60 mb-2">
                Get VIP predictions free
              </p>
              <Link
                href="/signup?invite=1"
                className="btn btn-primary btn-xs w-full"
              >
                Create Account
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-content/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-neutral-content/40">
            © {new Date().getFullYear()} LitreGre Prediction. All rights reserved.
          </p>
          <p className="text-xs text-neutral-content/30 text-center sm:text-right max-w-md">
            ⚠️ Predictions are for informational purposes only. Gamble responsibly. 18+.
          </p>
        </div>
      </div>
    </footer>
  );
}
