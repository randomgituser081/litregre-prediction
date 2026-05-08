import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

const MOCK_USERS = [
  { id: "1", name: "Demo User", phone: "08012345678", pin: "1234", role: "premium" },
];

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

        const normalizedPhone = credentials.phone.replace(/\D/g, "");

        const user = MOCK_USERS.find((u) => u.phone === normalizedPhone);
        if (user && credentials.pin === user.pin) {
          return {
            id: user.id,
            name: user.name,
            email: `${user.phone}@litregreprediction.local`,
          };
        }

        // Allow any valid-looking credentials for demo
        if (normalizedPhone.length >= 10 && credentials.pin.length >= 4) {
          return {
            id: Date.now().toString(),
            name: `User ${normalizedPhone.slice(-4)}`,
            email: `${normalizedPhone}@litregreprediction.local`,
          };
        }

        return null;
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
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
};
