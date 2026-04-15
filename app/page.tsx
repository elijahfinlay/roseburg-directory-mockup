import { redirect } from "next/navigation";

// Root redirects to /directory as the primary mockup entry point
export default function Home() {
  redirect("/directory");
}
