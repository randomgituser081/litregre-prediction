import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service – LitreGre Prediction",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display font-bold text-3xl mb-6">Terms of Service</h1>
      <div className="prose prose-sm max-w-none text-base-content/80 space-y-5">
        <p className="text-base-content/60 text-sm">Last updated: January 2025</p>

        {[
          {
            title: "1. Acceptance of Terms",
            body: "By accessing or using LitreGre Prediction, you agree to be bound by these Terms of Service. If you disagree with any part, please do not use our service.",
          },
          {
            title: "2. Disclaimer",
            body: "LitreGre Prediction provides football predictions for informational and entertainment purposes only. We do not guarantee the accuracy of predictions. Betting involves risk and you should never bet more than you can afford to lose.",
          },
          {
            title: "3. Age Restriction",
            body: "You must be 18 years or older to use this service. By using LitreGre Prediction, you confirm that you are of legal age to gamble in your jurisdiction.",
          },
          {
            title: "4. Affiliate Disclosure",
            body: "Some links on LitreGre Prediction are affiliate links. We may earn a commission when you sign up to a betting site through our links. This does not affect our editorial independence or the quality of our predictions.",
          },
          {
            title: "5. Intellectual Property",
            body: "All content on LitreGre Prediction, including predictions, analysis, and design, is the property of LitreGre Prediction and may not be reproduced without written permission.",
          },
          {
            title: "6. Limitation of Liability",
            body: "LitreGre Prediction is not liable for any financial losses incurred as a result of acting on our predictions. Users bet entirely at their own risk.",
          },
          {
            title: "7. Changes",
            body: "We reserve the right to update these terms at any time. Continued use of the site after changes constitutes acceptance of the new terms.",
          },
          {
            title: "8. Contact",
            body: "For questions about these terms, please contact us at legal@litregreprediction.com.",
          },
        ].map((section) => (
          <div key={section.title}>
            <h2 className="font-bold text-base mb-1.5">{section.title}</h2>
            <p>{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
