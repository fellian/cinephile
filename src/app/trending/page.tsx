import { Suspense } from "react";
import TrendingClientWrapper from "@/components/TrendingClientWrapper";

export default function TrendingPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading trending movies...</div>}>
      <TrendingClientWrapper />
    </Suspense>
  );
}
