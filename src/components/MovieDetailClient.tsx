"use client";

import { useEffect, useState } from "react";

type Movie = {
  id: string;
  title: string;
  genre: string;
  rating: number;
  image: string;
  releaseDate: string;
  description: string;
  views: string;
};

export default function MovieDetailClient({ movie }: { movie: Movie }) {
  const [favourites, setFavourites] = useState<string[]>([]);
  const [userKey, setUserKey] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("currentUserKey");
    setUserKey(user);

    if (user) {
      const storedFavs = JSON.parse(localStorage.getItem(`favourites-${user}`) || "[]");
      setFavourites(storedFavs);
    } else {
      setFavourites([]);
    }
  }, []);

  const isFavourite = movie?.id && favourites.includes(movie.id);

  const handleToggleFavourite = () => {
    if (!userKey) {
      alert("Please login to add favourites.");
      return;
    }

    const updated = isFavourite
      ? favourites.filter((id) => id !== movie.id)
      : [...new Set([...favourites, movie.id])];

    setFavourites(updated);
    localStorage.setItem(`favourites-${userKey}`, JSON.stringify(updated));
  };

  return (
    <section className="py-10 max-w-3xl mx-auto px-4">
      <img
        src={movie.image}
        alt={movie.title}
        className="w-full object-cover rounded-lg mb-6 max-h-[500px] cursor-pointer"
        onClick={() => window.open(movie.image, "_blank")}
      />

      <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>

      <div className="text-gray-600 text-sm mb-4 space-y-1">
        <p><strong>Release Date:</strong> {movie.releaseDate}</p>
        <p><strong>Genre:</strong> {movie.genre}</p>
        <p><strong>Views:</strong> {movie.views}</p>
        <p><strong>Rating:</strong> ⭐ {movie.rating}</p>
      </div>

      <p className="text-gray-800 leading-relaxed mb-6">{movie.description}</p>

      <button
        onClick={handleToggleFavourite}
        className={`px-4 py-2 rounded text-sm font-medium transition ${
          isFavourite
            ? "bg-red-100 text-red-600 hover:bg-red-200"
            : "bg-pink-100 text-pink-600 hover:bg-pink-200"
        }`}
      >
        {isFavourite ? "💔 Remove from Favourite" : "♡ Add to Favourites"}
      </button>

      <div className="mt-6">
        <a href="/" className="text-blue-600 hover:underline font-medium">
          ← Back to Home
        </a>
      </div>
    </section>
  );
}
