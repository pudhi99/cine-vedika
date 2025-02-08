// src/app/api/movies/[movieId]/route.js
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/db";

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

export async function PUT(request, { params }) {
  try {
    const moviesCollection = await getCollection("movies");
    const data = await request.json();

    const updateResult = await moviesCollection.updateOne(
      { _id: new ObjectId(params.movieId) },
      { $set: data }
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
