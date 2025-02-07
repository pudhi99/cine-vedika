// src/app/page.js
import MovieList from "@/components/movies/movie-list";
import prisma from "@/lib/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function HomePage() {
  const theatricalReleases = await prisma.movie.findMany({
    where: {
      releaseType: "THEATRICAL",
      releaseDate: { gte: new Date() },
    },
    include: { ottRelease: true },
    orderBy: { releaseDate: "asc" },
  });

  const ottReleases = await prisma.movie.findMany({
    where: {
      releaseType: "OTT",
      releaseDate: { gte: new Date() },
    },
    include: { ottRelease: true },
    orderBy: { releaseDate: "asc" },
  });

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
