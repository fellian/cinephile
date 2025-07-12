"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { useDebouncedCallback } from "use-debounce";

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Trending", path: "/trending" },
    { name: "Favourites", path: "/favourites" },
    { name: "My Profile", path: "/profile" },
  ];

  // Debounced search handler
  const updateSearch = useDebouncedCallback((value: string) => {
    router.push(`/?search=${encodeURIComponent(value)}`);
  }, 400);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    updateSearch(value);
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-slate-800 to-slate-900 backdrop-blur-md border-b border-slate-700 shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold text-pink-400 tracking-wide hover:text-pink-300 transition-all duration-200"
        >
          🎬 Cinephile
        </Link>

        {/* Desktop Real-time Search */}
        <div className="hidden md:flex flex-grow max-w-md mx-2 gap-2">
          <input
            type="text"
            placeholder="Search movies..."
            className="w-full bg-slate-700 border border-slate-600 px-4 py-2 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-sm"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={clsx(
                  "text-base font-medium transition-all duration-150",
                  pathname === item.path
                    ? "text-pink-400 font-semibold underline underline-offset-4"
                    : "text-gray-300 hover:text-pink-400"
                )}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Icons */}
        <div className="md:hidden flex items-center space-x-4">
          <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <FaSearch className="text-gray-300 text-lg hover:text-pink-400 transition" />
          </button>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <FaTimes className="text-xl text-gray-300 hover:text-red-500 transition" />
            ) : (
              <FaBars className="text-xl text-gray-300 hover:text-pink-400 transition" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden px-4 pb-3">
          <input
            type="text"
            placeholder="Search movies..."
            className="w-full bg-slate-700 border border-slate-600 px-4 py-2 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-sm"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      )}

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pb-4 transition-all duration-300">
          <ul className="space-y-2 bg-slate-800 rounded-lg shadow-lg p-4 border border-slate-700">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={clsx(
                    "block px-4 py-2 rounded-md font-medium transition hover:bg-slate-700",
                    pathname === item.path
                      ? "text-pink-400 font-semibold"
                      : "text-gray-300"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};
