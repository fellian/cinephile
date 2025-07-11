"use client";

import Link from "next/link";
import Image from "next/image";
import { Movie } from "@/types/movie";

type Props = {
  movie: Movie;
};

export default function MovieCard({ movie }: Props) {
  return (
    <Link href={`/movie/${movie.id}`}>
      <div className="border rounded-xl shadow-sm p-4 hover:shadow-md transition cursor-pointer bg-white">
        <Image
          src={movie.image}
          alt={movie.title}
          width={300}
          height={450}
          className="aspect-[2/3] object-cover rounded mb-3 w-full"
        />
        <h3 className="font-semibold text-lg">{movie.title}</h3>
        <p className="text-sm text-gray-600">
          {movie.genre}  ⭐{movie.rating}
        </p>
        <p className="text-sm text-gray-600">👁️ {movie.views}</p>
        <p className="text-xs text-gray-500 mt-1">📅 {movie.releaseDate}</p>
      </div>
    </Link>
  );
}
