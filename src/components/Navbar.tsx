"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { FaBars, FaTimes, FaSearch } from "react-icons/fa";

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/?search=${encodeURIComponent(searchTerm)}`);
      setIsSearchOpen(false);
      setSearchTerm("");
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b shadow-sm sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold text-blue-600 tracking-wide hover:text-blue-700 transition-all duration-200"
        >
          🎬 Cinephile
        </Link>

        {/* Desktop Search */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-grow max-w-md mx-2 gap-2"
        >
          <input
            type="text"
            placeholder="Search movies..."
            className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={clsx(
                  "text-base font-medium transition-all duration-150",
                  pathname === item.path
                    ? "text-blue-600 font-semibold underline underline-offset-4"
                    : "text-gray-700 hover:text-blue-500"
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
            <FaSearch className="text-gray-700 text-lg hover:text-blue-600 transition" />
          </button>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <FaTimes className="text-xl text-gray-800 hover:text-red-500 transition" />
            ) : (
              <FaBars className="text-xl text-gray-800 hover:text-blue-600 transition" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search movies..."
              className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>
      )}

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pb-4 transition-all duration-300">
          <ul className="space-y-2 bg-white/90 rounded-lg shadow-lg p-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={clsx(
                    "block px-4 py-2 rounded-md font-medium transition hover:bg-blue-100",
                    pathname === item.path
                      ? "text-blue-600 font-semibold"
                      : "text-gray-800"
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
