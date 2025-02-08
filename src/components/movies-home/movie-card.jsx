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
    <div className="relative group cursor-pointer">
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-xs">8.5</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            + Watchlist
          </Button>
        </div>
        <div className="space-y-2">
          <Button variant="secondary" className="w-full text-xs h-7">
            Watch options
          </Button>
          <Button
            variant="outline"
            className="w-full text-xs h-7 text-white border-white/20 hover:bg-white/20"
          >
            Trailer
          </Button>
        </div>
      </div>
      <div className="bg-card rounded-lg overflow-hidden">
        <img
          src={movie.imageUrl || "/api/placeholder/200/300"}
          alt={movie.title}
          className="w-full aspect-[2/3] object-cover"
        />
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
        </div>
      </div>
    </div>
  );
}
