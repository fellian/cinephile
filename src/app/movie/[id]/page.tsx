// src/app/movie/[id]/page.tsx
import { Movie } from "@/types/movie";
import MovieDetailClient from "@/components/MovieDetailClient";

export const dynamic = "force-dynamic";

export default async function MovieDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetch(`https://686bc80014219674dcc614c3.mockapi.io/movies/${params.id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="py-10 text-center text-red-600 font-semibold">
        Movie not found.
      </div>
    );
  }

  const movie: Movie = await res.json();
  return <MovieDetailClient movie={movie} />;
}

export async function generateStaticParams(): Promise<{ id: string }[]> {
  const res = await fetch("https://686bc80014219674dcc614c3.mockapi.io/movies");
  const movies: Movie[] = await res.json();

  return movies.map((movie) => ({
    id: movie.id,
  }));
}
