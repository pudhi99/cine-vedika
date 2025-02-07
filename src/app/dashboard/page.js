// src/app/dashboard/page.js
import MovieForm from "@/components/movies/movie-form";
import MovieList from "@/components/movies/movie-list";
import { getCollection } from "@/lib/db";

export default async function DashboardPage() {
  const moviesCollection = await getCollection("movies");

  // Fetch all movies
  const movies = await moviesCollection
    .find({})
    .sort({ releaseDate: -1 }) // Sort by releaseDate in descending order
    .toArray();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Movie Dashboard</h1>
      <div className="max-w-xl">
        <MovieForm />
      </div>
      <MovieList movies={movies} />
    </div>
  );
}
