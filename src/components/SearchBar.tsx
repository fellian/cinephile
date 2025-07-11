// components/SearchBar.tsx
"use client";
import { useState } from "react";

type Props = {
  onSearch: (term: string) => void;
};

export default function SearchBar({ onSearch }: Props) {
  const [term, setTerm] = useState("");

  const handleSearch = () => {
    onSearch(term);
  };

  return (
    <div className="flex gap-2 max-w-md w-full">
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search by title..."
        className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
      />
      {/* <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Search
      </button> */}
    </div>
  );
}
