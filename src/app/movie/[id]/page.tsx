// src/app/movie/[id]/page.tsx

import MovieDetailClient from "@/components/MovieDetailClient";
import { Movie } from "@/types/movie";

export const dynamic = "force-dynamic";

// ✅ Beri typing eksplisit sesuai struktur Next.js
type PageProps = {
  params: {
    id: string;
  };
};

// ✅ Gunakan typing PageProps di parameter
export default async function MovieDetailPage({ params }: PageProps) {
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

  const movie: Movie = await res.json();

  return <MovieDetailClient movie={movie} />;
}

// ✅ generateStaticParams juga harus pakai typing Movie[]
export async function generateStaticParams() {
  const res = await fetch("https://686bc80014219674dcc614c3.mockapi.io/movies");
  const movies: Movie[] = await res.json();

  return movies.map((movie) => ({
    id: movie.id,
  }));
}
