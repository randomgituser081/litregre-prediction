"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import SessionExpiryWatcher from "./SessionExpiryWatcher";

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus>
      <SessionExpiryWatcher />
      {children}
    </SessionProvider>
  );
}
