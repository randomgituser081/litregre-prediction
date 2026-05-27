import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { loginUser, extractToken } from "./predictionApi";

/** Decode a JWT payload without verifying (server has already validated it). */
function decodeJwtExp(token: string | undefined): number | undefined {
  if (!token) return undefined;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return undefined;
    // base64url → base64 → JSON
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const json = Buffer.from(padded, "base64").toString("utf-8");
    const payload = JSON.parse(json) as { exp?: number };
    return typeof payload.exp === "number" ? payload.exp : undefined;
  } catch {
    return undefined;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        phone: { label: "Phone Number", type: "text" },
        pin: { label: "PIN", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.pin) return null;

        const number = credentials.phone.replace(/\D/g, "");

        const { ok, data } = await loginUser({ number, pin: credentials.pin });
        if (!ok) return null;

        const backendToken = extractToken(data) ?? undefined;

        return {
          id: number,
          name: `User ${number.slice(-4)}`,
          email: `${number}@litregreprediction.local`,
          backendToken,
        };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.backendToken = user.backendToken;
        token.backendTokenExp = decodeJwtExp(user.backendToken);
      }
      return token;
    },
    async session({ session, token }) {
      const nowSeconds = Math.floor(Date.now() / 1000);
      const exp = token.backendTokenExp;
      const expired = typeof exp === "number" && exp <= nowSeconds;

      if (session.user) {
        session.user.id = token.id;
        // Only expose the backend token while it's still valid
        session.user.backendToken = expired ? undefined : token.backendToken;
      }
      session.expired = expired;
      return session;
    },
  },
};
