"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import type React from "react";

import type { Movie, MovieDetails } from "@/lib/api";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/context/FavoritesContext";
import { Button } from "@/components/ui/button";

interface MovieGridProps {
  movies: (Movie | MovieDetails)[] | undefined;
  isLoading: boolean;
  error: string | null;
  showOnlyFavorites?: boolean;
  emptyMessage?: string;
  favoritesEmptyMessage?: string;
}

export function MovieGrid({
  movies = [],
  isLoading,
  error,
  showOnlyFavorites = false,
  emptyMessage = "No movies found. Try a different search.",
  favoritesEmptyMessage = "No favorite movies yet. Start adding some!",
}: MovieGridProps) {
  const { favorites, toggleFavorite } = useFavorites();
  const { isSignedIn } = useUser(); 
  const clerk = useClerk();

  
  const filteredMovies =
    showOnlyFavorites && movies
      ? movies.filter((movie) => favorites.includes(movie.imdbID))
      : movies || [];

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

  if (filteredMovies.length === 0) {
    return <p>{showOnlyFavorites ? favoritesEmptyMessage : emptyMessage}</p>;
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
      {filteredMovies.map((movie) => {
        const isFavorite = favorites.includes(movie.imdbID);

        const handleClick = (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();

          if (!isSignedIn) {
            clerk.redirectToSignIn(); 
            return;
          }

          toggleFavorite(movie.imdbID); 
        };

        return (
          <li key={movie.imdbID} className="relative group">
            <Card className="relative overflow-hidden hover:shadow-md transition-shadow py-0 h-full">
              <Link href={`/movie/${movie.imdbID}`} className="block h-full">
                <CardHeader className="p-0 relative w-full aspect-2/3">
                  {movie.Poster !== "N/A" ? (
                    <Image
                      src={movie.Poster || "/placeholder.svg"}
                      alt={movie.Title}
                      className="object-cover object-center"
                      fill
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      No Image Available
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold">
                    {movie.Title} ({movie.Year})
                  </h2>
                </CardContent>
              </Link>

              <Button
                onClick={handleClick}
                size="icon"
                variant="ghost"
                className={cn(
                  "absolute top-2 right-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all",
                  "opacity-0 group-hover:opacity-100 focus:opacity-100",
                  (isFavorite && isSignedIn) && "opacity-100"
                )}
              >
                <Heart
                  className={cn(
                    "h-5 w-5",
                    isFavorite && isSignedIn ? "text-red-500 fill-red-500" : "text-white"
                  )}
                />
                <span className="sr-only">
                  {isFavorite && isSignedIn ? "Remove from favorites" : "Add to favorites"}
                </span>
              </Button>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
