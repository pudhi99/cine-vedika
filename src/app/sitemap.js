// app/sitemap.js
import { getCollection } from "@/lib/db";

// Base URL of your website
const BASE_URL = "https://cine-vedika.vercel.app"; // Replace with your actual domain

export default async function sitemap() {
  // Fetch all movies from the database
  const moviesCollection = await getCollection("movies");
  const movies = await moviesCollection.find({}).toArray();

  // Create static routes
  const routes = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/dashboard`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/dashboard/movies`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
  ];

  // Add movie routes
  const movieEntries = movies.map((movie) => {
    // Create a URL-friendly key from the title if not already present
    const movieKey = movie.key || movie.title.replace(/\s+/g, "_");

    return {
      url: `${BASE_URL}/movie/${encodeURIComponent(movieKey)}`,
      lastModified:
        movie.updatedAt || movie.latestUpdate?.timestamp || new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    };
  });

  // Combine static routes with dynamic movie routes
  return [...routes, ...movieEntries];
}
