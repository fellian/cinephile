"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/types/movie";

export default function MovieDetailClient({ movie }: { movie: Movie }) {
  const [favourites, setFavourites] = useState<string[]>([]);
  const [userKey, setUserKey] = useState<string | null>(null);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
      setShowLoginAlert(true);
      return;
    }

    const updated = isFavourite
      ? favourites.filter((id) => id !== movie.id)
      : [...new Set([...favourites, movie.id])];

    setFavourites(updated);
    localStorage.setItem(`favourites-${userKey}`, JSON.stringify(updated));

    const message = isFavourite
      ? "❌ Removed from favourites"
      : "❤️ Added to favourites";
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <section className="py-10 px-4 min-h-screen text-white relative">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-pink-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in-out">
          {toastMessage}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Poster */}
        <div
          className="relative w-full h-[500px] mb-8 shadow-lg rounded-xl overflow-hidden cursor-pointer"
          onClick={() => setIsZoomOpen(true)}
        >
          <Image
            src={movie.image}
            alt={movie.title}
            layout="fill"
            objectFit="cover"
            className="hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-3">{movie.title}</h1>

        {/* Info */}
        <div className="text-gray-300 text-sm mb-6 space-y-1">
          <p><strong className="text-white">Release Date:</strong> {movie.releaseDate}</p>
          <p><strong className="text-white">Genre:</strong> {movie.genre}</p>
          <p><strong className="text-white">Views:</strong> 👁️ {movie.views}</p>
          <p><strong className="text-white">Rating:</strong> ⭐ {movie.rating}</p>
        </div>

        {/* Description */}
        <p className="text-gray-200 leading-relaxed mb-6">{movie.description}</p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          {movie.trailerUrl && (
            <button
              onClick={() => setShowTrailer(true)}
              className="px-5 py-2 rounded-md font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700 transition flex items-center"
            >
              <span className="mr-2">▶</span> Watch Trailer
            </button>
          )}

          <button
            onClick={handleToggleFavourite}
            className={`px-5 py-2 rounded-md font-semibold text-sm transition ${isFavourite
                ? "bg-red-300 text-red-900 hover:bg-red-400"
                : "bg-pink-500 text-white hover:bg-pink-600"
              }`}
          >
            {isFavourite ? "💔 Remove from Favourite" : "♡ Add to Favourites"}
          </button>
        </div>

        {/* Back Link */}
        <div className="mt-8">
          <Link
            href="/"
            className="text-pink-400 hover:underline hover:text-pink-300 transition font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Zoom Poster Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full">
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-2 right-2 text-white text-xl bg-black/50 rounded-full p-2 hover:bg-black"
            >
              ✕
            </button>
            <Image
              src={movie.image}
              alt="Zoom"
              width={1200}
              height={800}
              className="rounded-lg w-full object-contain max-h-[90vh]"
            />
          </div>
        </div>
      )}

      {/* Trailer Modal */}
      {showTrailer && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-2 right-2 text-white text-xl bg-black/50 rounded-full p-2 hover:bg-black"
            >
              ✕
            </button>
            <iframe
              src={movie.trailerUrl.replace("watch?v=", "embed/")}
              title="Trailer"
              allowFullScreen
              className="w-full h-full rounded-xl"
            ></iframe>
          </div>
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
