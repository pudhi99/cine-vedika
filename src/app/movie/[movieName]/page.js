// app/movie/[movieName]/page.js
import { MovieDetailsContent } from "@/components/movies-home/movie-details/MovieDetailsContent";
import { MovieDetailsSkeleton } from "@/components/movies-home/movie-details/MovieDetailsSkeleton";
import { Suspense } from "react";
import { getCollection } from "@/lib/db";

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const { movieName } = params;
  const decodedTitle = decodeURIComponent(movieName);
  const formattedTitle = decodedTitle.replace(/_/g, " ");

  try {
    const moviesCollection = await getCollection("movies");
    const movie = await moviesCollection.findOne({
      $or: [{ key: movieName }, { title: formattedTitle }],
    });

    if (!movie) {
      return {
        title: "Movie Not Found",
        description: "The requested movie could not be found",
      };
    }

    return {
      title: `${movie.title} | Cine Vedika`,
      description: movie.plot
        ? movie.plot.substring(0, 155) + "..."
        : `Get details about ${movie.title} including cast, release date, and streaming availability`,
      openGraph: {
        title: movie.title,
        description: movie.plot
          ? movie.plot.substring(0, 155) + "..."
          : `Get details about ${movie.title} including cast, release date, and streaming availability`,
        images: movie.imageUrl ? [{ url: movie.imageUrl }] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Movie Details | Cine Vedika",
      description:
        "Get information about the latest movies and where to watch them",
    };
  }
}

export default async function MovieDetailsPage({ params }) {
  const { movieName } = await params;
  console.log(movieName, "movieName ======================");
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<MovieDetailsSkeleton />}>
        <MovieDetailsContent movieName={movieName} />
      </Suspense>
    </div>
  );
}
