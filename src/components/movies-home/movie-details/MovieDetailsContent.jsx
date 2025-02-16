"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Calendar,
  Clock,
  Film,
  Users,
  BadgeDollarSign,
  Music,
  Camera,
  Scissors,
  MapPin,
  Tv,
  Link as LinkIcon,
  Building,
  Trophy,
  Globe,
  Monitor,
  Award,
  Flag,
  PlayCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { MovieDetailsSkeleton } from "./MovieDetailsSkeleton";

// Helper Components
const QuickInfoCard = ({ icon, title, value }) => {
  if (!value) return null;
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        {icon}
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const CrewMember = ({ icon, title, name }) => {
  if (!name) return null;
  return (
    <div className="flex items-center gap-4 p-4">
      {icon}
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="font-semibold">{name}</p>
      </div>
    </div>
  );
};

const ReviewCard = ({ review }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{review.source}</h3>
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          <span className="ml-1">{review.rating}/5</span>
        </div>
      </div>
      <p className="text-muted-foreground">{review.review}</p>
    </CardContent>
  </Card>
);

const CastMember = ({ member }) => (
  <Card>
    <CardContent className="p-4">
      <Users className="mb-2 h-8 w-8" />
      <h4 className="font-semibold line-clamp-1">{member.name}</h4>
      <p className="text-sm text-muted-foreground line-clamp-2">
        {member.role}
      </p>
    </CardContent>
  </Card>
);

export function MovieDetailsContent({ movieName }) {
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovie() {
      try {
        setLoading(true);
        const response = await fetch(`/api/movie-home/${movieName}`);
        if (!response.ok) throw new Error("Failed to fetch movie details");
        const data = await response.json();
        console.log(data, "data");
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (movieName) {
      fetchMovie();
    }
  }, [movieName]);

  if (loading) {
    return <MovieDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <p className="text-destructive">Error: {error}</p>
      </div>
    );
  }

  if (!movie) return null;

  // Calculate average rating
  const averageRating =
    movie.criticalResponse?.reduce((acc, curr) => acc + curr.rating, 0) /
      (movie.criticalResponse?.length || 1) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="pb-16"
    >
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden rounded-xl">
        <img
          src={movie.imageUrl || "/api/placeholder/1200/500"}
          alt={movie.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Movie Info */}
      <div className="relative z-10 -mt-32 space-y-8 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <img
              src={movie.imageUrl || "/api/placeholder/200/300"}
              alt={movie.title}
              className="h-[300px] w-[200px] rounded-lg object-cover shadow-xl"
            />
          </motion.div>
          <div className="flex-1 md:pt-32 space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">{movie.title}</h1>
            <div className="flex flex-wrap gap-2">
              {movie.language && <Badge>{movie.language}</Badge>}
              {movie.country && (
                <Badge variant="outline">
                  <Globe className="mr-1 h-3 w-3" />
                  {movie.country}
                </Badge>
              )}
              {movie.runtime && (
                <Badge variant="outline">
                  <Clock className="mr-1 h-3 w-3" />
                  {movie.runtime}
                </Badge>
              )}
            </div>
            {averageRating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 font-semibold">
                    {averageRating.toFixed(1)}
                  </span>
                </div>
                <Progress value={averageRating * 20} className="w-24" />
              </div>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cast">Cast & Crew</TabsTrigger>
            <TabsTrigger value="production">Production</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {movie.plot && (
              <Card>
                <CardHeader>
                  <CardTitle>Plot</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed">{movie.plot}</p>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <QuickInfoCard
                icon={<Film />}
                title="Director"
                value={movie.director}
              />
              <QuickInfoCard
                icon={<Calendar />}
                title="Release Date"
                value={movie.releaseDate}
              />
              <QuickInfoCard
                icon={<BadgeDollarSign />}
                title="Budget"
                value={movie.budget}
              />
              <QuickInfoCard
                icon={<Trophy />}
                title="Box Office"
                value={movie.boxOffice}
              />
              <QuickInfoCard
                icon={<Building />}
                title="Production Company"
                value={movie.productionCompany}
              />
              <QuickInfoCard
                icon={<Music />}
                title="Music Director"
                value={movie.music}
              />
            </div>
          </TabsContent>

          {/* Cast & Crew Tab */}
          <TabsContent value="cast" className="space-y-6">
            {movie.cast && (
              <Card>
                <CardHeader>
                  <CardTitle>Cast</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {movie.cast.map((member, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <CastMember member={member} />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Crew</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <CrewMember
                  icon={<Camera />}
                  title="Cinematography"
                  name={movie.cinematography}
                />
                <CrewMember
                  icon={<Scissors />}
                  title="Editing"
                  name={movie.editing}
                />
                <CrewMember
                  icon={<Music />}
                  title="Music Director"
                  name={movie.music}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Production Tab */}
          <TabsContent value="production" className="space-y-6">
            {movie.production && (
              <Card>
                <CardHeader>
                  <CardTitle>Production Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed">{movie.production}</p>
                </CardContent>
              </Card>
            )}

            {movie.filmingLocations && (
              <Card>
                <CardHeader>
                  <CardTitle>Filming Locations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {movie.filmingLocations.map((location, index) => (
                      <Badge key={index} variant="outline">
                        <MapPin className="mr-1 h-3 w-3" />
                        {location}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Distribution Tab */}
          <TabsContent value="distribution" className="space-y-6">
            {movie.distribution && (
              <Card>
                <CardHeader>
                  <CardTitle>Distribution Rights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {Object.entries(movie.distribution).map(
                      ([region, distributor]) => (
                        <div key={region} className="space-y-1">
                          <h4 className="font-medium capitalize">
                            {region.replace(/_/g, " ")}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {distributor}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {movie.homeMedia && (
              <Card>
                <CardHeader>
                  <CardTitle>Home Media</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {movie.homeMedia.digitalPlatforms?.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Digital Platforms</h4>
                      <div className="flex flex-wrap gap-2">
                        {movie.homeMedia.digitalPlatforms.map(
                          (platform, index) => (
                            <Badge key={index} variant="secondary">
                              <Monitor className="mr-1 h-3 w-3" />
                              {platform}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {movie.homeMedia.satelliteRights && (
                    <div>
                      <h4 className="font-medium mb-2">Satellite Rights</h4>
                      <Badge variant="secondary">
                        <Tv className="mr-1 h-3 w-3" />
                        {movie.homeMedia.satelliteRights}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            {movie.criticalResponse?.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ReviewCard review={review} />
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Source Link */}
      {movie.sourceUrl && (
        <div className="mt-8 text-center">
          <a
            href={movie.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-2"
          >
            <LinkIcon className="h-4 w-4" />
            Source
          </a>
        </div>
      )}
    </motion.div>
  );
}
