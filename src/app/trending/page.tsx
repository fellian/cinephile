"use client";

import { useEffect, useState } from "react";
import { getAllMovies } from "@/lib/api";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Movie } from "@/types/movie";

export default function TrendingPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search")?.toLowerCase() || "";

  const parseViews = (text: string): number => {
    const lower = text.toLowerCase().trim().replace(",", ".");

    if (lower.includes("m")) {
      return parseFloat(lower.replace("m", "").trim()) * 1_000_000_000;
    }

    if (lower.includes("jt")) {
      return parseFloat(lower.replace("jt", "").trim()) * 1_000_000;
    }

    if (lower.includes("rb")) {
      return parseFloat(lower.replace("rb", "").trim()) * 1_000;
    }

    return parseFloat(lower) || 0;
  };

  useEffect(() => {
    const fetchMovies = async () => {
      const all = await getAllMovies();
      const sorted = [...all].sort((a, b) => {
        const viewsA = parseViews(a.views);
        const viewsB = parseViews(b.views);
        return viewsB - viewsA;
      });

      setMovies(sorted);
    };

    fetchMovies();
  }, []);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm)
  );

  return (
    <section className="py-10 px-4">
      <h2 className="text-2xl font-bold mb-4">🔥 Trending Movies</h2>
      <p className="text-gray-700 mb-6">See what movies are popular right now.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMovies.length === 0 ? (
          <p className="col-span-full text-gray-500 italic text-center">
            No movies found.
          </p>
        ) : (
          filteredMovies.map((movie) => (
            <Link href={`/movie/${movie.id}`} key={movie.id}>
              <div className="border rounded-xl shadow-sm p-4 hover:shadow-md transition cursor-pointer bg-white">
                <Image
                  src={movie.image}
                  alt={movie.title}
                  width={300}
                  height={450}
                  className="aspect-[2/3] object-cover rounded mb-3 w-full"
                />
                <h3 className="font-semibold text-lg">{movie.title}</h3>
                <p className="text-sm text-gray-600">{movie.genre}</p>
                <p className="text-sm text-gray-600">👁️ {movie.views}</p>
                <p className="text-xs text-gray-500 mt-1">📅 {movie.releaseDate}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
