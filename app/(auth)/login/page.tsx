"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Trophy, Eye, EyeOff, Phone, Lock, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const verified = searchParams.get("verified") === "1";
  const phoneFromQuery = searchParams.get("phone") ?? "";
  const inviteRequired = searchParams.get("inviteRequired") === "1";
  const invalidLink = searchParams.get("invalidLink") === "1";
  const expired = searchParams.get("expired") === "1";

  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (phoneFromQuery) {
      setPhone(phoneFromQuery.replace(/\D/g, ""));
    }
  }, [phoneFromQuery]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const normalizedPhone = phone.replace(/\D/g, "");

    const result = await signIn("credentials", {
      phone: normalizedPhone,
      pin,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid phone number or PIN. Please try again.");
    } else {
      toast.success("Welcome back! 🎉");
      router.push(callbackUrl);
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="bg-base-100 border border-base-300 rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-3">
            <Trophy size={24} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl">
            Welcome back
          </h1>
          <p className="text-base-content/60 text-sm mt-1">
            Sign in to your LitreGre Prediction account
          </p>
        </div>

        {expired && (
          <div className="alert alert-warning mb-4 py-2 text-sm">
            <AlertCircle size={14} />
            Your session has expired. Please sign in again to continue.
          </div>
        )}

        {verified && (
          <div className="alert alert-success mb-4 py-2 text-sm">
            <AlertCircle size={14} />
            Your registration link was verified. Enter your PIN to continue.
          </div>
        )}

        {inviteRequired && (
          <div className="alert alert-warning mb-4 py-2 text-sm">
            <AlertCircle size={14} />
            Registration is invite-only. Open your signup link to continue.
          </div>
        )}

        {invalidLink && (
          <div className="alert alert-error mb-4 py-2 text-sm">
            <AlertCircle size={14} />
            This verification link is invalid or expired.
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="alert alert-error mb-4 py-2 text-sm">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Phone */}
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-sm font-medium">Phone number</span>
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="tel"
                placeholder="08012345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="input input-bordered w-full pl-9 text-sm"
                autoComplete="tel"
              />
            </div>
          </div>

          {/* PIN */}
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-sm font-medium">PIN</span>
              <Link href="/forgot-password" className="label-text-alt text-primary hover:underline text-xs">
                Forgot PIN?
              </Link>
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type={showPin ? "text" : "password"}
                placeholder="Enter your PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                minLength={4}
                className="input input-bordered w-full pl-9 pr-10 text-sm"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
              >
                {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full mt-2"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-4 rounded-lg border border-base-300 bg-base-200/60 px-3 py-2 text-xs text-base-content/70">
          Need an account? Use your invite link to open the registration page.
        </div>
      </div>

      <p className="text-center text-xs text-base-content/40 mt-4">
        By signing in, you agree to our{" "}
        <Link href="/terms-of-service" className="hover:text-primary">Terms</Link>
        {" "}and{" "}
        <Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md"><div className="bg-base-100 border border-base-300 rounded-2xl shadow-xl p-8 animate-pulse h-96" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
