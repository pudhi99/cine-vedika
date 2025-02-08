// src/app/dashboard/movies/page.js
"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import debounce from "lodash/debounce";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import Link from "next/link";

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);

  // Memoize fetchMovies to prevent unnecessary re-renders
  const fetchMovies = useCallback(
    async (currentPage, currentLimit, searchTerm) => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/movies?page=${currentPage}&limit=${currentLimit}&search=${searchTerm}`
        );
        const data = await response.json();

        setMovies(data.movies);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false);
      }
    },
    []
  );

  // Memoize the debounced search function
  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      setPage(1);
      fetchMovies(1, limit, searchTerm);
    }, 300),
    [limit, fetchMovies]
  );

  // Handle page change
  const handlePageChange = useCallback(
    (newPage) => {
      setPage(newPage);
      fetchMovies(newPage, limit, search);
    },
    [limit, search, fetchMovies]
  );

  // Handle limit change
  const handleLimitChange = useCallback(
    (newLimit) => {
      setLimit(Number(newLimit));
      setPage(1);
      fetchMovies(1, Number(newLimit), search);
    },
    [search, fetchMovies]
  );

  // Handle search change
  const handleSearchChange = useCallback(
    (e) => {
      const newSearch = e.target.value;
      setSearch(newSearch);
      debouncedSearch(newSearch);
    },
    [debouncedSearch]
  );

  // Initial fetch
  useEffect(() => {
    fetchMovies(page, limit, search);
    // Cleanup
    return () => {
      debouncedSearch.cancel();
    };
  }, []); // Empty dependency array for initial load only

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Movies</CardTitle>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search movies..."
            value={search}
            onChange={handleSearchChange}
            className="max-w-sm"
          />
          <Select value={limit.toString()} onValueChange={handleLimitChange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Movies per page" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value} per page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Release Date</TableHead>
                <TableHead>Director</TableHead>
                <TableHead>Cast</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : movies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No movies found
                  </TableCell>
                </TableRow>
              ) : (
                movies.map((movie) => (
                  <TableRow key={movie._id}>
                    <TableCell className="font-medium">{movie.title}</TableCell>
                    <TableCell>
                      {new Date(movie.releaseDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{movie.director}</TableCell>
                    <TableCell>{movie.cast.join(", ")}</TableCell>
                    <TableCell>{movie.releaseType}</TableCell>
                    <TableCell>{movie.platform || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/dashboard/movies/${movie._id}`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1 || loading}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
                )
                .map((p, i, arr) => {
                  if (i > 0 && arr[i - 1] !== p - 1) {
                    return (
                      <PaginationItem key={`ellipsis-${p}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return (
                    <PaginationItem key={p}>
                      <PaginationLink
                        onClick={() => handlePageChange(p)}
                        isActive={page === p}
                        disabled={loading}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages || loading}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
}
