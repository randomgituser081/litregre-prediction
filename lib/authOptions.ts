import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { loginUser, extractToken } from "./predictionApi";

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
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.backendToken = token.backendToken;
      }
      return session;
    },
  },
};
