// lib/api.ts
export async function getAllMovies() {
  const res = await fetch("https://686bc80014219674dcc614c3.mockapi.io/movies", {
    cache: "no-store", // untuk SSR
  });
  return res.json();
}
