import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Responsible Gambling – LitreGre Prediction",
};

export default function ResponsibleGamblingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-error/10 border border-error/20 rounded-2xl p-6 mb-6">
        <h1 className="font-display font-bold text-2xl mb-2">Responsible Gambling</h1>
        <p className="text-sm text-base-content/70">Gambling should be fun. If it stops being fun, it's time to stop.</p>
      </div>

      <div className="space-y-5 text-sm text-base-content/80">
        <div>
          <h2 className="font-bold text-base mb-2">Signs of Problem Gambling</h2>
          <ul className="space-y-1.5 list-disc list-inside">
            {[
              "Spending more than you can afford to lose",
              "Betting to recover previous losses (chasing losses)",
              "Hiding your gambling from family or friends",
              "Missing work or responsibilities because of gambling",
              "Feeling anxious or irritable when not gambling",
              "Borrowing money to gamble",
            ].map((sign) => (
              <li key={sign}>{sign}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-bold text-base mb-2">How to Gamble Responsibly</h2>
          <ul className="space-y-1.5 list-disc list-inside">
            {[
              "Set a budget and stick to it",
              "Never bet more than you can afford to lose",
              "Don't bet when emotional or under the influence",
              "Take regular breaks",
              "Use deposit limits on betting sites",
              "Self-exclude if you feel out of control",
            ].map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-bold text-base mb-2">Get Help</h2>
          <p className="mb-3">If you or someone you know has a gambling problem, these organizations can help:</p>
          <div className="space-y-2">
            {[
              { name: "Gamblers Anonymous", url: "https://www.gamblersanonymous.org" },
              { name: "BeGambleAware", url: "https://www.begambleaware.org" },
              { name: "GamCare", url: "https://www.gamcare.org.uk" },
            ].map((org) => (
              <a
                key={org.name}
                href={org.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-base-100 border border-base-300 rounded-lg px-4 py-2.5 hover:border-primary/40 transition-colors text-primary font-medium"
              >
                {org.name} →
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
