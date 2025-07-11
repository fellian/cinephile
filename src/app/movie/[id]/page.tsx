// src/app/movie/[id]/page.tsx

import MovieDetailClient from "@/components/MovieDetailClient";

export const dynamic = "force-dynamic"; // Optional: agar fetch selalu fresh

type Props = {
  params: {
    id: string;
  };
};

export default async function MovieDetailPage({ params }: Props) {
  // Ambil ID dari parameter URL
  const id = params.id;

  // Fetch data film berdasarkan ID dari mockapi
  const res = await fetch(`https://686bc80014219674dcc614c3.mockapi.io/movies/${id}`, {
    cache: "no-store",
  });

  // Jika gagal fetch
  if (!res.ok) {
    return (
      <div className="py-10 text-center text-red-600 font-semibold">
        Movie not found.
      </div>
    );
  }

  // Parse JSON hasil response
  const movie = await res.json();

  // Render MovieDetailClient dengan props movie
  return <MovieDetailClient movie={movie} />;
}
