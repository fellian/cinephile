// src/app/movie/[id]/page.tsx

import MovieDetailClient from "@/components/MovieDetailClient";
import { Movie } from "@/types/movie"; // ✅ Import tipe Movie

export const dynamic = "force-dynamic";

// ✅ Beri tipe pada movie agar tidak pakai "any"
export async function generateStaticParams() {
  const res = await fetch("https://686bc80014219674dcc614c3.mockapi.io/movies");
  const movies: Movie[] = await res.json();

  return movies.map((movie) => ({
    id: movie.id,
  }));
}

export default async function MovieDetailPage({ params }: { params: { id: string } }) {
  const id = params.id;

  const res = await fetch(`https://686bc80014219674dcc614c3.mockapi.io/movies/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="py-10 text-center text-red-600 font-semibold">
        Movie not found.
      </div>
    );
  }

  const movie: Movie = await res.json(); // ✅ Gunakan tipe Movie

  return <MovieDetailClient movie={movie} />;
}
