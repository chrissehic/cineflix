"use client";
// HomePage.tsx
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchMovies, Movie } from "../lib/api";
import { useSearchQuery } from "@/context/SearchQueryContext"; // Import the hook
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const HomePage = () => {
  const { searchQuery } = useSearchQuery(); // Access searchQuery from context
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchMoviesData = async () => {
      if (!searchQuery.trim()) {
        setMovies([]);
        setError(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const fetchedMovies = await fetchMovies(searchQuery);
        setMovies(fetchedMovies);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch movies."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoviesData();
  }, [searchQuery]);

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold mb-8">Movies</h1>
      {(() => {
        if (!searchQuery.trim()) {
          return <p className="text-gray-600">Start a search to see movies.</p>;
        }

        if (isLoading) {
          return <p>Loading...</p>;
        }

        if (error) {
          return (
            <div className="p-4 mb-4 text-red-700 bg-red-100 rounded">
              <p>Error: {error}</p>
            </div>
          );
        }

        if (movies.length === 0) {
          return <p>No movies found. Try a different search.</p>;
        }

        return (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {movies.map((movie) => (
              <li key={movie.imdbID}>
                <Card className="group overflow-hidden hover:shadow-md transition-shadow py-0">
                  <Link href={`/movie/${movie.imdbID}`} className="block">
                    <CardHeader className="p-0 relative w-full h-full aspect-2/3">
                      {movie.Poster !== "N/A" ? (
                        <Image
                          src={movie.Poster}
                          alt={movie.Title}
                          className="object-cover object-center"
                          fill
                        />
                      ) : (
                        ""
                      )}
                    </CardHeader>
                    <CardContent className="p-4">
                      <h2 className="text-xl font-semibold">
                        {movie.Title} ({movie.Year})
                      </h2>
                    </CardContent>
                  </Link>
                </Card>
              </li>
            ))}
          </ul>
        );
      })()}
    </div>
  );
};

export default HomePage;
