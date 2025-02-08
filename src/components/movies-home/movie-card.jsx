// components/movies-home/movie-card.js
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MovieCard({ movie }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-card rounded-lg overflow-hidden">
      <div className="relative w-full">
        <img
          src={movie.imageUrl || "/api/placeholder/180/270"}
          alt={movie.title}
          className="w-full h-[270px] md:h-[300px] object-cover"
        />
        <div className="absolute top-2 right-2 flex items-center gap-2">
          {/* <div className="flex items-center gap-1 bg-black/60 rounded px-1.5 py-0.5">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-xs">8.5</span>
          </div> */}
          {/* <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 bg-black/60 border-white/20 text-white"
          >
            + Watchlist
          </Button> */}
        </div>
      </div>
      <div className="p-3 space-y-1">
        <h3 className="font-semibold text-sm truncate">{movie.title}</h3>
        {movie.ottRelease ? (
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">
              Releases {formatDate(movie.ottRelease.date)}
            </p>
            <p className="text-xs text-muted-foreground">
              on {movie.ottRelease.platform}
            </p>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            {formatDate(movie.releaseDate)}
          </p>
        )}
        {/* <div className="flex flex-col gap-2 mt-2">
          <Button variant="secondary" className="w-full text-xs h-7">
            Watch options
          </Button>
          <Button variant="outline" className="w-full text-xs h-7">
            Trailer
          </Button>
        </div> */}
      </div>
    </div>
  );
}
