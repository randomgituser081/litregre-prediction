import { redirect } from "next/navigation";

// No match-detail API endpoint — redirect to the predictions hub.
export default function MatchDetailPage() {
  redirect("/predictions");
}
