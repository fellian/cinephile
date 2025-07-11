// src/app/movie/[id]/page.tsx

import MovieDetailClient from "@/components/MovieDetailClient";

export const dynamic = "force-dynamic";

// Optional: bantu Next tahu semua ID film jika pakai SSG
export async function generateStaticParams() {
  const res = await fetch("https://686bc80014219674dcc614c3.mockapi.io/movies");
  const movies = await res.json();

  return movies.map((movie: any) => ({
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

  const movie = await res.json();

  return <MovieDetailClient movie={movie} />;
}
