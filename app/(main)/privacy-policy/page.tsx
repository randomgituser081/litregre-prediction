import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – EaglePredict",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display font-bold text-3xl mb-6">Privacy Policy</h1>
      <div className="prose prose-sm max-w-none text-base-content/80 space-y-5">
        <p className="text-base-content/60 text-sm">Last updated: January 2025</p>

        {[
          {
            title: "1. Information We Collect",
            body: "We collect information you provide (name, email), usage data (pages visited, predictions viewed), and technical data (IP address, browser type) to improve our service.",
          },
          {
            title: "2. How We Use Your Information",
            body: "We use your information to provide personalized predictions, send important notifications, improve our service, and comply with legal obligations.",
          },
          {
            title: "3. Cookies",
            body: "We use cookies to keep you logged in, remember your preferences (theme, selected leagues), and analyze site traffic. You can disable cookies in your browser settings.",
          },
          {
            title: "4. Third-Party Services",
            body: "We link to third-party betting sites. Once you leave EaglePredict, their privacy policies apply. We are not responsible for how these sites handle your data.",
          },
          {
            title: "5. Data Security",
            body: "We implement reasonable security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.",
          },
          {
            title: "6. Your Rights",
            body: "You have the right to access, correct, or delete your personal data. Contact us at privacy@eaglepredict.com to exercise these rights.",
          },
          {
            title: "7. Contact",
            body: "For privacy concerns, email us at privacy@eaglepredict.com.",
          },
        ].map((s) => (
          <div key={s.title}>
            <h2 className="font-bold text-base mb-1.5">{s.title}</h2>
            <p>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
