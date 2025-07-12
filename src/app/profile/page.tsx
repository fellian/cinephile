"use client";

import { useEffect, useState } from "react";
import { FaUserCircle, FaSignOutAlt, FaLock } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userKey, setUserKey] = useState<string | null>(null);

  useEffect(() => {
    const storedKey = localStorage.getItem("currentUserKey");
    if (storedKey) setUserKey(storedKey);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      const key = `${email}-${password}`;
      localStorage.setItem("currentUserKey", key);
      localStorage.setItem("userEmail", email);
      setUserKey(key);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUserKey");
    localStorage.removeItem("userEmail");
    setUserKey(null);
    setEmail("");
    setPassword("");
  };

  return (
    <section className="min-h-screen flex justify-center items-start px-4 py-10 text-white">
      <div className="w-full max-w-md md:max-w-lg bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-8">
        {userKey ? (
          <div className="text-center space-y-6">
            <FaUserCircle className="text-7xl mx-auto text-pink-400" />
            <h2 className="text-3xl font-bold">Welcome Back 👋</h2>
            <p className="text-gray-300">
              Logged in as:{" "}
              <span className="text-white font-semibold">{userKey.split("-")[0]}</span>
            </p>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md transition font-semibold"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <FaLock className="text-3xl text-pink-400" />
              <h2 className="text-2xl font-bold">Login to Cinephile</h2>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Email</label>
                <input
                  type="email"
                  className="w-full border border-slate-600 bg-slate-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Password</label>
                <input
                  type="password"
                  className="w-full border border-slate-600 bg-slate-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-md transition font-semibold"
              >
                Login
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
