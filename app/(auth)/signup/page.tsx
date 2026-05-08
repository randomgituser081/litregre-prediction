"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Trophy,
  Eye,
  EyeOff,
  Phone,
  Lock,
  Check,
  Send,
  Link2,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const BENEFITS = [
  "Create your secure betting PIN in seconds",
  "Phone-first sign up with quick verification",
  "Link verification with your phone number attached",
  "Faster login with phone number + PIN",
];

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasInviteAccess = searchParams.has("invite");

  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [sentLink, setSentLink] = useState("");

  const pinStrength = (() => {
    if (!pin) return 0;
    let score = 0;
    if (pin.length >= 4) score++;
    if (pin.length >= 5) score++;
    if (!/^([0-9])\1+$/.test(pin)) score++;
    if (!/^(0123|1234|1111|0000|4321|2222)$/.test(pin)) score++;
    return score;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][pinStrength];
  const strengthColor = ["", "bg-error", "bg-warning", "bg-info", "bg-success"][pinStrength];

  useEffect(() => {
    if (!hasInviteAccess) {
      router.replace("/login?inviteRequired=1");
    }
  }, [hasInviteAccess, router]);

  if (!hasInviteAccess) {
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSentLink("");

    const normalizedPhone = phone.replace(/\D/g, "");

    if (normalizedPhone.length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (pin.length < 4) {
      setError("PIN must be at least 4 digits.");
      return;
    }

    if (pin !== confirmPin) {
      setError("PINs do not match.");
      return;
    }

    if (!agreed) {
      setError("Please accept the terms and conditions.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: normalizedPhone,
          pin,
          agreed,
        }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        verificationLink?: string;
      };

      if (!response.ok || !data.ok) {
        setError(data.error ?? "Could not create your account. Please try again.");
        return;
      }

      setSentLink(data.verificationLink ?? "");
      toast.success("Registration started. Verification link sent.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Benefits */}
        <div className="hidden md:flex flex-col justify-center">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4">
            <Trophy size={24} className="text-white" />
          </div>
          <h2 className="font-display font-bold text-3xl mb-2">
            Join LitreGre <span className="text-primary">Prediction</span>
          </h2>
          <p className="text-base-content/60 text-sm mb-6">
            Open your create-PIN registration page, agree to terms, and receive a secure verification link tied to your phone number.
          </p>
          <ul className="space-y-3">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Check size={12} className="text-secondary" />
                </div>
                <span className="text-sm">{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 bg-primary/5 border border-primary/20 rounded-xl p-4">
            <p className="text-xs text-base-content/60">
              "I signed up in under a minute with my phone and PIN. The verification link flow is clean and simple."
            </p>
            <p className="text-xs font-semibold mt-2">- Chinedu I., Abuja</p>
          </div>
        </div>

        {/* Right: Form */}
        <div className="bg-base-100 border border-base-300 rounded-2xl shadow-xl p-8">
          {/* Mobile logo */}
          <div className="text-center mb-5 md:hidden">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mx-auto mb-2">
              <Trophy size={20} className="text-white" />
            </div>
            <h1 className="font-display font-bold text-xl">Create PIN</h1>
          </div>

          <h2 className="hidden md:block font-bold text-xl mb-1">Create your PIN</h2>
          <p className="hidden md:block text-sm text-base-content/60 mb-5">
            Register with your phone number and we will send a verification link.
          </p>

          {/* Error */}
          {error && (
            <div className="alert alert-error mb-4 py-2 text-sm">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {sentLink && (
            <div className="alert alert-success mb-4 py-2 text-sm">
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center gap-2">
                  <Send size={14} />
                  <span>Verification link generated and sent.</span>
                </div>
                <a
                  href={sentLink}
                  className="inline-flex items-center gap-1 text-primary underline break-all"
                >
                  <Link2 size={12} />
                  Open verification link
                </a>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Phone */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-sm font-medium">Phone number</span>
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
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
                <span className="label-text text-sm font-medium">Create PIN</span>
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type={showPin ? "text" : "password"}
                  placeholder="Minimum 4 digits"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  minLength={4}
                  className="input input-bordered w-full pl-9 pr-10 text-sm"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                >
                  {showPin ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {pin && (
                <div className="mt-1.5 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i <= pinStrength ? strengthColor : "bg-base-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-base-content/60">
                    PIN strength: <span className="font-semibold">{strengthLabel}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm PIN */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-sm font-medium">Confirm PIN</span>
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type={showPin ? "text" : "password"}
                  placeholder="Repeat your PIN"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  className={`input input-bordered w-full pl-9 text-sm ${
                    confirmPin && confirmPin !== pin ? "input-error" : ""
                  }`}
                  autoComplete="new-password"
                />
                {confirmPin && confirmPin === pin && (
                  <Check size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-success" />
                )}
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer mt-1">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="checkbox checkbox-primary checkbox-sm mt-0.5 flex-shrink-0"
              />
              <span className="text-xs text-base-content/70 leading-relaxed">
                I agree to the{" "}
                <Link href="/terms-of-service" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                . I confirm I am 18+ years old and I consent to receive a verification link for registration.
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !agreed}
              className="btn btn-primary w-full mt-1"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Register & Send Verification Link"
              )}
            </button>
          </form>

          <div className="divider text-xs text-base-content/40 my-4">
            Already have an account?
          </div>

          <Link href="/login" className="btn btn-outline btn-primary w-full">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="hidden md:block rounded-2xl bg-base-200/60 animate-pulse min-h-[520px]" />
            <div className="rounded-2xl bg-base-100 border border-base-300 shadow-xl p-8 animate-pulse min-h-[520px]" />
          </div>
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}
