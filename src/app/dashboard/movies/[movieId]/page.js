"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { Pencil, Trash2, ImagePlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Skeleton } from "@/components/ui/skeleton";

const movieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  releaseDate: z.string().min(1, "Release date is required"),
  director: z.string().min(1, "Director is required"),
  cast: z.string().min(1, "Cast is required"),
  releaseType: z.enum(["THEATRICAL", "OTT", "BOTH"]),
  platform: z.string().nullable(),
  imageUrl: z.string().nullable(),
  ottRelease: z.string().nullable(),
});

export default function EditMoviePage({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      title: "",
      releaseDate: "",
      director: "",
      cast: "",
      releaseType: "THEATRICAL",
      platform: "",
      imageUrl: "",
      ottRelease: "",
    },
  });

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const { movieId } = await params;
        const response = await fetch(`/api/movies/${movieId}`);
        const movie = await response.json();

        if (movie) {
          const formattedDate = new Date(movie.releaseDate)
            .toISOString()
            .split("T")[0];

          form.reset({
            ...movie,
            releaseDate: formattedDate,
            cast: movie.cast.join(", "),
            platform: movie.platform || "",
            ottRelease: movie.ottRelease
              ? new Date(movie.ottRelease).toISOString().split("T")[0]
              : "",
          });

          setImagePreview(movie.imageUrl);
        }
      } catch (error) {
        console.error("Error fetching movie:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [params, form]);

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        cast: data.cast.split(",").map((item) => item.trim()),
        platform: data.platform || null,
        ottRelease: data.ottRelease || null,
      };

      const { movieId } = await params;

      const response = await fetch(`/api/movies/${movieId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        router.push("/dashboard/movies");
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating movie:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const { movieId } = await params;
      const response = await fetch(`/api/movies/${movieId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/dashboard/movies");
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  if (loading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-10" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
              <div className="col-span-full space-y-2">
                <Skeleton className="h-4 w-24" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-40 w-32" />
                  <Skeleton className="h-10 w-48" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Edit Movie</CardTitle>
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                movie.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="releaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Release Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="director"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Director</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cast"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cast (comma-separated)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="releaseType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Release Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select release type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="THEATRICAL">Theatrical</SelectItem>
                        <SelectItem value="OTT">OTT</SelectItem>
                        <SelectItem value="BOTH">Both</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ottRelease"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTT Release Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>Movie Poster URL</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <div className="relative h-40 w-32 border rounded-md overflow-hidden">
                          {imagePreview ? (
                            <Image
                              src={imagePreview}
                              alt="Movie poster"
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-muted">
                              <ImagePlus className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <Input
                          {...field}
                          placeholder="Enter image URL"
                          className="max-w-xs"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
