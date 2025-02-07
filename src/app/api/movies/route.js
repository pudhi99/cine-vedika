// src/app/api/movies/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const jsonData = JSON.parse(await file.text());
    const updates = { created: 0, updated: 0, errors: 0 };

    // Process theatrical releases
    for (const movieData of jsonData.theatrical_releases || []) {
      const result = await processMovie(movieData, "THEATRICAL");
      updates[result.action]++;
    }

    // Process current OTT releases
    for (const movieData of jsonData.ott_releases || []) {
      const result = await processMovie(
        {
          ...movieData,
          ott_release: {
            date: movieData.release_date,
            platform: movieData.platform,
          },
        },
        "OTT"
      );
      updates[result.action]++;
    }

    // Process past OTT releases
    for (const movieData of jsonData.past_ott_releases || []) {
      const result = await processMovie(
        {
          ...movieData,
          ott_release: {
            date: movieData.release_date,
            platform: movieData.platform,
          },
        },
        "PAST_OTT"
      );
      updates[result.action]++;
    }

    return NextResponse.json({
      message: `Processed successfully: ${updates.created} created, ${updates.updated} updated, ${updates.errors} errors`,
      updates,
    });
  } catch (error) {
    console.error("Error processing movies:", error);
    return NextResponse.json(
      { error: "Failed to process movies" },
      { status: 500 }
    );
  }
}

async function processMovie(movieData, releaseType) {
  try {
    // First, try to find the movie by title
    const existingMovie = await prisma.movie.findFirst({
      where: { title: movieData.title },
      include: { ottRelease: true },
    });

    const movieDetails = {
      title: movieData.title,
      releaseDate: new Date(movieData.release_date),
      director: movieData.director,
      cast: movieData.cast,
      releaseType,
      platform: releaseType !== "THEATRICAL" ? movieData.platform : null,
    };

    // Check if there are actual changes before updating
    if (existingMovie) {
      const hasChanges = checkForChanges(
        existingMovie,
        movieDetails,
        movieData.ott_release
      );

      if (!hasChanges) {
        return { action: "unchanged" };
      }

      // Update existing movie with changes
      await prisma.movie.update({
        where: { id: existingMovie.id },
        data: {
          ...movieDetails,
          ottRelease: movieData.ott_release
            ? {
                upsert: {
                  create: {
                    date:
                      movieData.ott_release.date !== "TBD"
                        ? new Date(movieData.ott_release.date)
                        : null,
                    platform:
                      movieData.ott_release.platform !== "TBD"
                        ? movieData.ott_release.platform
                        : null,
                  },
                  update: {
                    date:
                      movieData.ott_release.date !== "TBD"
                        ? new Date(movieData.ott_release.date)
                        : null,
                    platform:
                      movieData.ott_release.platform !== "TBD"
                        ? movieData.ott_release.platform
                        : null,
                  },
                },
              }
            : undefined,
        },
      });

      return { action: "updated" };
    }

    // Create new movie if it doesn't exist
    await prisma.movie.create({
      data: {
        ...movieDetails,
        ottRelease:
          movieData.ott_release && movieData.ott_release.date !== "TBD"
            ? {
                create: {
                  date: new Date(movieData.ott_release.date),
                  platform: movieData.ott_release.platform,
                },
              }
            : undefined,
      },
    });

    return { action: "created" };
  } catch (error) {
    console.error("Error processing movie:", movieData.title, error);
    return { action: "errors" };
  }
}

function checkForChanges(existingMovie, newDetails, newOttRelease) {
  // Check basic movie details
  if (
    existingMovie.releaseDate.toISOString() !==
      new Date(newDetails.releaseDate).toISOString() ||
    existingMovie.director !== newDetails.director ||
    !arraysEqual(existingMovie.cast, newDetails.cast) ||
    existingMovie.platform !== newDetails.platform
  ) {
    return true;
  }

  // Check OTT release details if they exist
  if (newOttRelease && existingMovie.ottRelease) {
    if (
      newOttRelease.date !== "TBD" &&
      (!existingMovie.ottRelease.date ||
        existingMovie.ottRelease.date.toISOString() !==
          new Date(newOttRelease.date).toISOString())
    ) {
      return true;
    }
    if (
      newOttRelease.platform !== "TBD" &&
      existingMovie.ottRelease.platform !== newOttRelease.platform
    ) {
      return true;
    }
  } else if (
    (newOttRelease && !existingMovie.ottRelease) ||
    (!newOttRelease && existingMovie.ottRelease)
  ) {
    return true;
  }

  return false;
}

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((item, index) => item === arr2[index]);
}
