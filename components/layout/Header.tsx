"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  Trophy,
  Layers,
  LogIn,
  User,
  LogOut,
  Bell,
  Home,
} from "lucide-react";
import MobileMenu from "./MobileMenu";

const NAV_LINKS = [
  {
    label: "Predictions",
    href: "/predictions",
    icon: <Trophy size={16} />,
    children: [
      { label: "General Predictions", href: "/predictions" },
      { label: "Today's Tips", href: "/predictions/today" },
      { label: "VIP Predictions", href: "/predictions/vip" },
    ],
  },
  {
    label: "Accumulator",
    href: "/predictions/accumulator-tips",
    icon: <Layers size={16} />,
    children: [
      { label: "Accumulator of the Day", href: "/predictions/accumulator-tips" },
      { label: "Bet of the Day", href: "/predictions/bet-of-the-day" },
    ],
  },
];

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="bg-primary text-primary-content shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Trophy size={18} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white hidden sm:block">
                LitreGre<span className="text-amber-300"> Prediction</span>
              </span>
              <span className="font-display font-bold text-xl text-white sm:hidden">LG</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
              <Link
                href="/"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === "/" ? "bg-white/20 text-white" : "hover:bg-white/10 text-white/80"
                }`}
              >
                <Home size={15} />
                Today
              </Link>

              {NAV_LINKS.map((nav) =>
                nav.children ? (
                  <div key={nav.label} className="relative">
                    <button
                      onClick={() =>
                        setActiveDropdown(activeDropdown === nav.label ? null : nav.label)
                      }
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        pathname.startsWith(nav.href)
                          ? "bg-white/20 text-white"
                          : "hover:bg-white/10 text-white/80"
                      }`}
                    >
                      {nav.icon}
                      {nav.label}
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${
                          activeDropdown === nav.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {activeDropdown === nav.label && (
                      <div className="absolute top-full left-0 mt-1 w-56 bg-base-100 border border-base-300 rounded-xl shadow-xl z-50 overflow-hidden text-base-content">
                        {nav.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setActiveDropdown(null)}
                            className={`block px-4 py-2.5 text-sm hover:bg-primary/10 hover:text-primary transition-colors ${
                              pathname === child.href ? "bg-primary/10 text-primary font-medium" : ""
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={nav.label}
                    href={nav.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname.startsWith(nav.href)
                        ? "bg-white/20 text-white"
                        : "hover:bg-white/10 text-white/80"
                    }`}
                  >
                    {nav.icon}
                    {nav.label}
                  </Link>
                )
              )}
            </nav>

            {/* Right side controls */}
            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="btn btn-ghost btn-sm btn-circle text-white hover:bg-white/10"
                aria-label="Toggle theme"
              >
                {theme === "eaglelight" ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              {/* Auth */}
              {session?.user ? (
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost btn-sm gap-2 text-white hover:bg-white/10">
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                      {session.user.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <span className="hidden sm:inline text-sm font-medium max-w-[100px] truncate">
                      {session.user.name}
                    </span>
                  </label>
                  <ul tabIndex={0} className="dropdown-content menu menu-sm bg-base-100 border border-base-300 rounded-xl shadow-xl w-48 mt-1 z-50 text-base-content">
                    <li>
                      <Link href="/profile" className="flex items-center gap-2">
                        <User size={15} /> My Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex items-center gap-2 text-error"
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/login" className="btn btn-ghost btn-sm gap-1.5 text-white hover:bg-white/10">
                    <LogIn size={15} />
                    Login
                  </Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                className="btn btn-ghost btn-sm btn-circle lg:hidden text-white hover:bg-white/10"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navLinks={NAV_LINKS}
        session={session}
      />
    </>
  );
}
