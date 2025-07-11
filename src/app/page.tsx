import { Suspense } from "react";
import HomePageClientWrapper from "@/components/HomePageClientWrapper";

export default function HomePage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading homepage...</div>}>
      <HomePageClientWrapper />
    </Suspense>
  );
}
