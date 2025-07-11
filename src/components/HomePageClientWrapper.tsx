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
      alert("Please login to use the favourites feature.");
      return;
    }

    const updated = favourites.includes(id)
      ? favourites.filter((favId) => favId !== id)
      : [...favourites, id];

    setFavourites(updated);
    localStorage.setItem(`favourites-${userKey}`, JSON.stringify(updated));
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
    <section className="py-10 px-4">
      <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">🎬 Explore Movies</h2>
      <p className="text-gray-700 mb-6 text-center">
        Browse and filter your favourite movies!
      </p>

      {/* 🔽 Filter Genre */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
        <label htmlFor="genre" className="font-medium text-gray-700">
          Filter by Genre:
        </label>
        <select
          id="genre"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      {/* 🎥 Movie Cards */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : filteredMovies.length === 0 ? (
        <p className="text-center text-gray-500 italic">No movies found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMovies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="border rounded-xl shadow-sm p-4 hover:shadow-md transition bg-white"
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
                <p className="text-sm text-gray-600">{movie.genre}</p>
                <p className="text-sm text-gray-500">👁️ {movie.views}</p>
                <p className="text-xs text-gray-500 mt-1">📅 {movie.releaseDate}</p>
              </Link>

              <button
                onClick={() => toggleFavourite(movie.id)}
                className={`mt-3 px-3 py-1 text-sm rounded w-full transition ${
                  favourites.includes(movie.id)
                    ? "bg-pink-200 text-pink-700 font-semibold"
                    : "bg-pink-100 text-pink-600 hover:bg-pink-200"
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
    </section>
  );
}
