"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import {
  X,
  ChevronDown,
  ChevronRight,
  LogIn,
  Trophy,
  User,
  LogOut,
  Home,
} from "lucide-react";

interface NavChild {
  label: string;
  href: string;
}

interface NavLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: NavChild[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  session: Session | null;
}

export default function MobileMenu({ open, onClose, navLinks, session }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div
        ref={menuRef}
        className="absolute top-0 right-0 h-full w-80 max-w-full bg-base-100 shadow-2xl flex flex-col overflow-hidden"
        style={{ animation: "slideInRight 0.25s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-base-300">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Trophy size={15} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg">
              Eagle<span className="text-secondary">Predict</span>
            </span>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X size={20} />
          </button>
        </div>

        {/* Auth section */}
        {session?.user ? (
          <div className="px-5 py-3 bg-primary/5 border-b border-base-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                {session.user.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div>
                <div className="font-semibold text-sm">{session.user.name}</div>
                <div className="text-xs text-base-content/60">{session.user.email}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-5 py-3 border-b border-base-300">
            <Link href="/login" onClick={onClose} className="btn btn-outline btn-sm w-full gap-1">
              <LogIn size={15} /> Login
            </Link>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-2">
          {/* Home */}
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 px-5 py-3 hover:bg-base-200 font-medium transition-colors"
          >
            <Home size={18} className="text-primary" />
            Today's Predictions
          </Link>

          {navLinks.map((nav) =>
            nav.children ? (
              <div key={nav.label}>
                <button
                  onClick={() => setExpanded(expanded === nav.label ? null : nav.label)}
                  className="w-full flex items-center justify-between px-5 py-3 hover:bg-base-200 font-medium transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-primary">{nav.icon}</span>
                    {nav.label}
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${expanded === nav.label ? "rotate-180" : ""}`}
                  />
                </button>

                {expanded === nav.label && (
                  <div className="bg-base-200/50 border-l-2 border-primary ml-5">
                    {nav.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onClose}
                        className="flex items-center gap-2 pl-6 pr-5 py-2.5 text-sm hover:text-primary transition-colors"
                      >
                        <ChevronRight size={12} className="text-base-content/40" />
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
                onClick={onClose}
                className="flex items-center gap-3 px-5 py-3 hover:bg-base-200 font-medium transition-colors"
              >
                <span className="text-primary">{nav.icon}</span>
                {nav.label}
              </Link>
            )
          )}

        </nav>

        {/* Footer links */}
        {session?.user && (
          <div className="px-5 py-3 border-t border-base-300 space-y-1">
            <Link
              href="/profile"
              onClick={onClose}
              className="flex items-center gap-2 py-2 text-sm hover:text-primary transition-colors"
            >
              <User size={16} /> My Profile
            </Link>
            <button
              onClick={() => {
                onClose();
                signOut({ callbackUrl: "/" });
              }}
              className="flex items-center gap-2 py-2 text-sm text-error hover:text-error/80 transition-colors w-full"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
