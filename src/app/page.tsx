import { Suspense } from "react";
import HomePageClientWrapper from "@/components/HomePageClientWrapper";

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center text-gray-400 text-center">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          Loading homepage...
        </div>
      }
    >
      <HomePageClientWrapper />
    </Suspense>
  );
}
