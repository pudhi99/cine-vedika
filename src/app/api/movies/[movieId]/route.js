import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/db";

// Helper function to ensure date is in ISO format
const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString();
};

export async function GET(request, { params }) {
  try {
    const moviesCollection = await getCollection("movies");
    const movie = await moviesCollection.findOne({
      _id: new ObjectId(params.movieId),
    });
    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }
    return NextResponse.json(movie);
  } catch (error) {
    console.error("Error fetching movie:", error);
    return NextResponse.json(
      { error: "Failed to fetch movie" },
      { status: 500 }
    );
  }
}

// Helper function to convert string dates to Date objects
const parseDate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString);
};

export async function PUT(request, { params }) {
  try {
    const moviesCollection = await getCollection("movies");
    const data = await request.json();

    // Convert dates to Date objects before storing
    const updateData = {
      ...data,
      releaseDate: data.releaseDate ? parseDate(data.releaseDate) : undefined,
      ottRelease: data.ottRelease
        ? {
            ...data.ottRelease,
            date: data.ottRelease.date
              ? parseDate(data.ottRelease.date)
              : undefined,
          }
        : undefined,
    };

    const updateResult = await moviesCollection.updateOne(
      { _id: new ObjectId(params.movieId) },
      { $set: updateData }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Movie updated successfully" });
  } catch (error) {
    console.error("Error updating movie:", error);
    return NextResponse.json(
      { error: "Failed to update movie" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const moviesCollection = await getCollection("movies");
    const deleteResult = await moviesCollection.deleteOne({
      _id: new ObjectId(params.movieId),
    });
    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Movie deleted successfully" });
  } catch (error) {
    console.error("Error deleting movie:", error);
    return NextResponse.json(
      { error: "Failed to delete movie" },
      { status: 500 }
    );
  }
}
