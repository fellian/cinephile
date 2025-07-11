"use client";

import { useState, useEffect } from "react";

type Props = {
  onSearch: (term: string) => void;
};

export default function SearchBar({ onSearch }: Props) {
  const [term, setTerm] = useState("");

  useEffect(() => {
    // Panggil onSearch secara otomatis setiap kali term berubah
    const timeout = setTimeout(() => {
      onSearch(term);
    }, 300); // debounce 300ms

    return () => clearTimeout(timeout);
  }, [term, onSearch]);

  return (
    <div className="flex gap-2 max-w-md w-full">
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search by title..."
        className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
      />
    </div>
  );
}
