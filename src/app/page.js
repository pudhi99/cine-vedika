// src/app/page.js
import MovieList from "@/components/movies/movie-list";
import { getCollection } from "@/lib/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function HomePage() {
  const moviesCollection = await getCollection("movies");

  // Fetch theatrical releases
  const theatricalReleases = await moviesCollection
    .find({
      releaseType: "THEATRICAL",
      releaseDate: { $gte: new Date() },
    })
    .sort({ releaseDate: 1 }) // Sort by releaseDate in ascending order
    .toArray();

  // Fetch OTT releases
  const ottReleases = await moviesCollection
    .find({
      releaseType: "OTT",
      releaseDate: { $gte: new Date() },
    })
    .sort({ releaseDate: 1 }) // Sort by releaseDate in ascending order
    .toArray();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Upcoming Releases</h1>

      <Tabs defaultValue="theatrical" className="w-full">
        <TabsList>
          <TabsTrigger value="theatrical">Theatrical Releases</TabsTrigger>
          <TabsTrigger value="ott">OTT Releases</TabsTrigger>
        </TabsList>

        <TabsContent value="theatrical">
          <MovieList movies={theatricalReleases} />
        </TabsContent>

        <TabsContent value="ott">
          <MovieList movies={ottReleases} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
