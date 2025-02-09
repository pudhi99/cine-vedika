// app/movie/[movieId]/page.js
import { MovieDetailsContent } from "@/components/movies-home/movie-details/MovieDetailsContent";
import { MovieDetailsSkeleton } from "@/components/movies-home/movie-details/MovieDetailsSkeleton";
import { Suspense } from "react";

export default async function MovieDetailsPage({ params }) {
  const { movieId } = await params;
  console.log(movieId, "movieId ======================");
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<MovieDetailsSkeleton />}>
        <MovieDetailsContent movieId={movieId} />
      </Suspense>
    </div>
  );
}
