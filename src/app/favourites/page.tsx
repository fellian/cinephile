"use client";

import { useEffect, useState } from "react";
import { getAllMovies } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

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
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("currentUserKey");
    setUserKey(user);

    if (!user) return;

    const storedFavs = JSON.parse(localStorage.getItem(`favourites-${user}`) || "[]");
    setFavourites(storedFavs);

    const fetchMovies = async () => {
      const allMovies: Movie[] = await getAllMovies();
      const favMovies = allMovies.filter((movie) => storedFavs.includes(movie.id));
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

    const isRemoving = favourites.includes(id);
    const updated = isRemoving
      ? favourites.filter((favId) => favId !== id)
      : [...favourites, id];

    setFavourites(updated);
    localStorage.setItem(`favourites-${userKey}`, JSON.stringify(updated));

    setMovies((prev) =>
      isRemoving ? prev.filter((m) => m.id !== id) : [...prev, ...movies.filter((m) => m.id === id)]
    );

    if (isRemoving) {
      setToastMessage("❌ Removed from favourites!");
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  if (!userKey) {
    return (
      <section className="py-10 px-4 min-h-screen text-white text-center">
        <h2 className="text-3xl font-bold mb-4">❤️ My Favourites</h2>
        <p className="text-gray-300 mb-4">
          You must be logged in to view or manage your favourites.
        </p>
        <Link
          href="/profile"
          className="text-pink-400 underline font-medium hover:text-pink-300 transition"
        >
          Go to Login
        </Link>
      </section>
    );
  }

  return (
    <section className="py-10 px-4 min-h-screen text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-pink-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in-out">
          {toastMessage}
        </div>
      )}

      <h2 className="text-3xl font-bold mb-2 text-center">❤️ My Favourites</h2>
      <p className="text-gray-300 mb-6 text-center">
        Your saved movies will appear here.
      </p>

      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : movies.length === 0 ? (
        <p className="text-center text-gray-500 italic">No favourites added yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <Link href={`/movie/${movie.id}`} key={movie.id}>
              <div className="border border-slate-700 rounded-xl shadow-md p-4 hover:shadow-xl transition bg-slate-800 cursor-pointer">
                <Image
                  src={movie.image}
                  alt={movie.title}
                  width={300}
                  height={450}
                  className="aspect-[2/3] object-cover rounded mb-3 w-full"
                />
                <h3 className="font-semibold text-lg">{movie.title}</h3>
                <p className="text-sm text-gray-300">{movie.genre}</p>
                <p className="text-sm text-gray-400">👁️ {movie.views}</p>
                <p className="text-xs text-gray-400 mt-1">📅 {movie.releaseDate}</p>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavourite(movie.id);
                  }}
                  className={`mt-3 px-3 py-1 text-sm rounded w-full transition ${
                    favourites.includes(movie.id)
                      ? "bg-red-300 text-red-900 font-semibold"
                      : "bg-slate-600 text-white hover:bg-slate-500"
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
