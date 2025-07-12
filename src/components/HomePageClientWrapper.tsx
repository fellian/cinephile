"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getAllMovies } from "@/lib/api";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Movie } from "@/types/movie";

export default function HomePageClientWrapper() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [favourites, setFavourites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [userKey, setUserKey] = useState<string | null>(null);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search")?.toLowerCase() || "";

  useEffect(() => {
    const fetchMovies = async () => {
      const data: Movie[] = await getAllMovies();
      setMovies(data);
      setLoading(false);
    };

    fetchMovies();

    const currentUser = localStorage.getItem("currentUserKey");
    setUserKey(currentUser);

    if (currentUser) {
      const favs = JSON.parse(localStorage.getItem(`favourites-${currentUser}`) || "[]");
      setFavourites(favs);
    } else {
      setFavourites([]);
    }
  }, []);

  const toggleFavourite = (id: string) => {
    if (!userKey) {
      setShowLoginAlert(true);
      return;
    }

    const updated = favourites.includes(id)
      ? favourites.filter((favId) => favId !== id)
      : [...favourites, id];

    setFavourites(updated);
    localStorage.setItem(`favourites-${userKey}`, JSON.stringify(updated));

    // show toast message
    const message = favourites.includes(id)
      ? "❌ Removed from Favourites"
      : "❤️ Added to Favourites";

    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const genreSet = new Set<string>();
  movies.forEach((movie) => {
    movie.genre.split(",").forEach((g) => genreSet.add(g.trim()));
  });
  const genres = ["All", ...Array.from(genreSet).sort()];

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm);
    const movieGenres = movie.genre.split(",").map((g) => g.trim());
    const matchesGenre =
      selectedGenre === "All" || movieGenres.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  return (
    <section className="py-10 px-4 min-h-screen text-white relative">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-pink-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in-out">
          {toastMessage}
        </div>
      )}

      <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center">
        🎬 Explore Movies
      </h2>
      <p className="text-gray-300 mb-6 text-center">
        Browse and filter your favourite movies!
      </p>

      {/* 🔽 Filter Genre */}
      {!loading && (
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-semibold text-gray-300">🎭 Filter by Genre:</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scroll-smooth custom-scrollbar">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap ${
                  selectedGenre === genre
                    ? "bg-pink-500 text-white shadow"
                    : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 🎥 Movie Cards */}
      {loading ? (
        <div className="text-center text-gray-400 py-20">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          Loading movies...
        </div>
      ) : filteredMovies.length === 0 ? (
        <p className="text-center text-gray-400 italic">No movies found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMovies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="border border-slate-700 rounded-xl bg-slate-800 shadow-md p-4 hover:shadow-xl transition transform hover:scale-[1.02]"
            >
              <Link href={`/movie/${movie.id}`}>
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
              </Link>

              <button
                onClick={() => toggleFavourite(movie.id)}
                className={`mt-3 px-3 py-1 text-sm rounded w-full transition ${
                  favourites.includes(movie.id)
                    ? "bg-pink-400 text-pink-900 font-semibold"
                    : "bg-pink-300 text-pink-800 hover:bg-pink-400"
                }`}
              >
                {favourites.includes(movie.id)
                  ? "💔 Remove from Favourite"
                  : "♡ Add to Favourite"}
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Login Alert Modal */}
      {showLoginAlert && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 text-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-3 text-pink-400">Login Required</h2>
            <p className="text-sm text-gray-300 mb-4">
              Please login to use the favourites feature.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLoginAlert(false)}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-1 rounded"
              >
                Close
              </button>
              <Link
                href="/profile"
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-1 rounded"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
