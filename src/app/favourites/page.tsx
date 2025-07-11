"use client";

import { useEffect, useState } from "react";
import { getAllMovies } from "@/lib/api";
import Link from "next/link";
import Image from "next/image"; // Ganti <img> jadi <Image>

type Movie = {
  id: string;
  title: string;
  genre: string;
  views: number;
  releaseDate: string;
  image: string;
};

export default function FavouritesPage() {
  const [favourites, setFavourites] = useState<string[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [userKey, setUserKey] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("currentUserKey");
    setUserKey(user);

    if (!user) return;

    const storedFavs = JSON.parse(localStorage.getItem(`favourites-${user}`) || "[]");
    setFavourites(storedFavs);

    const fetchMovies = async () => {
      const allMovies: Movie[] = await getAllMovies();
      const favMovies = allMovies.filter((movie) =>
        storedFavs.includes(movie.id)
      );
      setMovies(favMovies);
      setLoading(false);
    };

    fetchMovies();
  }, []);

  const toggleFavourite = (id: string) => {
    if (!userKey) {
      alert("Please login to manage favourites.");
      return;
    }

    const updated = favourites.includes(id)
      ? favourites.filter((favId) => favId !== id)
      : [...favourites, id];

    setFavourites(updated);
    localStorage.setItem(`favourites-${userKey}`, JSON.stringify(updated));

    setMovies((prev) =>
      updated.includes(id)
        ? [...prev, ...movies.filter((m) => m.id === id)]
        : prev.filter((m) => m.id !== id)
    );
  };

  if (!userKey) {
    return (
      <section className="py-10 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">❤️ My Favourites</h2>
        <p className="text-gray-500">You must be logged in to view or manage your favourites.</p>
        <Link href="/profile" className="text-blue-600 underline font-medium">
          Go to Login
        </Link>
      </section>
    );
  }

  return (
    <section className="py-10 px-4">
      <h2 className="text-2xl font-bold mb-4">❤️ My Favourites</h2>
      <p className="text-gray-700 mb-6">Your saved movies will appear here.</p>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : movies.length === 0 ? (
        <p className="text-gray-500 italic">No favourites added yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
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

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavourite(movie.id);
                  }}
                  className={`mt-3 px-3 py-1 text-sm rounded w-full transition ${
                    favourites.includes(movie.id)
                      ? "bg-red-100 text-red-600 font-semibold"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {favourites.includes(movie.id)
                    ? "💔 Remove from Favourite"
                    : "♡ Add to Favourite"}
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
