"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { forceSignOutOnExpiry } from "@/lib/apiFetch";

/**
 * Mounted once at app root. Whenever NextAuth refetches the session and
 * reports `expired: true` (because the backend JWT's `exp` has passed),
 * we sign the user out immediately so the UI matches reality.
 */
export default function SessionExpiryWatcher() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return;
    if (session?.expired) {
      const callbackPath =
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : undefined;
      forceSignOutOnExpiry(callbackPath);
    }
  }, [session, status]);

  return null;
}
