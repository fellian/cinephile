// src/app/movie/[id]/page.tsx
import { Movie } from "@/types/movie";
import MovieDetailClient from "@/components/MovieDetailClient";

export const dynamic = "force-dynamic"; // Gunakan SSR agar data selalu fresh (opsional)

// ✅ Tipe props untuk App Router Page
type PageProps = {
  params: {
    id: string;
  };
};

// ✅ Fungsi utama halaman detail film
export default async function MovieDetailPage({ params }: PageProps) {
  const res = await fetch(`https://686bc80014219674dcc614c3.mockapi.io/movies/${params.id}`, {
    cache: "no-store", // Nonaktifkan cache agar data selalu up-to-date
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

// ✅ Fungsi untuk pre-render halaman secara statis (opsional)
export async function generateStaticParams(): Promise<PageProps["params"][]> {
  const res = await fetch("https://686bc80014219674dcc614c3.mockapi.io/movies");

  if (!res.ok) {
    return []; // Jika error saat fetch, return array kosong
  }

  const movies: Movie[] = await res.json();

  return movies.map((movie) => ({
    id: movie.id,
  }));
}