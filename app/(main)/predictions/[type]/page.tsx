import { redirect } from "next/navigation";

// These prediction-type routes have no backend API endpoint.
// Redirect all traffic to the predictions hub.
export default function PredictionTypePage() {
  redirect("/predictions");
}
