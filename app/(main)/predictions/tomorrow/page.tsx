import { redirect } from "next/navigation";

// No "tomorrow" API endpoint — redirect to today's predictions.
export default function TomorrowPredictionsPage() {
  redirect("/predictions/today");
}
