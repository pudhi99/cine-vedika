// src/app/page.js
import { getCollection } from "@/lib/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MovieList from "@/components/movies-home/movie-list";

export const dynamic = "force-dynamic";

function serializeDocument(doc) {
  return {
    id: doc._id.toString(),
    title: doc.title,
    releaseDate: doc.releaseDate?.toISOString(),
    director: doc.director,
    cast: doc.cast,
    releaseType: doc.releaseType,
    platform: doc.platform,
    imageUrl: doc.imageUrl,
    ottRelease: doc.ottRelease
      ? {
          date: doc.ottRelease.date?.toISOString(),
          platform: doc.ottRelease.platform,
        }
      : null,
  };
}

export default async function HomePage() {
  const moviesCollection = await getCollection("movies");
  const today = new Date();

  // Theatrical Releases
  const latestTheatricalReleases = await moviesCollection
    .find({
      releaseType: "THEATRICAL",
      releaseDate: { $lte: today },
    })
    .sort({ releaseDate: -1 })
    .limit(7)
    .toArray();

  const upcomingTheatricalReleases = await moviesCollection
    .find({
      releaseType: "THEATRICAL",
      releaseDate: { $gt: today },
    })
    .sort({ releaseDate: 1 })
    .limit(10)
    .toArray();

  // OTT Releases
  const latestOttReleases = await moviesCollection
    .find({
      "ottRelease.date": { $exists: true },
      "ottRelease.date": { $lte: today },
    })
    .sort({ "ottRelease.date": -1 })
    .limit(7)
    .toArray();

  const upcomingOttReleases = await moviesCollection
    .find({
      "ottRelease.date": { $exists: true },
      "ottRelease.date": { $gt: today },
    })
    .sort({ "ottRelease.date": 1 })
    .limit(10)
    .toArray();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Upcoming Releases</h1>
      <Tabs defaultValue="theatrical" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="theatrical">Theatrical Releases</TabsTrigger>
          <TabsTrigger value="ott">OTT Releases</TabsTrigger>
        </TabsList>
        <TabsContent value="theatrical" className="space-y-8">
          <MovieList
            movies={latestTheatricalReleases.map(serializeDocument)}
            title="Latest Theatrical Releases"
          />
          <MovieList
            movies={upcomingTheatricalReleases.map(serializeDocument)}
            title="Upcoming Theatrical Releases"
          />
        </TabsContent>
        <TabsContent value="ott" className="space-y-8">
          <MovieList
            movies={latestOttReleases.map(serializeDocument)}
            title="Latest OTT Releases"
          />
          <MovieList
            movies={upcomingOttReleases.map(serializeDocument)}
            title="Upcoming OTT Releases"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
