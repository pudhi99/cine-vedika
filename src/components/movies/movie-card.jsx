// src/components/movies/movie-card.js
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default function MovieCard({ movie }) {
  const getReleaseTypeColor = (type) => {
    switch (type) {
      case "THEATRICAL":
        return "bg-blue-500";
      case "OTT":
        return "bg-green-500";
      case "PAST_OTT":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="h-full flex flex-col">
      {movie.imageUrl && (
        <div className="relative w-full h-64 overflow-hidden">
          <Image
            src={movie.imageUrl}
            alt={`${movie.title} poster`}
            fill
            className="object-cover"
            sizes="(max-width: 348px) 100vw, (max-width: 258px) 50vw, 33vw"
          />
        </div>
      )}

      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{movie.title}</CardTitle>
          <Badge className={getReleaseTypeColor(movie.releaseType)}>
            {movie.releaseType.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="space-y-2">
          <p>
            <strong>Release Date:</strong> {formatDate(movie.releaseDate)}
          </p>
          <p>
            <strong>Director:</strong> {movie.director}
          </p>
          <p>
            <strong>Cast:</strong> {movie.cast.join(", ")}
          </p>

          {movie.releaseType !== "THEATRICAL" && (
            <p>
              <strong>Platform:</strong> {movie.platform || "TBD"}
            </p>
          )}

          {movie.releaseType === "THEATRICAL" && movie.ottRelease && (
            <div>
              <p>
                <strong>OTT Release:</strong>
              </p>
              <p>
                Date:{" "}
                {movie.ottRelease.date
                  ? formatDate(movie.ottRelease.date)
                  : "TBD"}
              </p>
              <p>Platform: {movie.ottRelease.platform || "TBD"}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
