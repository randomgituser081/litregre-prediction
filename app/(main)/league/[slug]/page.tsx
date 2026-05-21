import { redirect } from "next/navigation";

// No leagues API endpoint — redirect home.
export default function LeaguePage() {
  redirect("/");
}
