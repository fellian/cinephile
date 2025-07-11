"use client";

import { useEffect, useState } from "react";
import { FaUserCircle, FaSignOutAlt, FaLock } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userKey, setUserKey] = useState<string | null>(null);

  // Saat pertama kali dimuat, cek apakah sudah login
  useEffect(() => {
    const storedKey = localStorage.getItem("currentUserKey");
    if (storedKey) setUserKey(storedKey);
  }, []);

  // Fungsi login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      const key = `${email}-${password}`;
      localStorage.setItem("currentUserKey", key);       // untuk akses favorit user
      localStorage.setItem("userEmail", email);          // bisa dipakai di UI (opsional)
      setUserKey(key);
    }
  };

  // Fungsi logout
  const handleLogout = () => {
    localStorage.removeItem("currentUserKey");
    localStorage.removeItem("userEmail");
    setUserKey(null);
    setEmail("");
    setPassword("");
  };

  // Jika sudah login
  if (userKey) {
    return (
      <section className="py-10 px-6 max-w-lg mx-auto text-center bg-white border rounded-lg shadow-md">
        <FaUserCircle className="text-6xl mx-auto text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Welcome to Cinephile</h2>
        <p className="text-gray-600 mb-4">
          Logged in as: <span className="font-semibold">{userKey.split("-")[0]}</span>
        </p>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </section>
    );
  }

  // Jika belum login
  return (
    <section className="py-12 px-6 max-w-md mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <div className="flex items-center gap-3 mb-6">
          <FaLock className="text-3xl text-blue-600" />
          <h2 className="text-2xl font-bold">Login to Cinephile</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium"
          >
            Login
          </button>
        </form>
      </div>
    </section>
  );
}
