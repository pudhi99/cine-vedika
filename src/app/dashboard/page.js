// src/app/dashboard/page.js
import MovieForm from "@/components/movies/movie-form";
import MovieList from "@/components/movies/movie-list";
import prisma from "@/lib/prisma";

export default async function DashboardPage() {
  const movies = await prisma.movie.findMany({
    include: { ottRelease: true },
    orderBy: { releaseDate: "desc" },
  });

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
