import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      /** JWT access token from the prediction backend. */
      backendToken?: string;
    };
    /** True when the backend JWT has expired and the user must sign in again. */
    expired?: boolean;
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    /** JWT access token from the prediction backend. */
    backendToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    /** JWT access token from the prediction backend. */
    backendToken?: string;
    /** Unix timestamp (seconds) when the backend JWT expires. */
    backendTokenExp?: number;
  }
}
